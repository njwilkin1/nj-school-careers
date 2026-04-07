import { jobs } from "../../../data/jobs";

export const metadata = {
  title: "Teaching Jobs in New Jersey | NJ School Careers",
  description:
    "Explore teaching jobs in New Jersey, including elementary, middle school, and high school opportunities across districts and counties statewide.",
};

export default function TeachingJobsNewJerseyPage() {
  const filteredJobs = jobs.filter(
    (job): job is NonNullable<(typeof jobs)[number]> => {
      if (!job) return false;

      const haystack = [
        job.title ?? "",
        job.district ?? "",
        job.location ?? "",
        job.type ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return (
        haystack.includes("teacher") ||
        haystack.includes("teaching") ||
        haystack.includes("elementary") ||
        haystack.includes("middle school") ||
        haystack.includes("high school")
      );
    }
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          New Jersey Education Careers
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Teaching Jobs in New Jersey
        </h1>

        <p className="mt-4 text-lg leading-8 text-slate-600">
          Explore teaching jobs in New Jersey across elementary, middle school,
          and high school settings. NJ School Careers helps job seekers find
          education opportunities in districts throughout the state, including
          Bergen County, Essex County, Hudson County, Passaic County, Union
          County, and Middlesex County.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Whether you are looking for your first classroom role, a district
          change, or a new teaching opportunity closer to home, this page brings
          together current school job listings in one place. Check back often as
          new teaching jobs in New Jersey are added regularly.
        </p>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Why use NJ School Careers?</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-600">
            <li>Focused specifically on New Jersey school jobs</li>
            <li>Easy-to-browse teaching opportunities by role and location</li>
            <li>Direct application links when available</li>
            <li>Helpful pages for counties and targeted education roles</li>
          </ul>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Popular teaching job searches in New Jersey
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/jobs/assistant-principal-new-jersey"
              className="rounded-full bg-slate-100 px-4 py-2 text-sm hover:bg-slate-200"
            >
              Assistant Principal Jobs
            </a>
            <a
              href="/jobs/spanish-teacher-new-jersey"
              className="rounded-full bg-slate-100 px-4 py-2 text-sm hover:bg-slate-200"
            >
              Spanish Teacher Jobs
            </a>
            <a
              href="/jobs/county/bergen"
              className="rounded-full bg-slate-100 px-4 py-2 text-sm hover:bg-slate-200"
            >
              Bergen County Jobs
            </a>
            <a
              href="/jobs/county/essex"
              className="rounded-full bg-slate-100 px-4 py-2 text-sm hover:bg-slate-200"
            >
              Essex County Jobs
            </a>
            <a
              href="/jobs/county/hudson"
              className="rounded-full bg-slate-100 px-4 py-2 text-sm hover:bg-slate-200"
            >
              Hudson County Jobs
            </a>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-3xl font-bold tracking-tight">
            Current Teaching Openings
          </h2>
          <p className="mt-3 text-slate-600">
            Browse current teaching job listings in New Jersey below.
          </p>
        </div>

        <div className="mt-8 grid gap-5">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <article
                key={job.slug}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-2xl font-semibold">{job.title}</h3>
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
                No teaching jobs are available right now. Please check back
                again soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}