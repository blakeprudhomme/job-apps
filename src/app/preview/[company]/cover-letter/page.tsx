import Link from "next/link";
import { notFound } from "next/navigation";
import { getApplication, getCompanyDocument } from "@/lib/data";
import { stripCoverLetterHeader, parseDocumentHeader } from "@/lib/markdown";
import { MarkdownContent } from "@/components/MarkdownContent";
import { DocumentHeader } from "@/components/DocumentHeader";
import { PrintButton } from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export default async function CoverLetterPreviewPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const application = await getApplication(company);
  if (!application) notFound();

  const coverLetter = await getCompanyDocument(company, "cover-letter");
  if (!coverLetter) notFound();

  const body = stripCoverLetterHeader(coverLetter);
  const header = parseDocumentHeader(coverLetter);

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
            Cover Letter — {application.displayName}
          </h1>
          <p className="text-sm text-muted">{application.role}</p>
        </div>
        <PrintButton filename={`${application.displayName} - Cover Letter`} />
      </div>
      <div className="mx-auto max-w-[8.5in] bg-white p-8 shadow-sm print:max-w-none print:p-0 print:shadow-none">
        <DocumentHeader variant="cover-letter" header={header} />
        <div className="border-t-2 border-[#461D7C] pt-4">
          <MarkdownContent content={body} className="cover-letter-body text-[0.9rem]" />
        </div>
      </div>
    </div>
  );
}
