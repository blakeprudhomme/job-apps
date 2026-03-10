/**
 * Parses a resume markdown file into a header summary and the body content.
 * The header (# Name, contact line) is rendered by DocumentHeader.
 * The summary paragraph is returned separately for styled rendering.
 * The body is everything after the first --- separator.
 */
export function parseResume(content: string): { summary: string; body: string } {
  const lines = content.split("\n");
  const summaryLines: string[] = [];
  let bodyStartIndex = 0;
  let pastHeader = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (
      line.startsWith("# ") ||
      line.startsWith("**Phone") ||
      line.startsWith("**Email") ||
      line === "" ||
      /\d{3}[.-]\d{3}[.-]\d{4}/.test(line) ||
      /·/.test(line) && line.length < 80
    ) {
      continue;
    }

    if (line === "---") {
      bodyStartIndex = i + 1;
      break;
    }

    if (!pastHeader) {
      pastHeader = true;
    }
    if (pastHeader) {
      summaryLines.push(lines[i]);
    }
  }

  return {
    summary: summaryLines.join(" ").trim(),
    body: lines.slice(bodyStartIndex).join("\n").trim(),
  };
}

export interface DocumentHeaderData {
  name: string;
  phone: string;
  email: string;
  web: string;
  tagline?: string;
}

/**
 * Extracts name and contact info from resume or cover letter markdown.
 * Used to render DocumentHeader from user's data instead of hardcoding.
 */
export function parseDocumentHeader(content: string): DocumentHeaderData {
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  let name = "[Your Name]";
  let phone = "[Phone]";
  let email = "[your@email.com]";
  let web = "[yourwebsite.com]";
  let tagline = "";

  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const line = lines[i];
    // # Name (resume) or # Cover Letter (skip, next line may have **Name**)
    if (line.startsWith("# ")) {
      const heading = line.slice(2).trim();
      if (!heading.toLowerCase().includes("cover letter")) {
        name = heading;
      }
      continue;
    }
    // **Name** (cover letter format)
    if (line.startsWith("**") && line.endsWith("**") && !line.includes("|")) {
      name = line.replace(/\*\*/g, "").trim();
      continue;
    }
    // Contact line: **Phone:** X | **Email:** Y | **Web:** Z or X | Y | Z
    const phoneMatch = line.match(/\*\*Phone:\*\*\s*([^|]+)/) || line.match(/(\d{3}[.-]\d{3}[.-]\d{4})/);
    if (phoneMatch) phone = phoneMatch[1].trim();

    const emailMatch = line.match(/\*\*Email:\*\*\s*([^|\s]+)/) || line.match(/([\w.-]+@[\w.-]+\.\w+)/);
    if (emailMatch) email = emailMatch[1].replace(/[\]\)]+$/, "").trim();

    const webMatch = line.match(/\*\*Web:\*\*\s*\[([^\]]+)\]\([^)]+\)/) || line.match(/\*\*Web:\*\*\s*([^|\s]+)/) || line.match(/((?:https?:\/\/)?[\w.-]+\.[a-z]{2,})/);
    if (webMatch) web = webMatch[1].trim();

    // Tagline: "Senior X · Y · Z" (resume variant)
    if (/·/.test(line) && line.length < 100 && !line.includes("@")) {
      tagline = line;
    }
  }

  return { name, phone, email, web, tagline };
}

/**
 * Strips the header block from a cover letter markdown file.
 * Removes the name/contact/separator lines, keeping the salutation onward.
 */
export function stripCoverLetterHeader(content: string): string {
  const lines = content.split("\n");
  let startIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("Hi ") || line.startsWith("Dear ") || line.startsWith("Hello ") || line.startsWith("Hey ")) {
      startIndex = i;
      break;
    }
  }
  return lines.slice(startIndex).join("\n");
}
