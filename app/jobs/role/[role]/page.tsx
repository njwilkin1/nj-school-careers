import { jobs } from "../../../../data/jobs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  const roleName = role
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${roleName} Jobs in New Jersey | NJSchoolCareers`,
    description: `Browse ${roleName.toLowerCase()} jobs across New Jersey schools. Apply directly with no account required.`,
  };
}

type PageProps = {
  params: Promise<{
    role: string;
  }>;
};

function formatRoleName(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function RoleJobsPage({ params }: PageProps) {
  const { role } = await params;
  const roleSlug = role.toLowerCase();
  const roleName = formatRoleName(roleSlug);

const searchTerm = roleSlug.replace(/-/g, " ");

const filteredJobs = jobs.filter((job) => {
  const haystack = [
    job.title,
    job.district,
    job.location,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(searchTerm);
});

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight">
          {roleName} Jobs in New Jersey
        </h1>

        <p className="mt-3 max-w-2xl text-slate-600">
          Find current {roleName.toLowerCase()} jobs across New Jersey public
          and private schools. Apply directly with no account required.
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
                No {roleName.toLowerCase()} jobs available right now.
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