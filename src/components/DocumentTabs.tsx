"use client";

import { useState } from "react";
import { MarkdownContent } from "./MarkdownContent";
import Link from "next/link";

type Tab = "posting" | "resume" | "coverLetter";

export function DocumentTabs({
  company,
  jobPosting,
  resume,
  coverLetter,
}: {
  company: string;
  jobPosting: string | null;
  resume: string | null;
  coverLetter: string | null;
}) {
  const [active, setActive] = useState<Tab>("posting");

  const tabs: { id: Tab; label: string; content: string | null; previewPath?: string }[] = [
    { id: "posting", label: "Job Posting", content: jobPosting },
    {
      id: "resume",
      label: "Resume",
      content: resume,
      previewPath: `/preview/${company}/resume`,
    },
    {
      id: "coverLetter",
      label: "Cover Letter",
      content: coverLetter,
      previewPath: `/preview/${company}/cover-letter`,
    },
  ];

  const activeTab = tabs.find((t) => t.id === active)!;

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              active === tab.id
                ? "border-b-2 border-accent text-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
            {!tab.content && (
              <span className="ml-1.5 text-xs text-gray-400">(empty)</span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {activeTab.content ? (
          <div>
            {activeTab.previewPath && (
              <div className="mb-3 flex justify-end">
                <Link
                  href={activeTab.previewPath}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3a1866]"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Preview & Export PDF
                </Link>
              </div>
            )}
            <div className="rounded-lg border border-border bg-white p-6">
              <MarkdownContent content={activeTab.content} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12">
            <p className="text-sm text-muted">No {activeTab.label.toLowerCase()} yet</p>
            <p className="mt-1 text-xs text-gray-400">
              Ask Cursor AI to tailor this document for the role
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
