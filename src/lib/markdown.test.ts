import { describe, it, expect } from "vitest";
import { parseResume, parseDocumentHeader, stripCoverLetterHeader } from "./markdown";

// ---------------------------------------------------------------------------
// parseDocumentHeader
// ---------------------------------------------------------------------------

describe("parseDocumentHeader", () => {
  const resumeContent = `# Jane Doe
**Phone:** 555-123-4567 | **Email:** jane@example.com | **Web:** [janedoe.dev](https://janedoe.dev)
Senior Engineer · TypeScript · React

---

## Experience
`;

  it("extracts name from # heading", () => {
    const result = parseDocumentHeader(resumeContent);
    expect(result.name).toBe("Jane Doe");
  });

  it("extracts phone", () => {
    const result = parseDocumentHeader(resumeContent);
    expect(result.phone).toBe("555-123-4567");
  });

  it("extracts email", () => {
    const result = parseDocumentHeader(resumeContent);
    expect(result.email).toBe("jane@example.com");
  });

  it("extracts web from markdown link", () => {
    const result = parseDocumentHeader(resumeContent);
    expect(result.web).toBe("janedoe.dev");
  });

  it("extracts tagline", () => {
    const result = parseDocumentHeader(resumeContent);
    expect(result.tagline).toBe("Senior Engineer · TypeScript · React");
  });

  it("falls back to defaults when fields are missing", () => {
    const result = parseDocumentHeader("# Only a Name\n");
    expect(result.name).toBe("Only a Name");
    expect(result.phone).toBe("[Phone]");
    expect(result.email).toBe("[your@email.com]");
    expect(result.web).toBe("[yourwebsite.com]");
    expect(result.tagline).toBe("");
  });

  it("does not use 'Cover Letter' heading as name", () => {
    const coverLetterContent = `# Cover Letter
**Jane Doe**
**Phone:** 555-000-1111 | **Email:** jane@example.com | **Web:** janedoe.dev
`;
    const result = parseDocumentHeader(coverLetterContent);
    expect(result.name).toBe("Jane Doe");
  });

  it("handles dotted phone format (555.123.4567)", () => {
    const content = `# Test\n**Phone:** 555.123.4567 | **Email:** a@b.com | **Web:** x.com\n`;
    const result = parseDocumentHeader(content);
    expect(result.phone).toBe("555.123.4567");
  });

  it("handles email with subdomain", () => {
    const content = `# Test\n**Phone:** 555-000-0000 | **Email:** user@mail.example.co | **Web:** x.com\n`;
    const result = parseDocumentHeader(content);
    expect(result.email).toBe("user@mail.example.co");
  });
});

// ---------------------------------------------------------------------------
// parseResume
// ---------------------------------------------------------------------------

describe("parseResume", () => {
  const fullResume = `# Jane Doe
**Phone:** 555-123-4567 | **Email:** jane@example.com | **Web:** janedoe.dev
Senior Engineer · TypeScript · React

This is a professional summary about Jane's career.

---

## Experience

### Company A
Did great things.
`;

  it("extracts summary paragraph", () => {
    const { summary } = parseResume(fullResume);
    expect(summary).toBe("This is a professional summary about Jane's career.");
  });

  it("extracts body content after ---", () => {
    const { body } = parseResume(fullResume);
    expect(body).toContain("## Experience");
    expect(body).toContain("Company A");
  });

  it("body does not include the summary", () => {
    const { body } = parseResume(fullResume);
    expect(body).not.toContain("professional summary");
  });

  it("returns empty summary when there is no content before ---", () => {
    const content = `# Jane\n**Phone:** 555-000-0000\n\n---\n\n## Skills\n`;
    const { summary } = parseResume(content);
    expect(summary).toBe("");
  });

  it("returns full content as body when no --- separator exists", () => {
    const content = `# Jane\n\nSummary here.\n\n## Skills\nTypeScript\n`;
    const { body } = parseResume(content);
    // bodyStartIndex stays 0 so body === full content trimmed
    expect(body).toBe(content.trim());
  });

  it("skips header lines (phone pattern)", () => {
    const content = `# Jane\n555-123-4567\n\nMy summary.\n\n---\n\n## Body\n`;
    const { summary } = parseResume(content);
    expect(summary).toBe("My summary.");
  });
});

// ---------------------------------------------------------------------------
// stripCoverLetterHeader
// ---------------------------------------------------------------------------

describe("stripCoverLetterHeader", () => {
  const coverLetter = `# Cover Letter
**Jane Doe**
**Phone:** 555-000-0000 | **Email:** jane@example.com
---
Hi Hiring Manager,

I am excited to apply for this role...
`;

  it("starts content from 'Hi' salutation", () => {
    const result = stripCoverLetterHeader(coverLetter);
    expect(result.trim().startsWith("Hi Hiring Manager")).toBe(true);
  });

  it("removes the header block", () => {
    const result = stripCoverLetterHeader(coverLetter);
    expect(result).not.toContain("Jane Doe");
    expect(result).not.toContain("Phone:");
  });

  it("preserves body content after the salutation", () => {
    const result = stripCoverLetterHeader(coverLetter);
    expect(result).toContain("I am excited to apply");
  });

  it("works with 'Dear' salutation", () => {
    const content = `# Cover Letter\n**Name**\n\nDear Hiring Manager,\n\nBody here.\n`;
    const result = stripCoverLetterHeader(content);
    expect(result.trim().startsWith("Dear Hiring Manager")).toBe(true);
  });

  it("returns full content if no salutation found (no data loss)", () => {
    const content = `No salutation here.\nJust body.\n`;
    const result = stripCoverLetterHeader(content);
    expect(result).toBe(content);
  });
});
