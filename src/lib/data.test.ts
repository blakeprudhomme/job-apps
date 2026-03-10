import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Application, TrackerData } from "./types";

// Mock fs/promises before importing data.ts so the module picks up mocks
vi.mock("fs/promises");

import fs from "fs/promises";
import {
  getApplications,
  getApplication,
  addApplication,
  updateApplicationStatus,
  updateApplicationNotes,
  deleteApplication,
  getCompanyDocument,
  saveCompanyDocument,
} from "./data";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeApp(overrides: Partial<Application> = {}): Application {
  return {
    company: "acme",
    displayName: "Acme Corp",
    role: "Engineer",
    status: "interested",
    dateAdded: "2026-01-01",
    dateApplied: null,
    url: "https://acme.com/jobs/1",
    notes: "",
    ...overrides,
  };
}

function makeTracker(apps: Application[] = []): TrackerData {
  return { applications: apps };
}

function mockTracker(apps: Application[] = []) {
  vi.mocked(fs.readFile).mockResolvedValue(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    JSON.stringify(makeTracker(apps)) as any
  );
  vi.mocked(fs.writeFile).mockResolvedValue(undefined);
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(fs.mkdir).mockResolvedValue(undefined);
  vi.mocked(fs.rm).mockResolvedValue(undefined);
  vi.mocked(fs.writeFile).mockResolvedValue(undefined);
});

// ---------------------------------------------------------------------------
// getApplications
// ---------------------------------------------------------------------------

