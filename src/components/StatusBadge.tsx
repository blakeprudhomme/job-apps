"use client";

import { updateStatusAction } from "@/app/actions/tracker";
import {
  ALL_STATUSES,
  STATUS_COLORS,
  STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/types";
import { useState, useRef, useEffect } from "react";

export function StatusBadge({
  company,
  status,
}: {
  company: string;
  status: ApplicationStatus;
}) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(status);
  const [openUp, setOpenUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleToggle() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUp(spaceBelow < 200);
    }
    setOpen(!open);
  }

  async function handleSelect(newStatus: ApplicationStatus) {
    setCurrent(newStatus);
    setOpen(false);
    await updateStatusAction(company, newStatus);
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        ref={btnRef}
        onClick={handleToggle}
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-80 ${STATUS_COLORS[current]}`}
      >
        {STATUS_LABELS[current]}
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className={`absolute left-0 z-10 w-40 rounded-lg border border-border bg-card py-1 shadow-lg ${openUp ? "bottom-full mb-1" : "top-full mt-1"}`}>
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleSelect(s)}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${
                s === current ? "font-medium" : ""
              }`}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${STATUS_COLORS[s].split(" ")[0]}`}
              />
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
