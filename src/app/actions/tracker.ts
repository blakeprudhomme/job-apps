"use server";

import {
  updateApplicationStatus,
  updateApplicationNotes,
  deleteApplication,
} from "@/lib/data";
import type { ApplicationStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function updateStatusAction(
  company: string,
  status: ApplicationStatus
) {
  await updateApplicationStatus(company, status);
  revalidatePath("/");
  revalidatePath(`/applications/${company}`);
}

export async function updateNotesAction(company: string, notes: string) {
  await updateApplicationNotes(company, notes);
  revalidatePath(`/applications/${company}`);
}

export async function deleteApplicationAction(company: string) {
  await deleteApplication(company);
  revalidatePath("/");
}
