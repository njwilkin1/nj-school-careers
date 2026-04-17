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
  "Other NJ",
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

  function isValidUrl(value: string) {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
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
    if (!isValidUrl(form.applyUrl.trim())) return "Apply URL must be a valid link.";

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

    const cleanedForm: FormState = {
      ...form,
      title: form.title.trim(),
      district: form.district.trim(),
      location: form.location.trim(),
      county: form.county.trim(),
      type: form.type.trim(),
      posted: form.posted.trim(),
      applyUrl: form.applyUrl.trim(),
      overview: form.overview.trim(),
      responsibilities: form.responsibilities.trim(),
      requirements: form.requirements.trim(),
      adminSecret: form.adminSecret.trim(),
    };

    try {
      const res = await fetch("/api/admin/add-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedForm),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Job added successfully.");
        setMessageType("success");
        setForm({
          ...initialForm,
          adminSecret: cleanedForm.adminSecret,
        });
      } else if (res.status === 409) {
        setMessage("Duplicate job detected. This job already exists.");
        setMessageType("error");
      } else {
        setMessage(data.error || "Error adding job.");
        setMessageType("error");
      }
    } catch {
      setMessage("Something went wrong while submitting the job.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Job Entry</h1>
          <p className="mt-2 text-slate-600">
            Add a job directly to your database. Only the basic fields are required. You can add extra details later.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Admin Password
            </label>
            <input
              name="adminSecret"
              type="password"
              placeholder="Enter admin password"
              value={form.adminSecret}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Job Title
              </label>
              <input
                name="title"
                placeholder="e.g. Assistant Principal"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                District
              </label>
              <input
                name="district"
                placeholder="e.g. Glen Ridge School District"
                value={form.district}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Location
              </label>
              <input
                name="location"
                placeholder="e.g. Glen Ridge NJ"
                value={form.location}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                County
              </label>
              <select
                name="county"
                value={form.county}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              >
                <option value="">Select county</option>
                {countyOptions.map((county) => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Job Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              >
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Substitute</option>
                <option>Administrative</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Posted Date
              </label>
              <input
                name="posted"
                type="date"
                value={form.posted}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Apply URL
              </label>
              <input
                name="applyUrl"
                placeholder="https://..."
                value={form.applyUrl}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Overview <span className="text-slate-400">(optional)</span>
            </label>
            <textarea
              name="overview"
              placeholder="Optional: one or two clear sentences about the role."
              value={form.overview}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Responsibilities <span className="text-slate-400">(optional)</span>
            </label>
            <textarea
              name="responsibilities"
              placeholder="Optional: one item per line or use | between items"
              value={form.responsibilities}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Requirements <span className="text-slate-400">(optional)</span>
            </label>
            <textarea
              name="requirements"
              placeholder="Optional: one item per line or use | between items"
              value={form.requirements}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <p className="text-sm text-slate-500">
              Required: title, district, location, county, job type, posted date, and apply URL.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {submitting ? "Adding..." : "Add Job"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}