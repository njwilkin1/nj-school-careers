"use client";

import { useState } from "react";

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

export default function ApplyButton({
  href,
  district,
  county,
  jobTitle,
  label,
  className,
}: ApplyButtonProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function continueToApply() {
    setOpen(false);
    window.open(href, "_blank", "noopener,noreferrer");
  }

  async function handleContinue() {
    const cleanedEmail = email.trim().toLowerCase();

    if (!cleanedEmail) {
      continueToApply();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
      setError("Please enter a valid email or continue without signing up.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanedEmail,
          county: county || "",
          keyword: jobTitle || "",
          job_type: "",
        }),
      });

      continueToApply();
    } catch {
      continueToApply();
    } finally {
      setLoading(false);
    }
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
              Get Similar Jobs by Email
            </h2>

           <p className="mt-2 text-sm leading-6 text-slate-600">
  {jobTitle
    ? `Get notified when similar ${jobTitle} jobs are posted in New Jersey.`
    : "Get notified when similar New Jersey school jobs are posted."}
</p>

            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none"
            />

            {error && (
              <p className="mt-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleContinue}
                disabled={loading}
                className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
              >
                {loading ? "Continuing..." : "Continue to Apply"}
              </button>

              <button
                type="button"
                onClick={continueToApply}
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                No thanks, continue
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Free alerts. No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      )}
    </>
  );
}