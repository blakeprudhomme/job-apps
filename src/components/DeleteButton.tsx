"use client";

import { deleteApplicationAction } from "@/app/actions/tracker";
import { useState } from "react";

export function DeleteButton({ company }: { company: string }) {
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    await deleteApplicationAction(company);
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1 text-xs">
        <button
          onClick={handleDelete}
          className="rounded bg-red-600 px-2 py-0.5 text-white hover:bg-red-700"
        >
          Confirm
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded bg-gray-200 px-2 py-0.5 text-gray-700 hover:bg-gray-300"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-muted hover:text-red-600"
      title="Delete application"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  );
}
