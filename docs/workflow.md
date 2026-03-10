# Job Application Hub Workflow

This is the canonical workflow for processing job postings and managing applications. AI config files (`.cursor/rules/job-apps-workflow.mdc`, `CLAUDE.md`) reference this document.

You are helping manage a job application tracking system. The user's resume and cover letter templates live in `data/templates/`. Each application gets its own folder under `data/applications/<company>/`. Application metadata is tracked in `data/tracker.json`.

## When the user shares a job posting link or description

1. **Create the company directory**: `data/applications/<company-slug>/` using kebab-case (e.g., `acme-corp`, `google`, `stripe`).

2. **Save the job posting**: Create `data/applications/<company-slug>/job-posting.md` with:
   - The job title and company name at the top
   - The original URL (if provided)
   - The full job description text

3. **Tailor the resume**: Copy `data/templates/resume.md` to `data/applications/<company-slug>/resume.md` and customize it:
   - Reorder and emphasize experiences most relevant to the role
   - Mirror keywords and phrases from the job posting
   - Adjust the summary to align with the position
   - Highlight matching skills and technologies
   - Keep it concise — aim for one page of content

4. **Tailor the cover letter**: Copy `data/templates/cover-letter.md` to `data/applications/<company-slug>/cover-letter.md` and customize it:
   - Address the specific role and company
   - Reference specific requirements from the job posting
   - Connect the user's experience to the role's needs
   - Show knowledge of the company's mission/products
   - Keep a professional but personable tone

5. **Update the tracker**: Add an entry to `data/tracker.json`:
   ```json
   {
     "company": "<company-slug>",
     "displayName": "Company Name",
     "role": "Job Title",
     "status": "interested",
     "dateAdded": "YYYY-MM-DD",
     "dateApplied": null,
     "url": "https://...",
     "notes": ""
   }
   ```

## When the user asks to update application status

Update the `status` field in `data/tracker.json`. Valid statuses:
- `interested` — Saved/considering
- `applied` — Application submitted (also set `dateApplied` to the current date)
- `phone_screen` — Phone/initial screen scheduled
- `interview` — Interview stage
- `offer` — Received offer
- `rejected` — Application rejected
- `withdrawn` — User withdrew

## File structure reference

```
data/
├── templates/
│   ├── resume.md          # Base resume (DO NOT modify directly for applications)
│   └── cover-letter.md    # Base cover letter template
├── applications/
│   └── <company-slug>/
│       ├── job-posting.md
│       ├── resume.md
│       └── cover-letter.md
└── tracker.json
```

## Important guidelines

- ALWAYS read the user's template files before tailoring — never invent or embellish experience or skills
- Keep the same Markdown structure so the web app renders documents correctly
- When tailoring, be specific — don't just swap company names, genuinely customize the content
- The web app runs at http://localhost:3000 and auto-refreshes when files change
