import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type Job = {
  slug: string;
  title: string;
  district: string;
  location: string;
  county?: string | null;
  type?: string | null;
  posted?: string | null;
  applyUrl: string;
  overview?: string | null;
  responsibilities?: string[] | string | null;
  requirements?: string[] | string | null;
};

function formatPostedDate(posted?: string | null) {
  if (!posted) return "";
  const date = new Date(posted);
  if (Number.isNaN(date.getTime())) return posted;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function toList(value?: string[] | string | null) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value)
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Job detail fetch error:", error);
    notFound();
  }

  if (!data) {
    console.error("No job found for slug:", slug);
    notFound();
  }

  const job = data as Job;
  const responsibilities = toList(job.responsibilities);
  const requirements = toList(job.requirements);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/jobs"
          className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-50"
        >
          ← Back to Jobs
        </Link>

        <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{job.title}</h1>
              <p className="mt-3 text-lg text-slate-700">{job.district}</p>
              <p className="mt-2 text-sm text-slate-500">
                {job.location}
                {job.type ? ` · ${job.type}` : ""}
                {job.county ? ` · ${job.county}` : ""}
              </p>
            </div>

            <a
              href={job.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Apply Now
            </a>
          </div>

          {job.posted && (
            <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Posted: {formatPostedDate(job.posted)}
            </div>
          )}

          {job.overview && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold">Overview</h2>
              <p className="mt-3 leading-7 text-slate-700">{job.overview}</p>
            </section>
          )}

          {responsibilities.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold">Responsibilities</h2>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
                {responsibilities.map((item, index) => (
                  <li key={`resp-${index}`}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {requirements.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold">Requirements</h2>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
                {requirements.map((item, index) => (
                  <li key={`req-${index}`}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-10 border-t border-slate-200 pt-6">
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Apply for This Job
            </a>
          </div>
        </article>
      </div>
    </main>
  );
}