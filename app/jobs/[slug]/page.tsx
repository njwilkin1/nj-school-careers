import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type Job = {
  id: number;
  title: string;
  district: string;
  location?: string | null;
  county?: string | null;
  type?: string | null;
  posted?: string | null;
  applyUrl: string;
  overview?: string | null;
  position_type?: string | null;
  date_posted?: string | null;
  closing_date?: string | null;
  additional_information?: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const jobId = Number(slug);

  if (!slug || Number.isNaN(jobId)) {
    notFound();
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("job_imports")
    .select("*")
    .eq("id", jobId)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    console.error("Job detail fetch error:", error, "id:", jobId);
    notFound();
  }

  const job = data as Job;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/jobs"
          className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm transition hover:border-orange-500 hover:text-orange-600"
        >
          ← Back to Jobs
        </Link>

        <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-950">
                {job.title}
              </h1>

              <p className="mt-3 text-lg font-medium text-slate-700">
                {job.district}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {job.location || job.district}
                {job.county ? ` · ${job.county}` : ""}
              </p>
            </div>

            <a
              href={job.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Apply Now
            </a>
          </div>

          <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700 md:grid-cols-2">
            {job.position_type && (
              <p>
                <span className="font-semibold text-slate-950">
                  Position Type:
                </span>{" "}
                {job.position_type}
              </p>
            )}

            {job.date_posted && (
              <p>
                <span className="font-semibold text-slate-950">
                  Date Posted:
                </span>{" "}
                {formatDate(job.date_posted)}
              </p>
            )}

            {job.location && (
              <p>
                <span className="font-semibold text-slate-950">Location:</span>{" "}
                {job.location}
              </p>
            )}

            {job.closing_date && (
              <p>
                <span className="font-semibold text-slate-950">
                  Closing Date:
                </span>{" "}
                {job.closing_date}
              </p>
            )}
          </div>

          {job.overview && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-slate-950">
                Overview
              </h2>
              <p className="mt-3 leading-7 text-slate-700">{job.overview}</p>
            </section>
          )}

          {job.additional_information && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-slate-950">
                Job Details
              </h2>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-700 whitespace-pre-line">
                {job.additional_information}
              </div>
            </section>
          )}

          <div className="mt-10 border-t border-slate-200 pt-6">
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Apply for This Job
            </a>
          </div>
        </article>
      </div>
    </main>
  );
}