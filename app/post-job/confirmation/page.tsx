"use client";

import { useEffect, useState } from "react";

interface JobConfirmationData {
  title: string;
  district: string;
  posted: string;
  application_deadline: string;
}

function formatDate(dateValue: string) {
  if (!dateValue) return "Not provided";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export default function JobSubmissionConfirmation() {
  const [jobData, setJobData] = useState<JobConfirmationData | null>(null);

  useEffect(() => {
    const storedJob = sessionStorage.getItem("lastSubmittedJob");

    if (storedJob) {
      setJobData(JSON.parse(storedJob));
      sessionStorage.removeItem("lastSubmittedJob");
    }
  }, []);

  if (!jobData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-2xl text-center bg-white p-10 rounded-3xl shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Job Submitted
          </h1>
          <p className="mt-4 text-slate-700">
            Thank you. Your job was submitted successfully.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <a
              href="/post-job"
              className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Submit Another Job
            </a>
            <a
              href="/jobs"
              className="rounded-xl border border-orange-500 px-6 py-3 font-semibold text-orange-500 hover:bg-orange-50"
            >
              Browse Jobs
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6">
      <div className="max-w-2xl text-center bg-white p-10 rounded-3xl shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          Job Submitted!
        </h1>

        <p className="mt-4 text-slate-700">
          Thank you for submitting your job:{" "}
          <strong>{jobData.title}</strong> at{" "}
          <strong>{jobData.district}</strong>.
        </p>

        <p className="mt-2 text-slate-700">
          Posting Date:{" "}
          <strong>{formatDate(jobData.posted)}</strong>
        </p>

        <p className="mt-2 text-slate-700">
          Application Deadline:{" "}
          <strong>{formatDate(jobData.application_deadline)}</strong>
        </p>

        <p className="mt-4 text-slate-700">
          Our team will review your submission and publish it within 1 business day.
          If changes are needed, we will contact you using the email provided.
        </p>

        <div className="mt-6 flex justify-center gap-4">
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
            Submit Another Job Posting
          </a>
        </div>
      </div>
    </main>
  );
}