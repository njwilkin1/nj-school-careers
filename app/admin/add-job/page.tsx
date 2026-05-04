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

export default function AdminAddJobPage() {
    const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    adminSecret: "",
    title: "",
    district: "",
    city: "",
    county: "",
    location: "",
    type: "Full Time",
    posted: today,
    closing_date: "",
    salary_range: "",
    benefits: "",
    job_description: "",
    applyUrl: "",
    contact_name: "",
    contact_title: "",
    contact_email: "",
  });

  const [status, setStatus] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-white px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-xl rounded-2xl border border-orange-100 bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold">Admin Job Entry</h1>
        <p className="mt-2 text-sm text-slate-500">
          Add a structured job directly to your database.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

          <input
            name="salary_range"
            placeholder="Salary Range (required): Example $60,000 - $75,000"
            value={form.salary_range}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <p className="-mt-2 text-xs text-slate-500">
            NJ law requires a good-faith salary range in job postings.
          </p>

          <textarea
            name="benefits"
            placeholder="Benefits (required): Enter each benefit on a new line"
            value={form.benefits}
            onChange={handleChange}
            rows={5}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <textarea
            name="job_description"
            placeholder={`Job Description (required)

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
            Submit Job
          </button>

          {status && <p className="text-sm font-medium">{status}</p>}
        </form>
      </div>
    </main>
  );
}