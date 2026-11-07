"use client";

import { FormEvent, useState } from "react";

function cleanSearchTerm(value: string) {
  return value.trim();
}

export default function EmailSignup({
  searchTerm = "",
  compact = false,
}: {
  searchTerm?: string;
  compact?: boolean;
}) {
  const cleanedSearchTerm = cleanSearchTerm(searchTerm);
  const [email, setEmail] = useState("");
  const [county, setCounty] = useState("");
  const [keyword, setKeyword] = useState(cleanedSearchTerm);
  const [jobType, setJobType] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const headline = cleanedSearchTerm
    ? `Never miss a new ${cleanedSearchTerm} opening in New Jersey`
    : "Get New Jersey education job alerts";

  const subheadline = cleanedSearchTerm
    ? `Get personalized ${cleanedSearchTerm} job alerts when new matching opportunities are added.`
    : "Get personalized alerts for new teaching, administration, support staff, and school jobs across New Jersey.";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          county: county.trim(),
          keyword: keyword.trim(),
          job_type: jobType,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to subscribe.");
      }

      setStatus("success");
      setMessage("You’re subscribed. Check your inbox for the confirmation email.");
      setEmail("");
      setCounty("");
      setKeyword(cleanedSearchTerm);
      setJobType("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to subscribe.");
    }
  }

  return (
    <div
      className={
        compact
          ? "w-full"
          : "mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      }
    >
      {!compact && (
        <>
          <h2 className="text-2xl font-semibold text-slate-950">{headline}</h2>

          <p className="mt-2 text-slate-600">{subheadline}</p>
        </>
      )}

      <form onSubmit={handleSubmit} className={compact ? "mt-0" : "mt-6"}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700 md:col-span-2">
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-500"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            County
            <input
              value={county}
              onChange={(event) => setCounty(event.target.value)}
              placeholder="Example: Bergen County"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-500"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Job keyword
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Example: Spanish Teacher"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-500"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 md:col-span-2">
            Job type
            <select
              value={jobType}
              onChange={(event) => setJobType(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-500"
            >
              <option value="">All job types</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing..." : "Get Job Alerts"}
        </button>

        {message && (
          <p
            className={`mt-3 text-sm ${
              status === "error" ? "text-red-700" : "text-emerald-700"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
