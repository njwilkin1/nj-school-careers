"use client";

import { useState } from "react";

type FormState = {
  title: string;
  district: string;
  location: string;
  county: string;
  type: string;
  posted: string;
  applyUrl: string;
  overview: string;
  responsibilities: string;
  requirements: string;
  adminSecret: string;
};

const countyOptions = [
  "Bergen County",
  "Hudson County",
  "Essex County",
  "Passaic County",
  "Union County",
  "Middlesex County",
  "Morris County",
  "Monmouth County",
  "Ocean County",
  "Burlington County",
  "Somerset County",
  "Camden County",
  "Cape May",
  "Gloucester County",
  "Warren County",
  "Sussex County",
  "Salem County",
  "Mercer County",
  "Hunterdon County",
  "Cumberland County",
  "Atlantic County",
];

const initialForm: FormState = {
  title: "",
  district: "",
  location: "",
  county: "",
  type: "Full Time",
  posted: new Date().toISOString().slice(0, 10),
  applyUrl: "",
  overview: "",
  responsibilities: "",
  requirements: "",
  adminSecret: "",
};

export default function AdminPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

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
      return ["http:", "https:", "mailto:"].includes(url.protocol);
    } catch {
      return false;
    }
  }

  function validateForm() {
    if (!form.adminSecret.trim()) return "Admin password is required.";
    if (!form.title.trim()) return "Job title is required.";
    if (!form.district.trim()) return "District is required.";
    if (!form.location.trim()) return "Location is required.";
    if (!form.county.trim()) return "County is required.";
    if (!form.type.trim()) return "Job type is required.";
    if (!form.posted.trim()) return "Posted date is required.";
    if (!form.applyUrl.trim()) return "Apply URL is required.";
    if (!isValidUrlOrEmail(form.applyUrl.trim())) {
      return "Apply URL must be a valid link or email address.";
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

  const inputStyle =
    "w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none";

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-white px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-3xl border border-orange-100 bg-white p-10 shadow-md">
        <h1 className="text-3xl font-bold text-slate-900">
          Admin Job Entry
        </h1>
        <p className="mt-2 text-slate-500">
          Add a job directly to your database.
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
            placeholder="District"
            value={form.district}
            onChange={handleChange}
            className={inputStyle}
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
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
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className={inputStyle}
          >
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Substitute</option>
            <option>Stipend</option>
            <option>Summer</option>
          </select>

          <input
            type="date"
            name="posted"
            value={form.posted}
            onChange={handleChange}
            className={inputStyle}
          />

          <input
            name="applyUrl"
            placeholder="https://... or email@example.com"
            value={form.applyUrl}
            onChange={handleChange}
            className={inputStyle}
          />

          <textarea
            name="overview"
            placeholder="Overview"
            value={form.overview}
            onChange={handleChange}
            className={inputStyle}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-orange-600 hover:shadow-lg"
          >
            {submitting ? "Adding..." : "Submit Job"}
          </button>

        </form>
      </div>
    </main>
  );
}