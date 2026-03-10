import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/data", () => ({
  updateApplicationStatus: vi.fn().mockResolvedValue(undefined),
  updateApplicationNotes: vi.fn().mockResolvedValue(undefined),
  deleteApplication: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { updateStatusAction, updateNotesAction, deleteApplicationAction } from "./tracker";
import * as data from "@/lib/data";
import { revalidatePath } from "next/cache";

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// updateStatusAction
// ---------------------------------------------------------------------------

describe("updateStatusAction", () => {
  it("calls updateApplicationStatus with correct args", async () => {
    await updateStatusAction("acme", "applied");
    expect(data.updateApplicationStatus).toHaveBeenCalledWith("acme", "applied");
  });

  it("revalidates / and /applications/[company]", async () => {
    await updateStatusAction("acme", "applied");
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/applications/acme");
  });
});

// ---------------------------------------------------------------------------
// updateNotesAction
// ---------------------------------------------------------------------------

describe("updateNotesAction", () => {
  it("calls updateApplicationNotes with correct args", async () => {
    await updateNotesAction("acme", "Some notes.");
    expect(data.updateApplicationNotes).toHaveBeenCalledWith("acme", "Some notes.");
  });

  it("revalidates /applications/[company]", async () => {
    await updateNotesAction("acme", "Some notes.");
    expect(revalidatePath).toHaveBeenCalledWith("/applications/acme");
  });

  it("does not revalidate /", async () => {
    await updateNotesAction("acme", "notes");
    expect(revalidatePath).not.toHaveBeenCalledWith("/");
  });
});

// ---------------------------------------------------------------------------
// deleteApplicationAction
// ---------------------------------------------------------------------------

describe("deleteApplicationAction", () => {
  it("calls deleteApplication with the company slug", async () => {
    await deleteApplicationAction("acme");
    expect(data.deleteApplication).toHaveBeenCalledWith("acme");
  });

  it("revalidates /", async () => {
    await deleteApplicationAction("acme");
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });
});
