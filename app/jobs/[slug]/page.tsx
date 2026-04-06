import { jobs } from "../../../data/jobs";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;

const job = jobs.find((item) => item?.slug === slug);
  if (!job) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Job Details
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">{job.title}</h1>

        <p className="mt-3 text-lg text-slate-700">{job.district}</p>

        <p className="mt-1 text-sm text-slate-500">
          {job.location} · {job.type} · Posted {job.posted}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
<a
  href={job.applyUrl}
  target="_blank"
  rel="noreferrer"
  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
>
  Apply Now
</a>

          <a
            href="/jobs"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium hover:bg-slate-50"
          >
            Back to Jobs
          </a>
        </div>

        <div className="mt-10 space-y-6">
          <section>
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="mt-2 leading-7 text-slate-600">{job.overview}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Responsibilities</h2>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-slate-600">
              {job.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Requirements</h2>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-slate-600">
              {job.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
     import { jobs } from "../../../data/jobs";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;

const job = jobs.find((item) => item?.slug === slug);
  if (!job) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Job Details
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">{job.title}</h1>

        <p className="mt-3 text-lg text-slate-700">{job.district}</p>

        <p className="mt-1 text-sm text-slate-500">
          {job.location} · {job.type} · Posted {job.posted}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
<a
  href={job.applyUrl}
  target="_blank"
  rel="noreferrer"
  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
>
  Apply Now
</a>

          <a
            href="/jobs"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium hover:bg-slate-50"
          >
            Back to Jobs
          </a>
        </div>

        <div className="mt-10 space-y-6">
          <section>
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="mt-2 leading-7 text-slate-600">{job.overview}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Responsibilities</h2>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-slate-600">
              {job.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Requirements</h2>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-slate-600">
              {job.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
    </main>
  );
}