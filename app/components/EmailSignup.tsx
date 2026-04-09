"use client";

import { useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [county, setCounty] = useState("");
  const [keyword, setKeyword] = useState("");
  const [jobType, setJobType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          county,
          keyword,
          job_type: jobType,
        }),
      });

      const contentType = res.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error("API did not return JSON.");
      }

      const data = await res.json();

      if (res.ok) {
        setMessage("You're subscribed.");
        setMessageType("success");
        setEmail("");
        setCounty("");
        setKeyword("");
        setJobType("");
      } else {
        setMessage(data.error || "Something went wrong.");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Request failed. Check your API route or Supabase keys.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">Get New NJ School Jobs by Email</h2>
      <p className="mt-2 text-slate-600">
        Subscribe for alerts based on county, keyword, and job type.
      </p>

      {message && (
        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm ${
            messageType === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          type="email"
          placeholder="Your email"
          className="rounded-xl border border-slate-300 px-4 py-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="County"
          className="rounded-xl border border-slate-300 px-4 py-3"
          value={county}
          onChange={(e) => setCounty(e.target.value)}
        />

        <input
          type="text"
          placeholder="Keyword (e.g. Assistant Principal)"
          className="rounded-xl border border-slate-300 px-4 py-3"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <select
          className="rounded-xl border border-slate-300 px-4 py-3"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        >
          <option value="">All job types</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Substitute">Substitute</option>
          <option value="Administrative">Administrative</option>
        </select>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Subscribe"}
          </button>
        </div>
      </form>
    </div>
  );
}