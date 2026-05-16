"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const counties = [
  "Atlantic County",
  "Bergen County",
  "Burlington County",
  "Camden County",
  "Cape May County",
  "Cumberland County",
  "Essex County",
  "Gloucester County",
  "Hudson County",
  "Hunterdon County",
  "Mercer County",
  "Middlesex County",
  "Monmouth County",
  "Morris County",
  "Ocean County",
  "Passaic County",
  "Salem County",
  "Somerset County",
  "Sussex County",
  "Union County",
  "Warren County",
];

const jobTypes = [
  "Full Time",
  "Part Time",
  "Substitute",
  "Coaching",
  "Stipend",
  "Summer",
  "Administrative",
];

function addDays(dateString: string, days: number) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export default function AdminAddJobPage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [previewMode, setPreviewMode] = useState(false);
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    adminSecret: "",
    title: "",
    district: "",
    city: "",
    county: "",
    location: "",
    type: "Full Time",
    posted: today,
    closing_date: addDays(today, 45),
    salary_range: "",
    benefits: "",
    job_description: "",
    applyUrl: "",
    contact_name: "",
    contact_title: "",
    contact_email: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    if (name === "posted") {
      setForm({
        ...form,
        posted: value,
        closing_date: addDays(value, 45),
      });
      return;
    }

    setForm({ ...form, [name]: value });
  }

  function handlePreview(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    setPreviewMode(true);
  }

  async function handleSubmit() {
    setStatus("Submitting...");

    const res = await fetch("/api/admin/add-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus(`❌ ${data.error || "Something went wrong."}`);
      return;
    }

    setStatus("✅ Job posted successfully. Redirecting...");
    router.push("/jobs");
  }

  if (previewMode) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-white px-6 py-12 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-2xl border border-orange-100 bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold">Preview Job Posting</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review the job before publishing it to NJSchoolCareers.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-3xl font-bold text-slate-950">{form.title}</h2>

            <p className="mt-3 text-lg font-medium text-slate-700">
              {form.district}
            </p>

            <p className="mt-2 text-sm text-slate-600">
              {form.city}, NJ · {form.county}
              {form.location ? ` · ${form.location}` : ""}
            </p>

            <div className="mt-5 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
              <p>
                <span className="font-semibold text-slate-950">Type:</span>{" "}
                {form.type}
              </p>

              <p>
                <span className="font-semibold text-slate-950">Posted:</span>{" "}
                {form.posted}
              </p>

              <p>
                <span className="font-semibold text-slate-950">
                  Closing Date:
                </span>{" "}
                {form.closing_date || "Not provided"}
              </p>

              <p>
                <span className="font-semibold text-slate-950">Salary:</span>{" "}
                {form.salary_range}
              </p>
            </div>
          </div>

          <section className="mt-8">
            <h3 className="text-xl font-semibold text-slate-950">Benefits</h3>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-7 text-slate-700">
              {form.benefits
                .split("\n")
                .filter(Boolean)
                .map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
            </ul>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold text-slate-950">
              Job Description
            </h3>
            <div className="mt-3 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-700">
              {form.job_description}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-xl font-semibold text-slate-950">
              Contact Information
            </h3>

            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p>{form.contact_name}</p>
              <p>{form.contact_title}</p>
              <p>{form.contact_email}</p>
              <p className="break-all">{form.applyUrl}</p>
            </div>
          </section>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-500 hover:text-orange-600"
            >
              Edit Job
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Publish Job
            </button>
          </div>

          {status && <p className="mt-4 text-sm font-medium">{status}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-white px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-xl rounded-2xl border border-orange-100 bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold">Admin Job Entry</h1>
        <p className="mt-2 text-sm text-slate-500">
          Add a structured job directly to your database.
        </p>

        <form onSubmit={handlePreview} className="mt-6 space-y-4">
          <input
            name="adminSecret"
            type="password"
            placeholder="Admin password"
            value={form.adminSecret}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <input
            name="title"
            placeholder="Job title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <input
            name="district"
            placeholder="School / District Name"
            value={form.district}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <select
            name="county"
            value={form.county}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          >
            <option value="">Select county</option>
            {counties.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>

          <input
            name="location"
            placeholder="Location / School Building (optional)"
            value={form.location}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          >
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            name="posted"
            type="date"
            value={form.posted}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <input
            name="closing_date"
            type="date"
            value={form.closing_date}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <p className="-mt-2 text-xs text-slate-500">
            If no employer deadline is provided, use the automatic 45-day
            closing date.
          </p>

          <input
            name="salary_range"
            placeholder="Salary Range: Example $60,000 - $75,000"
            value={form.salary_range}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <textarea
            name="benefits"
            placeholder="Benefits: Enter each benefit on a new line"
            value={form.benefits}
            onChange={handleChange}
            rows={5}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <textarea
            name="job_description"
            placeholder={`Job Description

Use headings if helpful:
Responsibilities:
- Teach students
- Collaborate with staff

Qualifications:
- NJ certification required
- Experience preferred`}
            value={form.job_description}
            onChange={handleChange}
            rows={9}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <input
            name="applyUrl"
            placeholder="Application link or hiring email"
            value={form.applyUrl}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <input
            name="contact_name"
            placeholder="Contact Name"
            value={form.contact_name}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <input
            name="contact_title"
            placeholder="Contact Title, e.g. HR Director, Principal"
            value={form.contact_title}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <input
            name="contact_email"
            type="email"
            placeholder="Contact Email"
            value={form.contact_email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Preview Job
          </button>

          {status && <p className="text-sm font-medium">{status}</p>}
        </form>
      </div>
    </main>
  );
}