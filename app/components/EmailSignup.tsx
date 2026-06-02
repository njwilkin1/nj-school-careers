"use client";

import { useState } from "react";

export default function EmailSignup({
  searchTerm = "",
}: {
  searchTerm?: string;
}) {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

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
          keyword: searchTerm,
          job_type: "",
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
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-950">
  {searchTerm
    ? `Get new ${searchTerm} jobs in New Jersey`
    : "Get NJ Education Job Alerts Before Everyone Else"}
</h2>

     <p className="mt-2 text-slate-600">
  {searchTerm
    ? `Get new ${searchTerm} jobs delivered directly to your inbox.`
    : "Receive new teaching, administration, and support staff jobs as soon as they're posted."}
</p>

      <p className="mt-2 text-sm text-slate-500">
        Join 327 NJ educators already receiving job alerts • No spam • Unsubscribe anytime
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

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 sm:flex-row">
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