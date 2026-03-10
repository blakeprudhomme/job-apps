import Link from "next/link";
import { notFound } from "next/navigation";
import { getApplication, getCompanyDocument } from "@/lib/data";
import { parseResume, parseDocumentHeader } from "@/lib/markdown";
import { MarkdownContent } from "@/components/MarkdownContent";
import { DocumentHeader } from "@/components/DocumentHeader";
import { PrintButton } from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export default async function ResumePreviewPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const application = await getApplication(company);
  if (!application) notFound();

  const resume = await getCompanyDocument(company, "resume");
  if (!resume) notFound();

  const { summary, body } = parseResume(resume);
  const header = parseDocumentHeader(resume);

  return (
    <div>
      <div className="no-print mb-6 flex items-center justify-between">
        <div>
          <Link
            href={`/applications/${company}`}
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {application.displayName}
          </Link>
          <h1 className="text-lg font-bold">
            Resume — {application.displayName}
          </h1>
          <p className="text-sm text-muted">{application.role}</p>
        </div>
        <PrintButton filename={`${application.displayName} - Resume`} />
      </div>
      <div className="resume-doc mx-auto max-w-[8.5in] bg-white p-8 shadow-sm print:max-w-none print:p-0 print:shadow-none">
        <DocumentHeader variant="resume" header={header} />
        <div className="border-t-2 border-[#461D7C] pt-3">
          {summary && (
            <p className="mb-3 text-[0.84rem] leading-relaxed text-slate-600">
              {summary}
            </p>
          )}
          <MarkdownContent content={body} className="text-[0.84rem]" />
        </div>
      </div>
    </div>
  );
}
