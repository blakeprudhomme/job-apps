import Link from "next/link";
import { notFound } from "next/navigation";
import { getApplication, getCompanyDocuments } from "@/lib/data";
import { STATUS_LABELS } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { DocumentTabs } from "@/components/DocumentTabs";
import { NotesEditor } from "@/components/NotesEditor";

export const dynamic = "force-dynamic";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const application = await getApplication(company);

  if (!application) {
    notFound();
  }

  const docs = await getCompanyDocuments(company);

  return (
    <div>
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {application.displayName}
          </h1>
          <p className="mt-1 text-muted">{application.role}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge company={company} status={application.status} />
          {application.url && (
            <a
              href={application.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:bg-gray-50 hover:text-foreground"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Job Posting
            </a>
          )}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-3">
          <p className="text-xs text-muted">Status</p>
          <p className="mt-0.5 font-medium">
            {STATUS_LABELS[application.status]}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <p className="text-xs text-muted">Added</p>
          <p className="mt-0.5 font-medium">{application.dateAdded}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <p className="text-xs text-muted">Applied</p>
          <p className="mt-0.5 font-medium">
            {application.dateApplied || "Not yet"}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3">
          <p className="text-xs text-muted">Documents</p>
          <p className="mt-0.5 font-medium">
            {[docs.resume, docs.coverLetter, docs.jobPosting].filter(Boolean).length} / 3
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <DocumentTabs
          company={company}
          jobPosting={docs.jobPosting}
          resume={docs.resume}
          coverLetter={docs.coverLetter}
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold">Notes</h2>
        <NotesEditor company={company} initialNotes={application.notes} />
      </div>
    </div>
  );
}
