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
          jobTitle: form.jobTitle,
          district: form.district,
          location: form.location,
          jobType: form.jobType,
          description: form.description,
          applicationLink: form.applicationLink,
          contactName: form.contactName,
          contactEmail: form.contactEmail,
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
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Post a Job</h1>

<p className="mt-2 text-sm text-green-700 font-medium">
  Free job posting during our launch period.
</p>
        <p className="mt-2 text-slate-600">
          Reach candidates across New Jersey. No account required.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            name="jobTitle"
            value={form.jobTitle}
            onChange={handleChange}
            placeholder="Job Title"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <input
            name="district"
            value={form.district}
            onChange={handleChange}
            placeholder="School / District Name"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location (City, County)"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <select
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            required
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
            rows={6}
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <input
            name="applicationLink"
            value={form.applicationLink}
            onChange={handleChange}
            placeholder="Application URL or email"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <input
            name="contactName"
            value={form.contactName}
            onChange={handleChange}
            placeholder="Contact Name"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <input
            type="email"
            name="contactEmail"
            value={form.contactEmail}
            onChange={handleChange}
            placeholder="Contact Email"
            required
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

        {status && <p className="mt-4 text-sm text-slate-600">{status}</p>}
      </div>
    </main>
  );
}