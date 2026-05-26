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

  const [accessEmail, setAccessEmail] = useState("");
  const [accessVerified, setAccessVerified] = useState(false);
  const [employerOrderId, setEmployerOrderId] = useState<string | null>(null);
  const [accessLoading, setAccessLoading] = useState(false);
  const [accessError, setAccessError] = useState("");

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

  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

  async function verifyAccess(e: React.FormEvent) {
    e.preventDefault();
    setAccessLoading(true);
    setAccessError("");

    try {
      const res = await fetch("/api/employer-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: accessEmail.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No active employer plan found.");
      }

      setEmployerOrderId(data.order.id);
      setAccessVerified(true);
    } catch (err: any) {
      setAccessError(
        err.message ||
          "We could not verify an active employer plan for that email."
      );
    } finally {
      setAccessLoading(false);
    }
  }

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
      employerEmail: accessEmail.trim().toLowerCase(),
      employerOrderId,
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
  setPreviewOpen(false);

  setStatus({
    type: "error",
    message: err.message || "Something went wrong.",
  });

  setLoading(false);
}
  };

  if (!accessVerified) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20">
        <form
          onSubmit={verifyAccess}
          className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            Employer Access
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Verify your employer plan
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            Enter the email used during Stripe checkout or the email approved
            for purchase order access.
          </p>

          {accessError && (
            <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {accessError}
            </div>
          )}

          <div className="mt-6">
            <label className={labelClass}>Employer Email *</label>
            <input
              type="email"
              required
              value={accessEmail}
              onChange={(e) => setAccessEmail(e.target.value)}
              placeholder="hr@district.org"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={accessLoading}
            className="mt-6 w-full rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {accessLoading ? "Verifying..." : "Continue to Job Form"}
          </button>

          <p className="mt-5 text-sm leading-6 text-slate-600">
            Need access?{" "}
            <a
              href="/employers/pricing"
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              View employer pricing
            </a>{" "}
            or contact info@njschoolcareers.com for purchase order access.
          </p>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <form
        onSubmit={handlePreview}
        className="mx-auto w-full max-w-3xl space-y-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
      >
        <h1 className="text-3xl font-bold text-slate-900">Post a Job</h1>

        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          Employer access verified for {accessEmail.trim().toLowerCase()}.
        </div>

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
          <label className={labelClass}>Job Title *</label>
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
          <label className={labelClass}>School / District Name *</label>
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
          <label className={labelClass}>City *</label>
          <input
            name="city"
            placeholder="Enter city"
            required
            value={formData.city}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>County *</label>
          <select
            name="county"
            required
            value={formData.county}
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
          <label className={labelClass}>Job Type *</label>
          <select
            name="type"
            required
            value={formData.type}
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
          <label className={labelClass}>Posting Date</label>
          <input
            type="date"
            name="postingDate"
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
            type="date"
            name="applicationDeadline"
            value={formData.applicationDeadline}
            onChange={handleChange}
            className={inputClass}
          />
          <p className="mt-1 text-sm text-slate-600">
            If left blank, a 45-day closing date will be used.
          </p>
        </div>

        <div>
          <label className={labelClass}>Salary Range *</label>
          <input
            name="salary"
            placeholder="Example: $60,000 - $75,000"
            required
            value={formData.salary}
            onChange={handleChange}
            className={inputClass}
          />
       <p className="mt-1 text-sm text-slate-600">
  New Jersey Pay Transparency law requires employers to provide a general description of benefits and salary range information in covered job postings.
</p>
        </div>

        <div>
          <label className={labelClass}>Benefits Summary *</label>
          <textarea
            name="benefits"
            placeholder="Example: Medical, dental, pension, paid sick days"
            required
            rows={4}
            value={formData.benefits}
            onChange={handleChange}
            className={`${inputClass} resize-y`}
          />
           <p className="mt-1 text-sm text-slate-600">
            Provide a general description of the benefits offered for this position.
          </p>
        </div>
        <div>
          <label className={labelClass}>Job Description *</label>
          <textarea
            name="description"
            placeholder="Enter the job description"
            required
            rows={7}
            value={formData.description}
            onChange={handleChange}
            className={`${inputClass} resize-y`}
          />
       
        </div>

        <div>
          <label className={labelClass}>Application URL or Hiring Email *</label>
          <input
            name="applyUrl"
            placeholder="Example: https://www.district.org/apply or hr@district.org"
            required
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
            type="email"
            placeholder="Enter contact email"
            value={formData.contactEmail}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          All employer submissions are reviewed before publication.
        </p>

        <button
          type="submit"
          className="w-full rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
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
              <p><strong>Posting Date:</strong> {formatDate(formData.postingDate)}</p>
              <p>
                <strong>Application Deadline:</strong>{" "}
                {formatDate(
                  formData.applicationDeadline ||
                    addDays(formData.postingDate, 45)
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