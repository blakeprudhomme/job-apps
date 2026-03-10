import type { DocumentHeaderData } from "@/lib/markdown";

const purple = "#461D7C";

interface DocumentHeaderProps {
  variant?: "resume" | "cover-letter";
  header?: DocumentHeaderData | null;
}

export function DocumentHeader({ variant = "resume", header }: DocumentHeaderProps) {
  const name = header?.name ?? "[Your Name]";
  const phone = header?.phone ?? "[Phone]";
  const email = header?.email ?? "[your@email.com]";
  const web = header?.web ?? "[yourwebsite.com]";
  const tagline = header?.tagline;

  return (
    <div className="mb-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {name}
        </h1>
        <p className="mt-0.5 text-sm text-slate-600">
          {phone} &nbsp;|&nbsp;{" "}
          <a href={`mailto:${email}`} className="no-underline" style={{ color: purple }}>
            {email}
          </a>
          &nbsp;|&nbsp;{" "}
          <a
            href={web.startsWith("http") ? web : `https://${web}`}
            className="no-underline"
            style={{ color: purple }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {web.replace(/^https?:\/\//, "")}
          </a>
        </p>
        {variant === "resume" && tagline && (
          <p className="mt-1.5 text-[0.82rem] leading-snug text-slate-500">
            {tagline}
          </p>
        )}
      </div>
    </div>
  );
}
