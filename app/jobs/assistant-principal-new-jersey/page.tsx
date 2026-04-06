import { jobs } from "../../../data/jobs";

export default function AssistantPrincipalPage() {
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes("assistant principal")
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight">
          Assistant Principal Jobs in New Jersey
        </h1>

        <p className="mt-4 text-slate-600">
          Browse current assistant principal opportunities across New Jersey schools.
          Apply directly with no account required.
        </p>

        <div className="mt-10 grid gap-5">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.slug}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-2xl font-semibold">{job.title}</h2>
                <p className="mt-2 text-slate-700">{job.district}</p>
                <p className="text-sm text-slate-500">
                  {job.location} · {job.type}
                </p>

                <div className="mt-4 flex gap-3">
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
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-slate-500">
                No assistant principal jobs available right now.
              </p>
            </div>
          )}
        </div>

        <div className="mt-10">
          <a
            href="/jobs"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm hover:bg-slate-50"
          >
            View All Jobs
          </a>
        </div>
      </div>
    </main>
  );
}