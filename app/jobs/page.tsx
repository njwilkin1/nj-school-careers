import { jobs } from "../../data/jobs";

type JobsPageProps = {
  searchParams: Promise<{
    search?: string;
    location?: string;
  }>;
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const search = params.search?.toLowerCase().trim() || "";
  const location = params.location?.toLowerCase().trim() || "";

  const filteredJobs = jobs.filter((job) => {
    const haystack = [
      job.title,
      job.district,
      job.location,
      job.type,
    ]
      .join(" ")
      .toLowerCase();

    const normalizedSearch = search
      .replace(/\bap\b/g, "assistant principal")
      .replace(/\bsub\b/g, "substitute")
      .trim();

    const searchWords = normalizedSearch.split(/\s+/).filter(Boolean);

    const matchesSearch =
      normalizedSearch === "" ||
      searchWords.every((word) => haystack.includes(word));

    const matchesLocation =
      location === "" || job.location.toLowerCase().includes(location);

    return matchesSearch && matchesLocation;
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold tracking-tight">Browse Jobs</h1>

        <p className="mt-4 text-slate-600">
          Explore school career opportunities across New Jersey.
        </p>

        <form
          action="/jobs"
          className="mt-8 grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1.2fr_1fr_auto]"
        >
          <input
            name="search"
            defaultValue={params.search || ""}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
            placeholder="Job title, district, or keyword"
          />

          <input
            name="location"
            defaultValue={params.location || ""}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
            placeholder="City or county"
          />

          <button
            type="submit"
            className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Search
          </button>
        </form>

        {(search || location) && (
          <p className="mt-4 text-sm text-slate-500">
            Showing results for{" "}
            <span className="font-medium text-slate-700">
              {params.search || "all jobs"}
            </span>
            {params.location && (
              <>
                {" "}in{" "}
                <span className="font-medium text-slate-700">
                  {params.location}
                </span>
              </>
            )}
          </p>
        )}

        <div className="mt-10 grid gap-5">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <article
                key={job.slug}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-2xl font-semibold">{job.title}</h2>
                <p className="mt-2 text-slate-700">{job.district}</p>
                <p className="text-sm text-slate-500">
                  {job.location} · {job.type}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={`/jobs/${job.slug}`}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
                  >
                    View Details
                  </a>

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
                No jobs matched your search. Try a different title, district, city, or county.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}