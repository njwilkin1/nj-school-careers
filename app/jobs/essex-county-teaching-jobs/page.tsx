import { jobs } from "../../../data/jobs";

export default function EssexCountyTeachingJobsPage() {
  const filteredJobs = jobs.filter(
    (job): job is NonNullable<(typeof jobs)[number]> =>
      !!job?.location?.toLowerCase().includes("essex")
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight">
          Essex County Teaching Jobs
        </h1>

        <p className="mt-4 text-slate-600">
          Explore current school job opportunities in Essex County.
        </p>

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
                No Essex County jobs are available right now.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}