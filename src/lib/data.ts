import fs from "fs/promises";
import path from "path";
import type { Application, ApplicationStatus, TrackerData } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const TRACKER_PATH = path.join(DATA_DIR, "tracker.json");
const TEMPLATES_DIR = path.join(DATA_DIR, "templates");
const APPLICATIONS_DIR = path.join(DATA_DIR, "applications");

// --- Tracker CRUD ---

export async function getTracker(): Promise<TrackerData> {
  const raw = await fs.readFile(TRACKER_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function saveTracker(data: TrackerData): Promise<void> {
  await fs.writeFile(TRACKER_PATH, JSON.stringify(data, null, 2) + "\n");
}

export async function getApplications(): Promise<Application[]> {
  const tracker = await getTracker();
  return tracker.applications;
}

export async function getApplication(
  company: string
): Promise<Application | undefined> {
  const tracker = await getTracker();
  return tracker.applications.find((a) => a.company === company);
}

export async function addApplication(app: Application): Promise<void> {
  const tracker = await getTracker();
  tracker.applications.push(app);
  await saveTracker(tracker);
}

export async function updateApplicationStatus(
  company: string,
  status: ApplicationStatus
): Promise<void> {
  const tracker = await getTracker();
  const app = tracker.applications.find((a) => a.company === company);
  if (!app) throw new Error(`Application not found: ${company}`);
  app.status = status;
  if (status === "applied" && !app.dateApplied) {
    app.dateApplied = new Date().toISOString().split("T")[0];
  }
  await saveTracker(tracker);
}

export async function updateApplicationNotes(
  company: string,
  notes: string
): Promise<void> {
  const tracker = await getTracker();
  const app = tracker.applications.find((a) => a.company === company);
  if (!app) throw new Error(`Application not found: ${company}`);
  app.notes = notes;
  await saveTracker(tracker);
}

export async function deleteApplication(company: string): Promise<void> {
  const tracker = await getTracker();
  tracker.applications = tracker.applications.filter(
    (a) => a.company !== company
  );
  await saveTracker(tracker);

  const companyDir = path.join(APPLICATIONS_DIR, company);
  try {
    await fs.rm(companyDir, { recursive: true });
  } catch {
    // directory may not exist
  }
}

// --- Markdown file I/O ---

export async function getTemplateResume(): Promise<string> {
  return fs.readFile(path.join(TEMPLATES_DIR, "resume.md"), "utf-8");
}

export async function getTemplateCoverLetter(): Promise<string> {
  return fs.readFile(path.join(TEMPLATES_DIR, "cover-letter.md"), "utf-8");
}

export async function getCompanyDocument(
  company: string,
  doc: "resume" | "cover-letter" | "job-posting"
): Promise<string | null> {
  const filePath = path.join(APPLICATIONS_DIR, company, `${doc}.md`);
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}

export async function saveCompanyDocument(
  company: string,
  doc: "resume" | "cover-letter" | "job-posting",
  content: string
): Promise<void> {
  const companyDir = path.join(APPLICATIONS_DIR, company);
  await fs.mkdir(companyDir, { recursive: true });
  await fs.writeFile(path.join(companyDir, `${doc}.md`), content);
}

export async function getCompanyDocuments(company: string): Promise<{
  jobPosting: string | null;
  resume: string | null;
  coverLetter: string | null;
}> {
  const [jobPosting, resume, coverLetter] = await Promise.all([
    getCompanyDocument(company, "job-posting"),
    getCompanyDocument(company, "resume"),
    getCompanyDocument(company, "cover-letter"),
  ]);
  return { jobPosting, resume, coverLetter };
}
