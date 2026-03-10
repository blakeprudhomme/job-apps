"use client";

import { updateNotesAction } from "@/app/actions/tracker";
import { useState } from "react";

export function NotesEditor({
  company,
  initialNotes,
}: {
  company: string;
  initialNotes: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  async function handleSave() {
    setSaving(true);
    await updateNotesAction(company, notes);
    setSaving(false);
    setDirty(false);
  }

  return (
    <div>
      <textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setDirty(true);
        }}
        placeholder="Add notes about this application (contacts, interview prep, follow-ups...)"
        className="w-full rounded-lg border border-border bg-white p-3 text-sm leading-relaxed focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        rows={4}
      />
      {dirty && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-2 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3a1866] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Notes"}
        </button>
      )}
    </div>
  );
}
