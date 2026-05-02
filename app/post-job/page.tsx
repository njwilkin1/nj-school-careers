"use client";

import { useState } from "react";

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

export default function PostJobPage() {
  const [form, setForm] = useState({
    jobTitle: "",
    district: "",
    city: "",
    county: "",
    location: "",
    jobType: "",
    salaryRange: "",
    benefits: "",
    jobDescription: "",
    applicationLink: "",
    contactName: "",
    contactTitle: "",
    contactEmail: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle =
    "w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-orange-500 focus:outline-none";

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function hasSalaryRange(value: string) {
    const v = value.trim().toLowerCase();
    const hasNumber = /\d/.test(v);
    const hasRange = /\s(-|–|—|to)\s/i.test(v);
    const badOpenEnded = /\+|and up|starting at|competitive|commensurate/.test(v);

    return hasNumber && hasRange && !badOpenEnded;
  }

  function isValidUrlOrEmail(value: string) {
    const trimmed = value.trim();

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return true;

    try {
      const url = new URL(trimmed);
      return ["http:", "https:"].includes(url.protocol);
    } catch {
      return false;
    }
  }

  function validateForm() {
    if (!form.jobTitle.trim()) return "Job title is required.";
    if (!form.district.trim()) return "School / district name is required.";
    if (!form.city.trim()) return "City is required.";
    if (!form.county.trim()) return "County is required.";
    if (!form.jobType.trim()) return "Job type is required.";
    if (!form.salaryRange.trim()) return "Salary range is required.";

    if (!hasSalaryRange(form.salaryRange)) {
      return "Please enter a good-faith salary range, such as $60,000 - $75,000 or $25/hr - $30/hr.";
    }

    if (!form.benefits.trim()) return "Benefits are required.";
    if (!form.jobDescription.trim()) return "Job description is required.";
    if (!form.applicationLink.trim()) return "Application link or hiring email is required.";

    if (!isValidUrlOrEmail(form.applicationLink)) {
      return "Application must be a valid URL or email address.";
    }

    if (!form.contactName.trim()) return "Contact name is required.";
    if (!form.contactTitle.trim()) return "Contact title is required.";
    if (!form.contactEmail.trim()) return "Contact email is required.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail.trim())) {
      return "Contact email must be valid.";
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    console.log("POST JOB FORM SUBMITTED");
    console.log("FORM DATA:", form);
    console.log("SALARY RANGE:", form.salaryRange);

    const validationError = validateForm();

    if (validationError) {
      console.log("VALIDATION STOPPED SUBMISSION:", validationError);
      setStatus(validationError);
      setLoading(false);
      return;
    }

    try {
      const formspreeEndpoint = "https://formspree.io/f/xlgozdbp";

      console.log("SENDING TO FORMSPREE:", formspreeEndpoint);

      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `New Job Submission - ${form.jobTitle}`,
          _replyto: form.contactEmail,
          email: form.contactEmail,

          jobTitle: form.jobTitle,
          district: form.district,
          city: form.city,
          county: form.county,
          location: form.location || "N/A",
          jobType: form.jobType,
          salaryRange: form.salaryRange,
          benefits: form.benefits,
          jobDescription: form.jobDescription,
          applicationLink: form.applicationLink,
          contactName: form.contactName,
          contactTitle: form.contactTitle,
          contactEmail: form.contactEmail,

          "Job Information": `
Title: ${form.jobTitle}
School/District: ${form.district}
City: ${form.city}
County: ${form.county}
Location/Building: ${form.location || "N/A"}
Type: ${form.jobType}
Salary Range: ${form.salaryRange}
          `,

          Benefits: form.benefits,

          "Job Description": form.jobDescription,

          Application: `
Apply Here: ${form.applicationLink}
          `,

          Contact: `
Name: ${form.contactName}
Title: ${form.contactTitle}
Email: ${form.contactEmail}
          `,

          Source: "Submitted via NJSchoolCareers.com",
        }),
      });

      console.log("FORMSPREE STATUS:", response.status);

      const data = await response.json().catch(() => null);

      console.log("FORMSPREE RESPONSE:", data);

      if (response.ok) {
        setStatus("Thank you. Your job was submitted successfully.");
        setForm({
          jobTitle: "",
          district: "",
          city: "",
          county: "",
          location: "",
          jobType: "",
          salaryRange: "",
          benefits: "",
          jobDescription: "",
          applicationLink: "",
          contactName: "",
          contactTitle: "",
          contactEmail: "",
        });
      } else {
        setStatus(
          data?.errors?.[0]?.message ||
            data?.error ||
            `Form submission failed with status ${response.status}.`
        );
      }
    } catch (error) {
      console.error("FORMSPREE SUBMISSION ERROR:", error);
      setStatus("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight">Post a Job</h1>

        <p className="mt-2 text-sm font-semibold text-orange-500">
          Free job posting during our launch period. Paid plans coming soon.
        </p>

        <p className="mt-2 text-slate-600">
          Reach candidates across New Jersey. No account required.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <input name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="Job Title" className={inputStyle} />

          <input name="district" value={form.district} onChange={handleChange} placeholder="School / District Name" className={inputStyle} />

          <input name="city" value={form.city} onChange={handleChange} placeholder="City" className={inputStyle} />

          <select name="county" value={form.county} onChange={handleChange} className={inputStyle}>
            <option value="">Select County</option>
            {countyOptions.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>

          <input name="location" value={form.location} onChange={handleChange} placeholder="Location / School Building (optional)" className={inputStyle} />

          <select name="jobType" value={form.jobType} onChange={handleChange} className={inputStyle}>
            <option value="">Job Type</option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Leave Replacement</option>
            <option>Substitute</option>
            <option>Contract</option>
            <option>Stipend</option>
            <option>Summer</option>
            <option>Other</option>
          </select>

          <div>
            <input name="salaryRange" value={form.salaryRange} onChange={handleChange} placeholder="Salary Range (required): Example $60,000 - $75,000" className={inputStyle} />
            <p className="mt-1 text-xs text-slate-500">
              New Jersey law requires a good-faith salary range in job postings.
            </p>
          </div>

          <textarea name="benefits" value={form.benefits} onChange={handleChange} placeholder="Benefits (required): Enter each benefit on a new line" rows={4} className={inputStyle} />

          <textarea
            name="jobDescription"
            value={form.jobDescription}
            onChange={handleChange}
            placeholder={`Job Description (required)

Use headings if helpful:
Responsibilities:
- Teach students
- Collaborate with staff

Qualifications:
- NJ certification required
- Experience preferred`}
            rows={9}
            className={inputStyle}
          />

          <input name="applicationLink" value={form.applicationLink} onChange={handleChange} placeholder="Application link or hiring email" className={inputStyle} />

          <input name="contactName" value={form.contactName} onChange={handleChange} placeholder="Contact Name" className={inputStyle} />

          <input name="contactTitle" value={form.contactTitle} onChange={handleChange} placeholder="Contact Title, e.g. HR Director, Principal" className={inputStyle} />

          <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="Contact Email" className={inputStyle} />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Job"}
          </button>
        </form>

        {status && <p className="mt-4 text-sm text-slate-600">{status}</p>}
      </div>
    </main>
  );
}