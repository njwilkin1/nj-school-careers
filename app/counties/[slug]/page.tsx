import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function slugify(value: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const countyName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c: string) => c.toUpperCase());

  return {
    title: `${countyName} School Jobs | NJSchoolCareers`,
    description: `Browse school jobs in ${countyName} on NJSchoolCareers.`,
  };
}

export default async function CountyPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: importedJobs } = await supabase
    .from("job_imports")
    .select("*");

  const jobs =
    importedJobs?.filter(
      (job) => slugify(job.county || "") === slug
    ) || [];

  if (jobs.length === 0) {
    notFound();
  }

  const countyName = jobs[0].county;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-slate-950">
          {countyName} School Jobs
        </h1>

        <p className="mt-4 text-lg text-slate-700">
          Browse education jobs in {countyName} County, New Jersey.
        </p>

        <div className="mt-10 space-y-4">
          {jobs.map((job) => (
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
          ))}
        </div>
      </div>
    </main>
  );
}