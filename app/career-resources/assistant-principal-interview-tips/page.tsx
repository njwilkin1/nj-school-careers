import Link from "next/link";

export default function AssistantPrincipalInterviewTipsPage() {
  return (
    <main className="bg-slate-50 py-16">
      <div className="mx-auto max-w-3xl px-6">

        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12 text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
            Career Resources
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Assistant Principal Interview Tips
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-700">
            We’re currently updating this resource with practical interview
            advice, leadership preparation strategies, and insights for aspiring
            assistant principals and school leaders in New Jersey.
          </p>

          <p className="mt-6 text-lg leading-8 text-slate-700">
            Please check back soon for updated content.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

            <Link
              href="/career-resources"
              className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Back to Career Resources
            </Link>

            <Link
              href="/jobs"
              className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Browse NJ Education Jobs
            </Link>

          </div>

        </div>
      </div>
    </main>
  );
}