"use client";

import { useEffect } from "react";

export default function JobSubmissionConfirmation() {
  useEffect(() => {
    // Track pageview for analytics
    window.gtag?.("event", "job_submission_confirmation");
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6">
      <div className="max-w-2xl text-center bg-white p-10 rounded-3xl shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Job Submitted!</h1>

        <p className="mt-4 text-slate-700">
          Thank you for submitting your job. Our team will review it and publish within 24–48 hours.
        </p>

        <p className="mt-2 text-slate-700">
          You will receive an email confirmation once it’s live. You can also edit your submission until it’s published.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-6">
          <a
            href="/jobs"
            className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Browse Jobs
          </a>

          <a
            href="/post-job"
            className="rounded-xl border border-orange-500 px-6 py-3 font-semibold text-orange-500 hover:bg-orange-50"
          >
            Submit Another Job
          </a>

          {/* Optional dashboard link for future employer dashboard */}
          {/* <a
            href="/employer-dashboard"
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Go to Dashboard
          </a> */}
        </div>
      </div>
    </main>
  );
}