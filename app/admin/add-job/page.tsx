"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type JobFormData = {
  title: string;
  district: string;
  city: string;
  county: string;
  location: string;
  type: string;
  postingDate: string;
  applicationDeadline: string;
  salary: string;
  benefits: string;
  description: string;
  applyUrl: string;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
};

export default function PostJobForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    district: "",
    city: "",
    county: "",
    location: "",
    type: "",
    postingDate: "",
    applicationDeadline: "",
    salary: "",
    benefits: "",
    description: "",
    applyUrl: "",
    contactName: "",
    contactTitle: "",
    contactEmail: "",
  });

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();

        console.error("NON-JSON RESPONSE:", text);

        setStatus({
          type: "error",
          message: "Server returned an invalid response.",
        });

        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setStatus({
          type: "error",
          message: data.error || "Something went wrong.",
        });

        setLoading(false);
        return;
      }

      sessionStorage.setItem(
        "lastSubmittedJob",
        JSON.stringify({
          title: formData.title,
          district: formData.district,
          city: formData.city,
          county: formData.county,
          type: formData.type,
          postingDate: formData.postingDate,
          applicationDeadline: formData.applicationDeadline,
        })
      );

      router.push("/post-job/confirmation");
    } catch (err: any) {
      console.error(err);

      setStatus({
        type: "error",
        message: err.message || "Something went wrong.",
      });

      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-3xl space-y-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
    >
      {status && (
        <div
          className={
            status.type === "error"
              ? "rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              : "rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700"
          }
        >
          {status.message}
        </div>
      )}

      <div>
        <label className={labelClass}>Job Title</label>
        <input
          name="title"
          placeholder="Enter job title"
          required
          value={formData.title}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>School / District Name</label>
        <input
          name="district"
          placeholder="Enter school or district name"
          required
          value={formData.district}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>City</label>
        <input
          name="city"
          placeholder="Enter city"
          value={formData.city}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>County</label>
        <input
          name="county"
          placeholder="Enter county"
          value={formData.county}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Location / School Building</label>
        <input
          name="location"
          placeholder="Optional"
          value={formData.location}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Job Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Select Job Type</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Substitute">Substitute</option>
          <option value="Administrative">Administrative</option>
          <option value="Support Staff">Support Staff</option>
          <option value="Coaching">Coaching</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Posting Date</label>
        <input
          name="postingDate"
          type="date"
          value={formData.postingDate}
          onChange={handleChange}
          className={inputClass}
        />
        <p className="mt-1 text-sm text-slate-600">
          Use the date the job was posted by the district or employer.
        </p>
      </div>

      <div>
        <label className={labelClass}>Application Deadline</label>
        <input
          name="applicationDeadline"
          type="date"
          value={formData.applicationDeadline}
          onChange={handleChange}
          className={inputClass}
        />
        <p className="mt-1 text-sm text-slate-600">
          If left blank, a 45-day closing date will be used.
        </p>
      </div>

      <div>
        <label className={labelClass}>Salary Range</label>
        <input
          name="salary"
          placeholder="Example: $60,000 - $75,000"
          value={formData.salary}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Benefits</label>
        <textarea
          name="benefits"
          placeholder="Enter each benefit on a new line"
          rows={4}
          value={formData.benefits}
          onChange={handleChange}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div>
        <label className={labelClass}>Job Description</label>
        <textarea
          name="description"
          placeholder="Enter the job description"
          rows={6}
          value={formData.description}
          onChange={handleChange}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div>
        <label className={labelClass}>Application URL or Hiring Email</label>
        <input
          name="applyUrl"
          placeholder="Enter application URL or email"
          value={formData.applyUrl}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div className="border-t border-slate-200 pt-6">
        <label className={labelClass}>Contact Name</label>
        <input
          name="contactName"
          placeholder="Enter contact name"
          value={formData.contactName}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Contact Title</label>
        <input
          name="contactTitle"
          placeholder="Example: HR Director, Principal"
          value={formData.contactTitle}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Contact Email</label>
        <input
          name="contactEmail"
          placeholder="Enter contact email"
          value={formData.contactEmail}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Job"}
      </button>
    </form>
  );
}