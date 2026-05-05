"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Saving...");

    const res = await fetch("/api/admin/update-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-slate-900">Edit Job</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            name="adminSecret"
            type="password"
            placeholder="Admin password"
            value={form.adminSecret}
            onChange={handleChange}
            className={inputClass}
          />

          <input name="title" value={form.title} onChange={handleChange} className={inputClass} />
          <input name="district" value={form.district} onChange={handleChange} className={inputClass} />
          <input name="city" value={form.city} onChange={handleChange} className={inputClass} />
          <input name="county" value={form.county} onChange={handleChange} className={inputClass} />
          <input name="location" value={form.location} onChange={handleChange} className={inputClass} />
          <input name="type" value={form.type} onChange={handleChange} className={inputClass} />
          <input name="salary_range" value={form.salary_range} onChange={handleChange} className={inputClass} />

          <textarea
            name="benefits"
            value={form.benefits}
            onChange={handleChange}
            rows={5}
            className={inputClass}
          />

          <textarea
            name="job_description"
            value={form.job_description}
            onChange={handleChange}
            rows={10}
            className={inputClass}
          />

          <input name="applyUrl" value={form.applyUrl} onChange={handleChange} className={inputClass} />
          <input name="contact_name" value={form.contact_name} onChange={handleChange} className={inputClass} />
          <input name="contact_title" value={form.contact_title} onChange={handleChange} className={inputClass} />
          <input name="contact_email" value={form.contact_email} onChange={handleChange} className={inputClass} />

          <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
            <option value="published">published</option>
            <option value="pending">pending</option>
            <option value="rejected">rejected</option>
          </select>

          <button className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600">
            Save Changes
          </button>

          {message && <p className="text-sm">{message}</p>}
        </form>
      </div>
    </main>
  );
}