describe("getApplications", () => {
  it("returns all applications", async () => {
    const apps = [makeApp({ company: "acme" }), makeApp({ company: "beta" })];
    mockTracker(apps);
    const result = await getApplications();
    expect(result).toHaveLength(2);
    expect(result[0].company).toBe("acme");
  });

  it("returns empty array when no applications", async () => {
    mockTracker([]);
    const result = await getApplications();
    expect(result).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// getApplication
// ---------------------------------------------------------------------------

describe("getApplication", () => {
  it("returns the matching application by slug", async () => {
    mockTracker([makeApp({ company: "acme" }), makeApp({ company: "beta" })]);
    const result = await getApplication("beta");
    expect(result?.company).toBe("beta");
  });

  it("returns undefined for an unknown slug", async () => {
    mockTracker([makeApp({ company: "acme" })]);
    const result = await getApplication("unknown");
    expect(result).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// addApplication
// ---------------------------------------------------------------------------

describe("addApplication", () => {
  it("appends the new application to the tracker", async () => {
    mockTracker([makeApp({ company: "acme" })]);
    const newApp = makeApp({ company: "beta", displayName: "Beta Inc" });
    await addApplication(newApp);

    const saved = JSON.parse(
      vi.mocked(fs.writeFile).mock.calls[0][1] as string
    ) as TrackerData;
    expect(saved.applications).toHaveLength(2);
    expect(saved.applications[1].company).toBe("beta");
  });
});

// ---------------------------------------------------------------------------
// updateApplicationStatus
// ---------------------------------------------------------------------------

describe("updateApplicationStatus", () => {
  it("updates the status field", async () => {
    mockTracker([makeApp({ company: "acme", status: "interested" })]);
    await updateApplicationStatus("acme", "phone_screen");

    const saved = JSON.parse(
      vi.mocked(fs.writeFile).mock.calls[0][1] as string
    ) as TrackerData;
    expect(saved.applications[0].status).toBe("phone_screen");
  });

  it("sets dateApplied when transitioning to 'applied'", async () => {
    mockTracker([makeApp({ company: "acme", status: "interested", dateApplied: null })]);
    await updateApplicationStatus("acme", "applied");

    const saved = JSON.parse(
      vi.mocked(fs.writeFile).mock.calls[0][1] as string
    ) as TrackerData;
    expect(saved.applications[0].dateApplied).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("does not overwrite an existing dateApplied", async () => {
    mockTracker([makeApp({ company: "acme", status: "phone_screen", dateApplied: "2026-01-15" })]);
    await updateApplicationStatus("acme", "applied");

    const saved = JSON.parse(
      vi.mocked(fs.writeFile).mock.calls[0][1] as string
    ) as TrackerData;
    expect(saved.applications[0].dateApplied).toBe("2026-01-15");
  });

  it("does not set dateApplied for non-applied statuses", async () => {
    mockTracker([makeApp({ company: "acme", status: "interested", dateApplied: null })]);
    await updateApplicationStatus("acme", "rejected");

    const saved = JSON.parse(
      vi.mocked(fs.writeFile).mock.calls[0][1] as string
    ) as TrackerData;
    expect(saved.applications[0].dateApplied).toBeNull();
  });

  it("throws when company is not found", async () => {
    mockTracker([]);
    await expect(updateApplicationStatus("ghost", "applied")).rejects.toThrow(
      "Application not found: ghost"
    );
  });
});

// ---------------------------------------------------------------------------
// updateApplicationNotes
// ---------------------------------------------------------------------------

describe("updateApplicationNotes", () => {
  it("updates the notes field", async () => {
    mockTracker([makeApp({ company: "acme", notes: "" })]);
    await updateApplicationNotes("acme", "Great company, strong team.");

    const saved = JSON.parse(
      vi.mocked(fs.writeFile).mock.calls[0][1] as string
    ) as TrackerData;
    expect(saved.applications[0].notes).toBe("Great company, strong team.");
  });

  it("throws when company is not found", async () => {
    mockTracker([]);
    await expect(updateApplicationNotes("ghost", "notes")).rejects.toThrow(
      "Application not found: ghost"
    );
  });
});

// ---------------------------------------------------------------------------
// deleteApplication
// ---------------------------------------------------------------------------

describe("deleteApplication", () => {
  it("removes the application from the tracker", async () => {
    mockTracker([makeApp({ company: "acme" }), makeApp({ company: "beta" })]);
    await deleteApplication("acme");

    const saved = JSON.parse(
      vi.mocked(fs.writeFile).mock.calls[0][1] as string
    ) as TrackerData;
    expect(saved.applications).toHaveLength(1);
    expect(saved.applications[0].company).toBe("beta");
  });

  it("calls fs.rm on the company directory", async () => {
    mockTracker([makeApp({ company: "acme" })]);
    await deleteApplication("acme");

    expect(vi.mocked(fs.rm)).toHaveBeenCalledOnce();
    const rmPath = vi.mocked(fs.rm).mock.calls[0][0] as string;
    expect(rmPath).toContain("acme");
  });

  it("does not throw if the company directory does not exist", async () => {
    mockTracker([makeApp({ company: "acme" })]);
    vi.mocked(fs.rm).mockRejectedValueOnce(
      Object.assign(new Error("ENOENT"), { code: "ENOENT" })
    );
    await expect(deleteApplication("acme")).resolves.not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// getCompanyDocument
// ---------------------------------------------------------------------------

describe("getCompanyDocument", () => {
  it("returns file content when the file exists", async () => {
    vi.mocked(fs.readFile).mockResolvedValueOnce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "# Resume content" as any
    );
    const result = await getCompanyDocument("acme", "resume");
    expect(result).toBe("# Resume content");
  });

  it("returns null when the file does not exist (ENOENT)", async () => {
    vi.mocked(fs.readFile).mockRejectedValueOnce(
      Object.assign(new Error("ENOENT"), { code: "ENOENT" })
    );
    const result = await getCompanyDocument("acme", "resume");
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// saveCompanyDocument
// ---------------------------------------------------------------------------

describe("saveCompanyDocument", () => {
  it("creates the company directory and writes the file", async () => {
    await saveCompanyDocument("acme", "cover-letter", "Dear Hiring Manager,");

    expect(vi.mocked(fs.mkdir)).toHaveBeenCalledOnce();
    const mkdirPath = vi.mocked(fs.mkdir).mock.calls[0][0] as string;
    expect(mkdirPath).toContain("acme");

    expect(vi.mocked(fs.writeFile)).toHaveBeenCalledOnce();
    const [writePath, content] = vi.mocked(fs.writeFile).mock.calls[0] as [string, string];
    expect(writePath).toContain("cover-letter.md");
    expect(content).toBe("Dear Hiring Manager,");
  });
});
