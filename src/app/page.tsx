import Link from "next/link";
import { getApplications } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { DeleteButton } from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const applications = await getApplications();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="mt-1 text-sm text-muted">
            {applications.length === 0
              ? "No applications yet. Share a job posting in Cursor to get started."
              : `${applications.length} application${applications.length === 1 ? "" : "s"} tracked`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/preview/generic/resume"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6M7 3h7.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0120 7.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
              />
            </svg>
            View generic resume
          </Link>
        </div>
      </div>

      {applications.length > 0 ? (
        <div className="rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="px-4 py-3 font-medium text-muted">Company</th>
                <th className="px-4 py-3 font-medium text-muted">Role</th>
                <th className="px-4 py-3 font-medium text-muted">Status</th>
                <th className="px-4 py-3 font-medium text-muted">Added</th>
                <th className="px-4 py-3 font-medium text-muted">Applied</th>
                <th className="px-4 py-3 font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.company}
                  className="border-b border-border last:border-0 hover:bg-gray-50/50"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/applications/${app.company}`}
                      className="font-medium text-accent hover:underline"
                    >
                      {app.displayName}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{app.role}</td>
                  <td className="px-4 py-3">
                    <StatusBadge company={app.company} status={app.status} />
                  </td>
                  <td className="px-4 py-3 text-muted">{app.dateAdded}</td>
                  <td className="px-4 py-3 text-muted">
                    {app.dateApplied || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/applications/${app.company}`}
                        className="text-muted hover:text-foreground"
                        title="View details"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      {app.url && (
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted hover:text-foreground"
                          title="Open job posting"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      <DeleteButton company={app.company} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-16">
          <svg className="mb-4 h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm font-medium text-muted">No applications yet</p>
          <p className="mt-1 text-xs text-gray-400">
            Paste a job posting link in a Cursor chat to create your first application
          </p>
        </div>
      )}
    </div>
  );
}
