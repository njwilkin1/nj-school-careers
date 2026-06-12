"use client";

import { useState } from "react";

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const headline = cleanedSearchTerm
    ? `Never miss a new ${cleanedSearchTerm} opening in New Jersey`
    : "Get New Jersey education job alerts";

  const subheadline = cleanedSearchTerm
    ? `Receive new ${cleanedSearchTerm} jobs as soon as they're posted.`
    : "Receive new teaching, administration, support staff, and school jobs as soon as they're posted.";

  const inputStyle =
    "rounded-xl border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none";

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
          county: "",
          keyword: cleanedSearchTerm,
          job_type: "",
        }),
      });

      const contentType = res.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error("API did not return JSON.");
      }

      const data = await res.json();

      if (res.ok) {
        setMessage("You're subscribed. We'll send you new matching NJ education jobs.");
        setMessageType("success");
        setEmail("");
      } else {
        setMessage(data.error || "Something went wrong.");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Request failed. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-2xl font-semibold text-slate-950">
            {headline}
          </h2>

          <p className="mt-2 text-slate-600">
            {subheadline}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Free alerts • No spam • Unsubscribe anytime
          </p>
        </>
      )}

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

      <form
        onSubmit={handleSubmit}
        className={`${compact ? "mt-0" : "mt-6"} flex flex-col gap-4 sm:flex-row`}
      >
        <input
          type="email"
          placeholder="Your email"
          className={`${inputStyle} flex-1`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Get Free Alerts"}
        </button>
      </form>
    </div>
  );
}