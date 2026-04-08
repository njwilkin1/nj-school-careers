"use client";

import { useState } from "react";

export default function AdminPage() {
  const [form, setForm] = useState({
    title: "",
    district: "",
    location: "",
    type: "Full Time",
    posted: "",
    applyUrl: "",
    overview: "",
    responsibilities: "",
    requirements: "",
    adminSecret: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/admin/add-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Job added!");
      console.log(data);
    } else if (res.status === 409) {
      alert("Duplicate job detected. This one is already in your CSV.");
      console.error(data);
    } else {
      alert(data.error || "Error adding job");
      console.error(data);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Add Job</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            name="adminSecret"
            type="password"
            placeholder="Admin Password"
            value={form.adminSecret}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <input
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <input
            name="district"
            placeholder="District"
            value={form.district}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

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

          <input
            name="posted"
            type="date"
            value={form.posted}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <input
            name="applyUrl"
            placeholder="Apply URL"
            value={form.applyUrl}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <textarea
            name="overview"
            placeholder="Overview"
            value={form.overview}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <textarea
            name="responsibilities"
            placeholder="Responsibilities (use | between items)"
            value={form.responsibilities}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <textarea
            name="requirements"
            placeholder="Requirements (use | between items)"
            value={form.requirements}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
          >
            Add Job
          </button>
        </form>
      </div>
    </main>
  );
}