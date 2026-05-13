import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function slugify(value: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatDistrictName(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c: string) => c.toUpperCase());
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const name = formatDistrictName(slug);

  return {
    title: `${name} Jobs in New Jersey | NJSchoolCareers`,
    description: `Browse current school job openings with ${name}. Find teaching, administrative, and support staff jobs in New Jersey on NJSchoolCareers.`,
    alternates: {
      canonical: `https://www.njschoolcareers.com/districts/${slug}`,
    },
  };
}

export default async function DistrictPage({ params }: PageProps) {
  const { slug } = await params;

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: importedJobs, error } = await supabase
    .from("job_imports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) {
    console.error("Supabase district page error:", error);
  }

  const jobs =
    importedJobs?.filter((job) => slugify(job.district || "") === slug) || [];

  const districtName = jobs?.[0]?.district || formatDistrictName(slug);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-slate-950">
          {districtName} Jobs in New Jersey
        </h1>

        <p className="mt-4 text-lg text-slate-700">
          Explore current teaching jobs, administrative positions, support staff
          openings, and education careers with {districtName}. NJSchoolCareers
          helps educators connect with New Jersey school districts and find
          opportunities across K-12 education.
        </p>

        <div className="mt-10 space-y-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-orange-400"
              >
                <h2 className="text-xl font-semibold text-slate-950">
                  {job.title}
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  {job.location || districtName}
                </p>
              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-slate-950">
                No active jobs with {districtName} right now
              </h2>

              <p className="mt-2 text-slate-600">
                Check back soon. New school district jobs are added regularly
                across New Jersey.
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/categories/math-teacher"
            className="rounded-full bg-slate-100 px-4 py-2 text-sm hover:bg-orange-100"
          >
            Math Teacher Jobs
          </Link>

          <Link
            href="/categories/special-education"
            className="rounded-full bg-slate-100 px-4 py-2 text-sm hover:bg-orange-100"
          >
            Special Education Jobs
          </Link>

          <Link
            href="/categories/spanish-teacher"
            className="rounded-full bg-slate-100 px-4 py-2 text-sm hover:bg-orange-100"
          >
            Spanish Teacher Jobs
          </Link>

          <Link
            href="/categories/assistant-principal"
            className="rounded-full bg-slate-100 px-4 py-2 text-sm hover:bg-orange-100"
          >
            Assistant Principal Jobs
          </Link>
        </div>
      </div>
    </main>
  );
}