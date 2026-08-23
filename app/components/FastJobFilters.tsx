"use client";

import ApplyButton from "@/app/jobs/[slug]/ApplyButton";
import EmailSignup from "@/app/components/EmailSignup";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const JOBS_PER_PAGE = 15;

type Job = {
  id: string;
  slug: string;
  title: string;
  district: string;
  location: string;
  county: string;
  type: string;
  category: string;
  posted: string;
  applyUrl: string;
  is_featured: boolean;
  is_urgent: boolean;
};

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
  if (!posted) return false;

  const postedDate = new Date(posted);
  if (Number.isNaN(postedDate.getTime())) return false;

  const diff = Math.floor(
    (Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return diff >= 0 && diff <= 3;
}

export default function FastJobFilters() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [county, setCounty] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search.trim());
      if (county) params.set("county", county);
      if (category) params.set("category", category);
      if (type) params.set("type", type);
      if (dateFilter) params.set("date", dateFilter);

      params.set("page", String(currentPage));

      try {
        const res = await fetch(`/api/jobs-browse?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Unable to load jobs.");
        }

        const data = await res.json();

        setJobs(data.jobs || []);
        setTotal(data.total || 0);
        setTotalPages(Math.max(1, data.totalPages || 1));
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.error(err);
          setError("Jobs could not be loaded. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, search ? 300 : 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, county, category, type, dateFilter, currentPage]);

  function clearFilters() {
    setSearch("");
    setCounty("");
    setCategory("");
    setType("");
    setDateFilter("");
    setCurrentPage(1);
  }

  async function logSearchQuery(value: string) {
    const cleaned = value.trim().toLowerCase();

    if (cleaned.length < 2) return;

    try {
      await fetch("/api/log-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: cleaned }),
      });
    } catch (error) {
      console.error("Failed to log search query:", error);
    }
  }

  async function handleShare(job: Job) {
    const jobUrl = `https://www.njschoolcareers.com/jobs/${job.slug || job.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `${job.title} at ${job.district}`,
          url: jobUrl,
        });
      } catch {
        // User cancelled.
      }
    } else {
      await navigator.clipboard.writeText(jobUrl);
      alert("Job link copied!");
    }
  }

  const startNumber = total === 0 ? 0 : (currentPage - 1) * JOBS_PER_PAGE + 1;
  const endNumber = Math.min(currentPage * JOBS_PER_PAGE, total);

  return (
    <div className="mt-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto]">
          <input
            placeholder="Search title, district, or keyword"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            onBlur={() => logSearchQuery(search)}
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
            {[
              "Atlantic", "Bergen", "Burlington", "Camden", "Cape May",
              "Cumberland", "Essex", "Gloucester", "Hudson", "Hunterdon",
              "Mercer", "Middlesex", "Monmouth", "Morris", "Ocean",
              "Passaic", "Salem", "Somerset", "Sussex", "Union", "Warren"
            ].map((item) => (
              <option key={item} value={item}>{item}</option>
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

          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-orange-500 focus:outline-none"
          >
            <option value="">Any date</option>
            <option value="7">Posted in Last 7 Days</option>
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
          {loading ? (
            "Loading jobs..."
          ) : (
            <>
              Showing{" "}
              <span className="font-semibold text-slate-900">{jobs.length}</span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">{total}</span>{" "}
              matching jobs
            </>
          )}
        </p>
      </section>

      <div className="mt-8 space-y-4">
        {error && (
          <div className="rounded-3xl border border-red-200 bg-white p-8 text-center text-red-700">
            {error}
          </div>
        )}

        {loading && jobs.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">Loading available jobs...</p>
          </div>
        )}

        {!loading &&
          jobs.map((job, index) => {
            const postedLabel = daysAgo(job.posted);

            return (
              <div key={`${job.id}-${index}`}>
                <article
                  className={`rounded-3xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
                    job.is_featured
                      ? "border-2 border-teal-300"
                      : job.is_urgent
                        ? "border-2 border-red-200"
                        : "border-slate-200 hover:border-orange-200"
                  }`}
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap gap-2">
                        {job.is_urgent && (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-700">
                            Urgent Hiring
                          </span>
                        )}

                        {job.is_featured && (
                          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
                            Featured Placement
                          </span>
                        )}

                        {job.type && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                            {job.type}
                          </span>
                        )}

                        {job.category && (
                          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-600">
                            {job.category}
                          </span>
                        )}

                        {postedLabel === "Posted today" ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Posted Today
                          </span>
                        ) : (
                          isNew(job.posted) && (
                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-600">
                              New
                            </span>
                          )
                        )}
                      </div>

                      <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                        {job.title}
                      </h2>

                      <p className="mt-2 text-base font-medium text-slate-700">
                        {job.district}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {job.location}
                        {job.county ? ` · ${job.county}` : ""}
                      </p>
                    </div>

                    <div className="text-sm text-gray-500 md:text-right">
                      {postedLabel}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/jobs/${job.slug || job.id}`}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-500 hover:text-orange-600"
                    >
                      View Details
                    </Link>

                    <ApplyButton
                      href={job.applyUrl}
                      district={job.district}
                      county={job.county}
                      jobTitle={job.title}
                      label="Apply Now"
                      className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                    />

                    <button
                      type="button"
                      onClick={() => handleShare(job)}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
                    >
                      Share
                    </button>
                  </div>
                </article>

                {index === 14 && (
                  <div className="my-8">
                    <EmailSignup searchTerm={search} />
                  </div>
                )}
              </div>
            );
          })}

        {!loading && total > 0 && (
          <div className="mt-8 text-center text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">{startNumber}</span>
            {" – "}
            <span className="font-semibold text-slate-900">{endNumber}</span>{" "}
            of <span className="font-semibold text-slate-900">{total}</span>{" "}
            jobs
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-xl border border-slate-400 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:bg-slate-100 disabled:opacity-40"
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
                      : "border border-slate-400 bg-white text-slate-700 hover:border-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              className="rounded-xl border border-slate-400 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:bg-slate-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

        {!loading && !error && total === 0 && (
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
