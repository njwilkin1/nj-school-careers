import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatTitle(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const name = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c: string) => c.toUpperCase());

  return {
    title: `${name} Jobs in New Jersey | NJSchoolCareers`,
    description: `Browse current ${name} jobs in New Jersey school districts on NJSchoolCareers.`,
    alternates: {
      canonical: `https://www.njschoolcareers.com/categories/${slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const category = formatTitle(slug).toLowerCase();

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: jobs } = await supabase
  .from("job_imports")
  .select("*")
  .ilike("title", `%${category}%`)
  .order("created_at", { ascending: false });

  const filteredJobs =
    jobs?.filter((job) => {
      const title = (job.title || "").toLowerCase();
      return title.includes(category);
    }) || [];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-slate-950">
          {formatTitle(slug)} Jobs in New Jersey
        </h1>

 <p className="mt-4 text-lg text-slate-700">
  Browse current {category} jobs in New Jersey, including openings with public
  school districts, charter schools, private schools, and education employers.
  NJSchoolCareers helps educators find teaching, administrative, support staff,
  and school leadership opportunities across the state.
</p>

        <div className="mt-10 space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-orange-400"
              >
                <h2 className="text-xl font-semibold text-slate-950">
                  {job.title}
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  {job.district}
                </p>
              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-slate-950">
                No active jobs right now
              </h2>

              <p className="mt-2 text-slate-600">
                Check back soon. New school jobs are added regularly across
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