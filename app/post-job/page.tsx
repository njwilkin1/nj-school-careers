"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US");
}

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

const counties = [
  "Atlantic", "Bergen", "Burlington", "Camden", "Cape May", "Cumberland",
  "Essex", "Gloucester", "Hudson", "Hunterdon", "Mercer", "Middlesex",
  "Monmouth", "Morris", "Ocean", "Passaic", "Salem", "Somerset",
  "Sussex", "Union", "Warren",
];

const jobTypes = [
  "Full Time",
  "Part Time",
  "Substitute",
  "Administrative",
  "Support Staff",
  "Coaching",
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateString: string, days: number) {
  const date = dateString ? new Date(dateString) : new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export default function PostJobForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    district: "",
    city: "",
    county: "",
    location: "",
    type: "",
    postingDate: today(),
    applicationDeadline: "",
    salary: "",
    benefits: "",
    description: "",
    applyUrl: "",
    contactName: "",
    contactTitle: "",
    contactEmail: "",
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    setPreviewOpen(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStatus(null);

    const finalDeadline =
      formData.applicationDeadline || addDays(formData.postingDate, 45);

    const payload = {
      ...formData,
      applicationDeadline: finalDeadline,
    };

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit job.");
      }

      sessionStorage.setItem(
        "lastSubmittedJob",
        JSON.stringify({
          title: payload.title,
          district: payload.district,
          posted: payload.postingDate,
          application_deadline: payload.applicationDeadline,
        })
      );

      router.push("/post-job/confirmation");
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.message || "Something went wrong.",
      });
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <form
        onSubmit={handlePreview}
        className="mx-auto max-w-3xl space-y-5 rounded-3xl bg-white p-8 shadow-sm"
      >
        <h1 className="text-3xl font-bold text-slate-900">Post a Job</h1>

        {status && (
          <div className={status.type === "error" ? "text-red-600" : "text-green-600"}>
            {status.message}
          </div>
        )}

        <input name="title" placeholder="Job Title" required value={formData.title} onChange={handleChange} className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500" />

        <input name="district" placeholder="School / District Name" required value={formData.district} onChange={handleChange} className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500" />

        <input name="city" placeholder="City" required value={formData.city} onChange={handleChange} className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500" />

        <select name="county" required value={formData.county} onChange={handleChange} className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500">
          <option value="">Select County</option>
          {counties.map((county) => (
            <option key={county} value={county}>
              {county}
            </option>
          ))}
        </select>

        <input name="location" placeholder="Location / School Building (optional)" value={formData.location} onChange={handleChange} className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500" />

        <select name="type" required value={formData.type} onChange={handleChange} className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500">
          <option value="">Select Job Type</option>
          {jobTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <div>
          <label className="font-semibold text-slate-800">Posting Date</label>
          <input type="date" name="postingDate" value={formData.postingDate} onChange={handleChange} className="mt-2 w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500" />
          <p className="mt-1 text-sm text-slate-500">
            Use the date the job was posted by the district or employer.
          </p>
        </div>

        <div>
          <label className="font-semibold text-slate-800">Application Deadline</label>
          <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} className="mt-2 w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500" />
          <p className="mt-1 text-sm text-slate-500">
            If left blank, a 45-day closing date will be used.
          </p>
        </div>

        <input name="salary" placeholder="Salary Range: Example $60,000 - $75,000" value={formData.salary} onChange={handleChange} className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500" />

        <textarea name="benefits" placeholder="Benefits: Enter each benefit on a new line" rows={4} value={formData.benefits} onChange={handleChange} className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500" />

        <textarea name="description" placeholder="Job Description" required rows={7} value={formData.description} onChange={handleChange} className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500" />

        <input name="applyUrl" placeholder="Application URL or hiring email" required value={formData.applyUrl} onChange={handleChange} className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500" />

        <input name="contactName" placeholder="Contact Name" value={formData.contactName} onChange={handleChange} className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500" />

        <input name="contactTitle" placeholder="Contact Title, e.g. HR Director, Principal" value={formData.contactTitle} onChange={handleChange} className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500" />

        <input name="contactEmail" placeholder="Contact Email" type="email" value={formData.contactEmail} onChange={handleChange} className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:border-orange-500" />

        <button
          type="submit"
          className="w-full rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Preview Job
        </button>
      </form>

      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900">Preview Job</h2>

            <div className="mt-4 space-y-3 text-slate-700">
              <p><strong>Title:</strong> {formData.title}</p>
              <p><strong>District:</strong> {formData.district}</p>
              <p><strong>City:</strong> {formData.city}</p>
              <p><strong>County:</strong> {formData.county}</p>
              <p><strong>Job Type:</strong> {formData.type}</p>
              <p>
  <strong>Posting Date:</strong>{" "}
  {formatDate(formData.postingDate)}
</p>

<p>
  <strong>Application Deadline:</strong>{" "}
  {formatDate(
    formData.applicationDeadline || addDays(formData.postingDate, 45)
  )}
</p>
              <p><strong>Salary:</strong> {formData.salary}</p>
              <p><strong>Benefits:</strong> {formData.benefits}</p>
              <p><strong>Description:</strong> {formData.description}</p>
              <p><strong>Apply:</strong> {formData.applyUrl}</p>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="flex-1 rounded-xl border border-orange-500 px-6 py-3 font-semibold text-orange-500 hover:bg-orange-50"
              >
                Edit Job
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}