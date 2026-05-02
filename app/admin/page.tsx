"use client";

import { useState } from "react";

type FormState = {
  adminSecret: string;
  title: string;
  district: string;
  city: string;
  county: string;
  location: string;
  type: string;
  posted: string;
  closing_date: string;
  salary_range: string;
  benefits: string;
  job_description: string;
  applyUrl: string;
  contact_name: string;
  contact_title: string;
  contact_email: string;
};

const countyOptions = [
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

const initialForm: FormState = {
  adminSecret: "",
  title: "",
  district: "",
  city: "",
  county: "",
  location: "",
  type: "Full Time",
  posted: new Date().toISOString().slice(0, 10),
  closing_date: "",
  salary_range: "",
  benefits: "",
  job_description: "",
  applyUrl: "",
  contact_name: "",
  contact_title: "",
  contact_email: "",
};

export default function AdminPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const inputStyle =
    "w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none";

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function isValidUrlOrEmail(value: string) {
    const trimmed = value.trim();

    if (trimmed.startsWith("mailto:")) return true;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return true;

    try {
      const url = new URL(trimmed);
      return ["http:", "https:"].includes(url.protocol);
    } catch {
      return false;
    }
  }

  function hasSalaryRange(value: string) {
    const v = value.trim().toLowerCase();
    const hasNumber = /\d/.test(v);
    const hasRange = /\s(-|–|—|to)\s/i.test(v);
    const badOpenEnded = /\+|and up|starting at|competitive|commensurate/.test(v);

    return hasNumber && hasRange && !badOpenEnded;
  }

  function validateForm() {
    if (!form.adminSecret.trim()) return "Admin password is required.";
    if (!form.title.trim()) return "Job title is required.";
    if (!form.district.trim()) return "School / district name is required.";
    if (!form.city.trim()) return "City is required.";
    if (!form.county.trim()) return "County is required.";
    if (!form.type.trim()) return "Job type is required.";
    if (!form.posted.trim()) return "Posted date is required.";
    if (!form.salary_range.trim()) return "Salary range is required.";
    if (!hasSalaryRange(form.salary_range)) {
      return "Salary range must include a good-faith range, such as $60,000 - $75,000 or $25/hr - $30/hr.";
    }
    if (!form.benefits.trim()) return "Benefits are required.";
    if (!form.job_description.trim()) return "Job description is required.";
    if (!form.applyUrl.trim()) return "Application link or email is required.";
    if (!isValidUrlOrEmail(form.applyUrl)) {
      return "Application must be a valid URL or email address.";
    }
    if (!form.contact_name.trim()) return "Contact name is required.";
    if (!form.contact_title.trim()) return "Contact title is required.";
    if (!form.contact_email.trim()) return "Contact email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email.trim())) {
      return "Contact email must be valid.";
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      setMessageType("error");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/add-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Job added successfully.");
        setMessageType("success");
        setForm({ ...initialForm, adminSecret: form.adminSecret });
      } else {
        setMessage(data.error || "Error adding job.");
        setMessageType("error");
      }
    } catch {
      setMessage("Something went wrong.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-white px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-3xl border border-orange-100 bg-white p-10 shadow-md">
        <h1 className="text-3xl font-bold text-slate-900">Admin Job Entry</h1>
        <p className="mt-2 text-slate-500">
          Add a structured job directly to your database.
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

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            name="adminSecret"
            type="password"
            placeholder="Admin password"
            value={form.adminSecret}
            onChange={handleChange}
            className={inputStyle}
          />

          <input
            name="title"
            placeholder="Job title"
            value={form.title}
            onChange={handleChange}
            className={inputStyle}
          />

          <input
            name="district"
            placeholder="School / District Name"
            value={form.district}
            onChange={handleChange}
            className={inputStyle}
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className={inputStyle}
          />

          <select
            name="county"
            value={form.county}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="">Select county</option>
            {countyOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            name="location"
            placeholder="Location / School Building (optional)"
            value={form.location}
            onChange={handleChange}
            className={inputStyle}
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className={inputStyle}
          >
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Leave Replacement</option>
            <option>Substitute</option>
            <option>Contract</option>
            <option>Stipend</option>
            <option>Summer</option>
            <option>Other</option>
          </select>

          <input
            type="date"
            name="posted"
            value={form.posted}
            onChange={handleChange}
            className={inputStyle}
          />

          <input
            type="date"
            name="closing_date"
            value={form.closing_date}
            onChange={handleChange}
            className={inputStyle}
          />

          <div>
            <input
              name="salary_range"
              placeholder="Salary Range (required): Example $60,000 - $75,000"
              value={form.salary_range}
              onChange={handleChange}
              className={inputStyle}
            />
            <p className="mt-1 text-xs text-slate-500">
              NJ law requires a good-faith salary range in job postings.
            </p>
          </div>

          <textarea
            name="benefits"
            placeholder="Benefits (required): Enter each benefit on a new line"
            value={form.benefits}
            onChange={handleChange}
            rows={4}
            className={inputStyle}
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
            rows={10}
            className={inputStyle}
          />

          <input
            name="applyUrl"
            placeholder="Application link or hiring email"
            value={form.applyUrl}
            onChange={handleChange}
            className={inputStyle}
          />

          <input
            name="contact_name"
            placeholder="Contact Name"
            value={form.contact_name}
            onChange={handleChange}
            className={inputStyle}
          />

          <input
            name="contact_title"
            placeholder="Contact Title, e.g. HR Director, Principal"
            value={form.contact_title}
            onChange={handleChange}
            className={inputStyle}
          />

          <input
            type="email"
            name="contact_email"
            placeholder="Contact Email"
            value={form.contact_email}
            onChange={handleChange}
            className={inputStyle}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-orange-600 hover:shadow-lg disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Submit Job"}
          </button>
        </form>
      </div>
    </main>
  );
}