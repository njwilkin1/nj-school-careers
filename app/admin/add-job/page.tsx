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

      // Save submitted job info for confirmation page
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

      // Redirect to confirmation page
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
      className="max-w-3xl mx-auto space-y-6 bg-white p-8 rounded-3xl shadow-sm"
    >
      {status && (
        <div
          className={
            status.type === "error"
              ? "text-red-600"
              : "text-green-600"
          }
        >
          {status.message}
        </div>
      )}

      <input
        name="title"
        placeholder="Job Title"
        required
        value={formData.title}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500"
      />

      <input
        name="district"
        placeholder="School District"
        required
        value={formData.district}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500"
      />

      <input
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500"
      />

      <input
        name="county"
        placeholder="County"
        value={formData.county}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500"
      />

      <input
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500"
      />

      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500"
      >
        <option value="">Select Job Type</option>
        <option value="Full Time">Full Time</option>
        <option value="Part Time">Part Time</option>
        <option value="Substitute">Substitute</option>
        <option value="Administrative">Administrative</option>
        <option value="Support Staff">Support Staff</option>
        <option value="Coaching">Coaching</option>
      </select>

      <input
        name="postingDate"
        type="date"
        value={formData.postingDate}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500"
      />

      <input
        name="applicationDeadline"
        type="date"
        value={formData.applicationDeadline}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500"
      />

      <input
        name="salary"
        placeholder="Salary Range"
        value={formData.salary}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500"
      />

      <textarea
        name="benefits"
        placeholder="Benefits"
        rows={4}
        value={formData.benefits}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500"
      />

      <textarea
        name="description"
        placeholder="Job Description"
        rows={6}
        value={formData.description}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500"
      />

      <input
        name="applyUrl"
        placeholder="Application URL"
        value={formData.applyUrl}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500"
      />

      <input
        name="contactName"
        placeholder="Contact Name"
        value={formData.contactName}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500"
      />

      <input
        name="contactTitle"
        placeholder="Contact Title"
        value={formData.contactTitle}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500"
      />

      <input
        name="contactEmail"
        placeholder="Contact Email"
        value={formData.contactEmail}
        onChange={handleChange}
        className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Job"}
      </button>
    </form>
  );
}