"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const counties = [
  "Atlantic",
  "Bergen",
  "Burlington",
  "Camden",
  "Cape May",
  "Cumberland",
  "Essex",
  "Gloucester",
  "Hudson",
  "Hunterdon",
  "Mercer",
  "Middlesex",
  "Monmouth",
  "Morris",
  "Ocean",
  "Passaic",
  "Salem",
  "Somerset",
  "Sussex",
  "Union",
  "Warren",
];

const jobTypes = [
  "Full Time",
  "Part Time",
  "Substitute",
  "Administrative",
  "Support Staff",
  "Coaching",
];

export default function EditJobForm({ job }: { job: any }) {
  const router = useRouter();

  const [form, setForm] = useState({
    adminSecret: "",
    id: job.id,
    title: job.title || "",
    district: job.district || "",
    city: job.city || "",
    county: job.county || "",
    location: job.location || "",
    type: job.type || "",
    salary_range: job.salary_range || "",
    benefits: Array.isArray(job.benefits)
      ? job.benefits.join("\n")
      : job.benefits || "",
    job_description: job.job_description || "",
    applyUrl: job.applyUrl || "",
    contact_name: job.contact_name || "",
    contact_title: job.contact_title || "",
    contact_email: job.contact_email || "",
    status: job.status || "published",
  });

  const [message, setMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Saving...");

    const res = await fetch("/api/admin/update-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(`❌ ${data.error || "Update failed"}`);
      return;
    }

    setMessage("✅ Job updated. Redirecting...");
    router.push("/admin");
  }

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none";

  const labelClass = "mb-1 block text-sm font-semibold text-slate-700";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-slate-900">Edit Job</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review and update the job posting details below.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className={labelClass}>Admin Password</label>
            <input
              name="adminSecret"
              type="password"
              placeholder="Enter admin password"
              value={form.adminSecret}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Job Title</label>
            <input
              name="title"
              placeholder="Job Title"
              value={form.title}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>School / District Name</label>
            <input
              name="district"
              placeholder="School / District Name"
              value={form.district}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>City</label>
            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>County</label>
            <select
              name="county"
              value={form.county}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select County</option>
              {counties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Location / School Building
            </label>
            <input
              name="location"
              placeholder="Location / School Building (optional)"
              value={form.location}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Job Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Job Type</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Salary Range</label>
            <input
              name="salary_range"
              placeholder="Example: $60,000 - $75,000"
              value={form.salary_range}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Benefits</label>
            <textarea
              name="benefits"
              placeholder="Enter each benefit on a new line"
              value={form.benefits}
              onChange={handleChange}
              rows={5}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Job Description</label>
            <textarea
              name="job_description"
              placeholder="Job Description"
              value={form.job_description}
              onChange={handleChange}
              rows={10}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Application URL or Hiring Email
            </label>
            <input
              name="applyUrl"
              placeholder="Application URL or hiring email"
              value={form.applyUrl}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Contact Name</label>
            <input
              name="contact_name"
              placeholder="Contact Name"
              value={form.contact_name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Contact Title</label>
            <input
              name="contact_title"
              placeholder="Example: HR Director, Principal, CEO"
              value={form.contact_title}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Contact Email</label>
            <input
              name="contact_email"
              type="email"
              placeholder="Contact Email"
              value={form.contact_email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <button className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600">
            Save Changes
          </button>

          {message && <p className="text-sm text-slate-600">{message}</p>}
        </form>
      </div>
    </main>
  );
}