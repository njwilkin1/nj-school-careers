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
    contactName: "",
    contactEmail: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const formspreeEndpoint = "https://formspree.io/f/xlgozdbp";

      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...form,
          source: "NJ School Careers - Post a Job Page",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("Thank you. Your job was submitted successfully.");
        setForm({
          jobTitle: "",
          district: "",
          location: "",
          jobType: "",
          description: "",
          applicationLink: "",
          contactName: "",
          contactEmail: "",
        });
      } else {
        setStatus(data?.errors?.[0]?.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight">
          Post a Job
        </h1>

        {/* Accent */}
        <p className="mt-2 text-sm font-semibold text-orange-500">
          Free job posting during our launch period
        </p>

        <p className="mt-2 text-slate-600">
          Reach candidates across New Jersey. No account required.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          {/* Inputs */}
          <input
            name="jobTitle"
            value={form.jobTitle}
            onChange={handleChange}
            placeholder="Job Title"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none"
          />

          <input
            name="district"
            value={form.district}
            onChange={handleChange}
            placeholder="School / District Name"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none"
          />

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location (City, County)"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none"
          />

          <select
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none"
          >
            <option value="">Job Type</option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Substitute</option>
            <option>Support Staff</option>
            <option>Administrative</option>
            <option>Coaching</option> {/* ✅ added */}
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Job Description"
            rows={6}
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none"
          />

          <input
            name="applicationLink"
            value={form.applicationLink}
            onChange={handleChange}
            placeholder="Application URL or email"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none"
          />

          <input
            name="contactName"
            value={form.contactName}
            onChange={handleChange}
            placeholder="Contact Name"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none"
          />

          <input
            type="email"
            name="contactEmail"
            value={form.contactEmail}
            onChange={handleChange}
            placeholder="Contact Email"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Job"}
          </button>
        </form>

        {/* Status */}
        {status && (
          <p className="mt-4 text-sm text-slate-600">
            {status}
          </p>
        )}
      </div>
    </main>
  );
}