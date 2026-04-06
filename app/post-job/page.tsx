"use client";

import { useState } from "react";

export default function PostJobPage() {
  const [form, setForm] = useState({
    jobTitle: "",
    district: "",
    location: "",
    jobType: "",
    description: "",
    applicationLink: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/post-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Job submitted successfully.");
        setForm({
          jobTitle: "",
          district: "",
          location: "",
          jobType: "",
          description: "",
          applicationLink: "",
        });
      } else {
        setStatus(data.error || "Something went wrong.");
      }
    } catch (error) {
      setStatus("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Post a Job</h1>
        <p className="mt-2 text-slate-600">
          Reach candidates across New Jersey.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            name="jobTitle"
            value={form.jobTitle}
            onChange={handleChange}
            placeholder="Job Title"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <input
            name="district"
            value={form.district}
            onChange={handleChange}
            placeholder="School / District Name"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location (City, County)"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <select
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="">Job Type</option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Substitute</option>
            <option>Support Staff</option>
            <option>Administrative</option>
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Job Description"
            rows={5}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <input
            name="applicationLink"
            value={form.applicationLink}
            onChange={handleChange}
            placeholder="Application Email or URL"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Job"}
          </button>
        </form>

        {status && (
          <p className="mt-4 text-sm text-slate-600">
            {status}
          </p>
        )}
      </div>
    </main>
  );
}