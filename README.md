# Job Application Hub

## What is this?

job-apps is an open-source tool for locally managing and automating your job search.

Instead of juggling spreadsheets, notes, and browser tabs, this aims to provide:

- A centralized job tracker
- Structured application workflows
- (Future) automation for parsing and applying to jobs

---

## Status

🚧 Early-stage — actively being built

Expect rough edges. Contributions welcome.

---

## Vision

Long-term, this could become:

- A self-hosted job search command center
- With automation for sourcing, tracking, and applying

## Setup

1. **Create your data directory** from the example:

   ```bash
   npm run setup
   ```

   Or manually: `cp -r data-example data`

2. **Replace the templates** with your own content:
   - `data/templates/resume.md` — Your base resume (Markdown)
   - `data/templates/cover-letter.md` — Your base cover letter (Markdown)

   The `data/` directory is gitignored so your personal data stays private.

## Quick Start

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Example Workflow

1. **Copy `data-example` to `data`** — Run `npm run setup` (or `cp -r data-example data`).

2. **Replace templates** — Add your resume and cover letter to `data/templates/`.

3. **Share a job posting** — In Cursor chat, paste a job URL or description and say: *"Process this job posting for my application hub: [URL or paste]"*. The AI will:
   - Create `data/applications/<company-slug>/`
   - Save the job as `job-posting.md`
   - Tailor your resume and cover letter for the role
   - Add an entry to `data/tracker.json`

4. **Review in the dashboard** — See all applications, view tailored documents, update statuses.

5. **Export PDFs** — Use the preview pages and Cmd+P → Save as PDF for print-ready documents.

See [docs/workflow.md](docs/workflow.md) for detailed tailoring instructions when working with the AI.

## How It Works

1. **Upload your base resume and cover letter** — Replace the templates in `data/templates/` with your own content (Markdown format).

2. **Share a job posting** — Paste a job posting link or description into a Cursor chat. The AI will:
   - Create a company folder under `data/applications/`
   - Save the job description
   - Tailor your resume and cover letter for that specific role
   - Add the application to the tracker

3. **Review and export** — Open the dashboard at `localhost:3000` to:
   - See all your applications and their statuses
   - View tailored documents
   - Export print-ready PDFs (Cmd+P → Save as PDF)

4. **Track progress** — Update application statuses directly from the dashboard as you move through the process.

## Project Structure

```
data-example/            # Example data (committed to repo)
├── templates/           # Placeholder resume and cover letter
├── applications/
│   ├── example-company/ # Example tailored application
│   └── generic/         # Generic resume for /preview/generic/resume
└── tracker.json

data/                    # Your data (gitignored — copy from data-example)
├── templates/           # Your base resume and cover letter
├── applications/        # One folder per company
│   └── company-name/
│       ├── job-posting.md
│       ├── resume.md
│       └── cover-letter.md
└── tracker.json         # Application status data

src/app/                 # Next.js pages
├── page.tsx                           # Dashboard
├── applications/[company]/page.tsx    # Company detail
└── preview/[company]/                 # Print-ready previews
    ├── resume/page.tsx
    └── cover-letter/page.tsx
```

## Statuses

| Status | Meaning |
|--------|---------|
| Interested | Saved / considering |
| Applied | Application submitted |
| Phone Screen | Initial screen scheduled |
| Interview | Interview stage |
| Offer | Received offer |
| Rejected | Application rejected |
| Withdrawn | You withdrew |

## PDF Export

1. Navigate to a company's detail page
2. Click "Preview & Export PDF" on the resume or cover letter tab
3. Click the "Export PDF" button (or press Cmd+P)
4. Select "Save as PDF" in the Mac print dialog
