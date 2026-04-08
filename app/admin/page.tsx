import Link from "next/link";
import { jobs } from "../../data/jobs";

type PageProps = {
  searchParams?: Promise<{
    search?: string;
    location?: string;
    county?: string;
    type?: string;
  }>;
};

function getCountyFromLocation(location: string) {
  const value = location.toLowerCase();

  if (
    value.includes("fair lawn") ||
    value.includes("hackensack") ||
    value.includes("paramus") ||
    value.includes("ridgewood") ||
    value.includes("bergenfield") ||
    value.includes("fort lee") ||
    value.includes("englewood") ||
    value.includes("glen rock") ||
    value.includes("old tappan") ||
    value.includes("westwood") ||
    value.includes("township of washington") ||
    value.includes("bergen")
  ) {
    return "Bergen County";
  }

  if (
    value.includes("union city") ||
    value.includes("jersey city") ||
    value.includes("hoboken") ||
    value.includes("guttenberg") ||
    value.includes("weehawken") ||
    value.includes("north bergen") ||
    value.includes("bayonne") ||
    value.includes("hudson")
  ) {
    return "Hudson County";
  }

  if (
    value.includes("newark") ||
    value.includes("east orange") ||
    value.includes("orange") ||
    value.includes("bloomfield") ||
    value.includes("montclair") ||
    value.includes("livingston") ||
    value.includes("verona") ||
    value.includes("glen ridge") ||
    value.includes("essex")
  ) {
    return "Essex County";
  }

  if (
    value.includes("paterson") ||
    value.includes("clifton") ||
    value.includes("passaic") ||
    value.includes("wayne") ||
    value.includes("totowa") ||
    value.includes("woodland park") ||
    value.includes("prospect park") ||
    value.includes("passaic county")
  ) {
    return "Passaic County";
  }

  if (
    value.includes("hillside") ||
    value.includes("elizabeth") ||
    value.includes("union") ||
    value.includes("plainfield") ||
    value.includes("cranford") ||
    value.includes("westfield") ||
    value.includes("union county")
  ) {
    return "Union County";
  }

  return "Other NJ";
}

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

export default async function JobsPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};

  const rawSearch = params.search || "";
  const rawLocation = params.location || "";
  const rawCounty = params.county || "";
  const rawType = params.type || "";

  const search = rawSearch.toLowerCase().trim();
  const location = rawLocation.toLowerCase().trim();
  const county = rawCounty.toLowerCase().trim();
  const type = rawType.toLowerCase().trim();

  const normalizedSearch = search
    .replace(/\bap\b/g, "assistant principal")
    .replace(/\bsub\b/g, "substitute")
    .trim();

  const searchWords = normalizedSearch.split(/\s+/).filter(Boolean);

  const jobsWithCounty = jobs
    .filter(Boolean)
    .map((job) => ({
      ...job,
      county: getCountyFromLocation(job.location ?? ""),
    }));

  const filteredJobs = jobsWithCounty
    .filter((job) => {
      const haystack = [
        job.title ?? "",
        job.district ?? "",
        job.location ?? "",
        job.type ?? "",
        job.county ?? "",
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

      return matchesSearch && matchesLocation && matchesCounty && matchesType;
    })
    .sort((a, b) => {
      const dateA = new Date(a.posted ?? "").getTime();
      const dateB = new Date(b.posted ?? "").getTime();
      return dateB - dateA;
    });

  const countyOptions = [
    "Bergen County",
    "Hudson County",
    "Essex County",
    "Passaic County",
    "Union County",
    "Other NJ",
  ];

  const typeOptions = [
    "Full Time",
    "Part Time",
    "Substitute",
    "Administrative",
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold tracking-tight">Browse Jobs</h1>

        <p className="mt-4 text-slate-600">
          Explore school career opportunities across New Jersey.
        </p>

        <form
          action="/jobs"
          className="mt-8 grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr_1fr_auto]"
        >
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

          <button
            type="submit"
            className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Search
          </button>
        </form>

        {(search || location || county || type) && (
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
          </div>
        )}

        <div className="mt-6 text-sm text-slate-500">
          {filteredJobs.length} job{filteredJobs.length === 1 ? "" : "s"} found
        </div>

        <div className="mt-8 grid gap-5">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <article
                key={job.slug}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{job.title}</h2>
                    <p className="mt-2 text-slate-700">{job.district}</p>
                    <p className="text-sm text-slate-500">
                      {job.location} · {job.type} · {job.county}
                    </p>
                  </div>

                  <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                    {getDaysAgo(job.posted ?? "")}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
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
            ))
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-slate-500">
                No jobs matched your search. Try a different title, district,
                city, county, or job type.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}