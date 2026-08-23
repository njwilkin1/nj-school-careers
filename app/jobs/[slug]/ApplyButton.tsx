"use client";

const PRIORITY_ALERTS_URL =
  "https://buy.stripe.com/eVq9AVc2OgX9e055Cy8IU09";

type ApplyButtonProps = {
  href: string;
  district?: string | null;
  county?: string | null;
  jobTitle?: string | null;
  label: string;
  className?: string;
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

import { useState } from "react";

export default function ApplyButton({
  href,
  district,
  county,
  jobTitle,
  label,
  className,
}: ApplyButtonProps) {
  const [open, setOpen] = useState(false);

  function continueToApply() {
    setOpen(false);
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          window.gtag?.("event", "apply_click", {
            district,
            county,
            job_title: jobTitle,
          });

          setOpen(true);
        }}
      >
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/50 px-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-slate-950">
              Never Miss a Matching Job
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Get personalized New Jersey school job alerts throughout the day
              when new opportunities matching your preferences are added.
            </p>

            <div className="mt-5 rounded-2xl bg-orange-50 p-4">
              <p className="text-lg font-bold text-slate-950">
                Priority Job Alerts
              </p>
              <p className="mt-1 text-sm text-slate-600">
                $9.99/month · Cancel anytime
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <a
                href={PRIORITY_ALERTS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-orange-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-orange-600"
              >
                Get Job Alerts
              </a>

              <button
                type="button"
                onClick={continueToApply}
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Continue to application
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
