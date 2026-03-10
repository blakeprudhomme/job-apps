# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server (http://localhost:3000)
- `npm run build` — Production build
- `npm run lint` — Run ESLint

## Architecture

Next.js 16 app (App Router) with Tailwind CSS 4. No database — all data lives in the filesystem under `data/`.

**Data layer**: `data/tracker.json` stores application metadata (company, role, status, dates). Each company gets a folder under `data/applications/<company-slug>/` with markdown files: `job-posting.md`, `resume.md`, `cover-letter.md`. Base templates live in `data/templates/`.

**Data access**: `src/lib/data.ts` provides all CRUD operations for tracker entries and markdown document I/O. Server actions in `src/app/actions/tracker.ts` wrap these with `revalidatePath` for Next.js cache invalidation.

**Types**: `src/lib/types.ts` defines `Application`, `ApplicationStatus`, `TrackerData`, and status label/color maps.

**Pages**: Dashboard (`/`), company detail (`/applications/[company]`), and print-ready preview pages (`/preview/[company]/resume`, `/preview/[company]/cover-letter`, `/preview/generic/resume`). Preview pages are styled for PDF export via browser print.

**Markdown rendering**: `src/lib/markdown.ts` + `src/components/MarkdownContent.tsx` handle rendering with `react-markdown` and `remark-gfm`.

## Job Application Workflow

See [docs/workflow.md](docs/workflow.md) for the full workflow instructions.
