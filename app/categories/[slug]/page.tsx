import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { Metadata } from "next";
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
    title: `${name} Jobs | NJSchoolCareers`,
    description: `Browse ${name} jobs in New Jersey on NJSchoolCareers.`,
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
    .select("*");

  const filteredJobs =
    jobs?.filter((job) => {
      const title = (job.title || "").toLowerCase();
      return title.includes(category);
    }) || [];

  if (filteredJobs.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-slate-950">
          {formatTitle(slug)} Jobs in New Jersey
        </h1>

        <p className="mt-4 text-lg text-slate-700">
          Browse current {category} openings across New Jersey school districts.
        </p>

        <div className="mt-10 space-y-4">
          {filteredJobs.map((job) => (
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
          ))}
        </div>
      </div>
    </main>
  );
}