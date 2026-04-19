import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type PageProps = {
  searchParams?: Promise<{
    search?: string;
    location?: string;
    county?: string;
    type?: string;
    postedWithin?: string;
    category?: string;
  }>;
};

type Job = {
  slug: string;
  title: string;
  district: string;
  location: string;
  county?: string;
  type?: string;
  posted?: string;
  applyUrl: string;
  overview?: string | null;
};

function getDaysAgo(posted: string) {
  const postedDate = new Date(posted);
  const now = new Date();

  if (Number.isNaN(postedDate.getTime())) return "";

  const diffMs = now.getTime() - postedDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Posted today";
  if (diffDays === 1) return "Posted 1 day ago";
  return `Posted ${diffDays} days ago`;
}

function getDaysOld(posted?: string) {
  if (!posted) return Number.MAX_SAFE_INTEGER;
  const postedDate = new Date(posted);
  const now = new Date();

  if (Number.isNaN(postedDate.getTime())) return Number.MAX_SAFE_INTEGER;

  const diffMs = now.getTime() - postedDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function isNewJob(posted?: string) {
  return getDaysOld(posted) <= 3;
}

function getCategoryFromTitle(title: string) {
  const value = title.toLowerCase();

  if (value.includes("substitute")) return "Substitute";

  if (
    value.includes("principal") ||
    value.includes("assistant principal") ||
    value.includes("vice principal") ||
    value.includes("supervisor") ||
    value.includes("director") ||
    value.includes("administrator")
  ) {
    return "Administrator";
  }

  if (
    value.includes("counselor") ||
    value.includes("social worker") ||
    value.includes("behaviorist") ||
    value.includes("nurse") ||
    value.includes("child study")
  ) {
    return "Special Services";
  }

  if (
    value.includes("secretary") ||
    value.includes("paraprofessional") ||
    value.includes("aide") ||
    value.includes("clerk")
  ) {
    return "Support Staff";
  }

  return "Teacher";
}

export default async function JobsPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};

  const rawSearch = params.search || "";
  const rawLocation = params.location || "";
  const rawCounty = params.county || "";
  const rawType = params.type || "";
  const rawPostedWithin = params.postedWithin || "";
  const rawCategory = params.category || "";

  const search = rawSearch.toLowerCase().trim();
  const location = rawLocation.toLowerCase().trim();
  const county = rawCounty.toLowerCase().trim();
  const type = rawType.toLowerCase().trim();
  const postedWithin = rawPostedWithin.trim();
  const category = rawCategory.trim();

  const normalizedSearch = search
    .replace(/\bap\b/g, "assistant principal")
    .replace(/\bsub\b/g, "substitute")
    .trim();

  const searchWords = normalizedSearch.split(/\s+/).filter(Boolean);

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("jobs")
    .select("slug, title, district, location, county, type, posted, applyUrl, overview")
    .order("posted", { ascending: false });

  if (error) {
    console.error("Jobs page fetch error:", error);
  }

  const jobs: Job[] = data ?? [];

  const filteredJobs = jobs.filter((job) => {
    const haystack = [
      job.title ?? "",
      job.district ?? "",
      job.location ?? "",
      job.type ?? "",
      job.county ?? "",
      job.overview ?? "",
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      normalizedSearch === "" ||
      searchWords.every((word) => haystack.includes(word));

    const matchesLocation =
      location === "" || (job.location ?? "").toLowerCase().includes(location);

    const matchesCounty =
      county === "" || (job.county ?? "").toLowerCase() === county;

    const matchesType =
      type === "" || (job.type ?? "").toLowerCase() === type;

    const jobCategory = getCategoryFromTitle(job.title ?? "");
    const matchesCategory =
      category === "" || jobCategory.toLowerCase() === category.toLowerCase();

    const daysOld = getDaysOld(job.posted);
    const matchesPostedWithin =
      postedWithin === "" ||
      (postedWithin === "3" && daysOld <= 3) ||
      (postedWithin === "7" && daysOld <= 7) ||
      (postedWithin === "30" && daysOld <= 30);

    return (
      matchesSearch &&
      matchesLocation &&
      matchesCounty &&
      matchesType &&
      matchesCategory &&
      matchesPostedWithin
    );
  });

  const countyOptions = [
    "Bergen County",
    "Hudson County",
    "Essex County",
    "Passaic County",
    "Union County",
    "Middlesex County",
    "Morris County",
    "Mercer County",
    "Ocean County",
    "Burlington County",
    "Atlantic County",
    "Other NJ",
  ];

  const typeOptions = [
    "Full Time",
    "Part Time",
    "Substitute",
    "Administrative",
  ];

  const categoryOptions = [
    "Teacher",
    "Administrator",
    "Support Staff",
    "Substitute",
    "Special Services",
  ];

  const quickLinks = [
    { label: "All Jobs", href: "/jobs" },
    { label: "Last 3 Days", href: "/jobs?postedWithin=3" },
    { label: "Last 7 Days", href: "/jobs?postedWithin=7" },
    { label: "Last 30 Days", href: "/jobs?postedWithin=30" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Browse Jobs</h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              Find NJ school jobs faster without confusing filters or extra steps.
            </p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            110+ jobs live
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {quickLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              {item.label}
            </a>
          ))}
        </div>

        <form
          action="/jobs"
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="grid gap-3 lg:grid-cols-3">
            <input
              name="search"
              defaultValue={rawSearch}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
              placeholder="Job title, district, or keyword"
            />

            <input
              name="location"
              defaultValue={rawLocation}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
              placeholder="City"
            />

            <select
              name="county"
              defaultValue={rawCounty}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
            >
              <option value="">All counties</option>
              {countyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-4">
            <select
              name="type"
              defaultValue={rawType}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
            >
              <option value="">All job types</option>
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              name="category"
              defaultValue={rawCategory}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
            >
              <option value="">All categories</option>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              name="postedWithin"
              defaultValue={rawPostedWithin}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
            >
              <option value="">Any posting date</option>
              <option value="3">Last 3 days</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
            </select>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Search
              </button>

              <a
                href="/jobs"
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium hover:bg-slate-50"
              >
                Reset
              </a>
            </div>
          </div>
        </form>

        {(search || location || county || type || postedWithin || category) && (
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500">
            <span>Showing filtered results</span>
            {rawSearch && (
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                Search: {rawSearch}
              </span>
            )}
            {rawLocation && (
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                City: {rawLocation}
              </span>
            )}
            {rawCounty && (
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                County: {rawCounty}
              </span>
            )}
            {rawType && (
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                Type: {rawType}
              </span>
            )}
            {rawCategory && (
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                Category: {rawCategory}
              </span>
            )}
            {rawPostedWithin && (
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                Posted within: last {rawPostedWithin} days
              </span>
            )}
          </div>
        )}

        <div className="mt-6 text-sm text-slate-500">
          {filteredJobs.length} job{filteredJobs.length === 1 ? "" : "s"} found
        </div>

        <div className="mt-8 grid gap-5">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => {
              const categoryLabel = getCategoryFromTitle(job.title ?? "");

              return (
                <article
                  key={job.slug}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {job.type && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                            {job.type}
                          </span>
                        )}

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                          {categoryLabel}
                        </span>

                        {isNewJob(job.posted) && (
                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                            New
                          </span>
                        )}
                      </div>

                      <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                        {job.title}
                      </h2>

                      <p className="mt-2 text-base font-medium text-slate-700">
                        {job.district}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {job.location}
                        {job.county ? ` · ${job.county}` : ""}
                      </p>

                      {job.overview && (
                        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                          {job.overview}
                        </p>
                      )}
                    </div>

                    <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                      {getDaysAgo(job.posted ?? "")}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                    >
                      View Details
                    </Link>

                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Apply Now
                    </a>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-slate-500">
                No jobs matched your search. Try a different title, category,
                county, posting date, or location.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}