"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

function getCategory(title: string) {
  const value = title.toLowerCase();

  if (value.includes("coach")) return "Coaching";
  if (value.includes("substitute")) return "Substitute";

  if (
    value.includes("principal") ||
    value.includes("director") ||
    value.includes("supervisor") ||
    value.includes("administrator")
  ) {
    return "Administrator";
  }

  if (
    value.includes("counselor") ||
    value.includes("nurse") ||
    value.includes("social worker") ||
    value.includes("child study")
  ) {
    return "Special Services";
  }

  if (
    value.includes("secretary") ||
    value.includes("aide") ||
    value.includes("paraprofessional") ||
    value.includes("clerk")
  ) {
    return "Support Staff";
  }

  return "Teacher";
}

function daysAgo(posted?: string) {
  if (!posted) return "";

  const postedDate = new Date(posted);
  if (Number.isNaN(postedDate.getTime())) return "";

  const diff = Math.floor(
    (Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff <= 0) return "Posted today";
  if (diff === 1) return "Posted 1 day ago";
  return `Posted ${diff} days ago`;
}

function isNew(posted?: string) {
  const label = daysAgo(posted);

  return (
    label === "Posted today" ||
    label === "Posted 1 day ago" ||
    label === "Posted 2 days ago" ||
    label === "Posted 3 days ago"
  );
}

export default function JobFilters({ jobs }: { jobs: any[] }) {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [county, setCounty] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const JOBS_PER_PAGE = 15;

  const counties = useMemo(() => {
    return Array.from(
      new Set(jobs.map((job) => job.county).filter(Boolean))
    ).sort();
  }, [jobs]);

  const filteredJobs = jobs.filter((job) => {
    const jobCategory = getCategory(job.title || "");

    const haystack = [
      job.title || "",
      job.district || "",
      job.county || "",
      job.location || "",
      job.city || "",
      job.type || "",
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!search || haystack.includes(search.toLowerCase())) &&
      (!county || job.county?.toLowerCase() === county.toLowerCase()) &&
      (!category || jobCategory === category) &&
      (!type || job.type?.toLowerCase() === type.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  function clearFilters() {
    setSearch("");
    setCounty("");
    setCategory("");
    setType("");
    setCurrentPage(1);
  }

  async function handleShare(job: any) {
    const jobUrl = `https://www.njschoolcareers.com/jobs/${job.slug || job.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `${job.title} at ${job.district}`,
          url: jobUrl,
        });
      } catch {
        // user cancelled share
      }
    } else {
      await navigator.clipboard.writeText(jobUrl);
      alert("Job link copied!");
    }
  }

  return (
    <div className="mt-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <input
            placeholder="Search title, district, or keyword"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
          />

          <select
            value={county}
            onChange={(e) => {
              setCounty(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-orange-500 focus:outline-none"
          >
            <option value="">All counties</option>
            {counties.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-orange-500 focus:outline-none"
          >
            <option value="">All roles</option>
            <option value="Teacher">Teacher</option>
            <option value="Administrator">Administrator</option>
            <option value="Special Services">Special Services</option>
            <option value="Support Staff">Support Staff</option>
            <option value="Substitute">Substitute</option>
            <option value="Coaching">Coaching</option>
          </select>

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-orange-500 focus:outline-none"
          >
            <option value="">All job types</option>
            <option value="full time">Full Time</option>
            <option value="part time">Part Time</option>
            <option value="substitute">Substitute</option>
            <option value="stipend">Stipend</option>
            <option value="summer">Summer</option>
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:border-orange-500 hover:text-orange-600"
          >
            Clear
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-900">
            {paginatedJobs.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-900">
            {filteredJobs.length}
          </span>{" "}
          matching jobs
        </p>
      </section>

      <div className="mt-8 space-y-4">
        {paginatedJobs.map((job, index) => {
          const categoryLabel = getCategory(job.title || "");

          return (
            <article
              key={`${job.id || job.slug || index}`}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap gap-2">
                    {job.type && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                        {job.type}
                      </span>
                    )}

                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-600">
                      {categoryLabel}
                    </span>

                    {isNew(job.posted) && (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-600">
                        New
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                    {job.title}
                  </h2>

                  <p className="mt-2 text-base font-medium text-slate-700">
                    {job.district}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {job.location || job.city || ""}
                    {job.county ? ` · ${job.county}` : ""}
                  </p>
                </div>

                <div className="text-sm text-gray-500 md:text-right">
                  {daysAgo(job.posted)}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/jobs/${job.slug || job.id}`}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-500 hover:text-orange-600"
                >
                  View Details
                </Link>

                <a
                  href={job.applyUrl || `/jobs/${job.slug || job.id}`}
                  target={job.applyUrl ? "_blank" : "_self"}
                  rel="noreferrer"
                  className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Apply Now
                </a>

                <button
                  type="button"
                  onClick={() => handleShare(job)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
                >
                  Share
                </button>
              </div>
            </article>
          );
        })}
<div className="mt-8 text-center text-sm text-slate-500">
  Showing{" "}
  <span className="font-semibold text-slate-900">
    {(currentPage - 1) * JOBS_PER_PAGE + 1}
  </span>
  –
  <span className="font-semibold text-slate-900">
    {Math.min(currentPage * JOBS_PER_PAGE, filteredJobs.length)}
  </span>{" "}
  of{" "}
  <span className="font-semibold text-slate-900">
    {filteredJobs.length}
  </span>{" "}
  jobs
</div>
        {totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(
                Math.max(0, currentPage - 3),
                Math.min(totalPages, currentPage + 2)
              )
              .map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                    page === currentPage
                      ? "bg-orange-500 text-white"
                      : "border border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

        {filteredJobs.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">No jobs found</h3>
            <p className="mt-2 text-slate-500">
              Try clearing filters or searching a broader keyword.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}