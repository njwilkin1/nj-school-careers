import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatCountyName(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c: string) => c.toUpperCase());
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const countyName = formatCountyName(slug);

  return {
    title: `${countyName} County School Jobs in New Jersey | NJSchoolCareers`,
    description: `Browse teaching, administrative, and education jobs in ${countyName} County, New Jersey on NJSchoolCareers.`,
    alternates: {
      canonical: `https://www.njschoolcareers.com/counties/${slug}`,
    },
  };
}

export default async function CountyPage({ params }: PageProps) {
  const { slug } = await params;

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const searchCountyName = slug.replace(/-/g, " ");

  const { data: jobs } = await supabase
    .from("job_imports")
    .select("*")
    .ilike("county", `%${searchCountyName}%`)
    .order("created_at", { ascending: false });

  const countyName = jobs?.[0]?.county || formatCountyName(slug);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-slate-950">
          {countyName} County School Jobs
        </h1>

        <p className="mt-4 text-lg text-slate-700">
          Explore teaching jobs, administrative positions, support staff openings,
          and school leadership opportunities in {countyName} County, New Jersey.
          NJSchoolCareers connects educators with public school districts, charter
          schools, and private school employers throughout the county.
        </p>

        <div className="mt-10 space-y-4">
          {jobs && jobs.length > 0 ? (
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
                  {job.district || "New Jersey School District"}
                </p>
              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-slate-950">
                No active school jobs in {countyName} County right now
              </h2>

              <p className="mt-2 text-slate-600">
                Check back soon. New education jobs are added regularly across
                New Jersey.
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