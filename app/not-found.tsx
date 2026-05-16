import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="text-7xl font-bold text-orange-500">404</div>

        <h1 className="mt-6 text-4xl font-bold text-slate-950">
          This page could not be found
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          The job posting or page you’re looking for may have expired, been
          removed, or moved to another location.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/jobs"
            className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            Browse All Jobs
          </Link>

          <Link
            href="/"
            className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-500 hover:text-orange-600"
          >
            Return Home
          </Link>
        </div>

        <div className="mt-14">
          <h2 className="text-2xl font-semibold text-slate-950">
            Popular Job Categories
          </h2>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/categories/spanish-teacher"

              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-orange-50"
            >
              Spanish Teacher Jobs
            </Link>

            <Link
              href="/categories/special-education"

              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-orange-50"
            >
              Special Education Jobs
            </Link>

            <Link
              href="/categories/math-teacher"

              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-orange-50"
            >
              Math Teacher Jobs
            </Link>

            <Link
              href="/categories/school-counselor"

              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-orange-50"
            >
              School Counselor Jobs
            </Link>

            <Link
              href="/categories/assistant-principal"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-orange-50"
            >
              Assistant Principal Jobs
            </Link>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-2xl font-semibold text-slate-950">
            Browse Jobs by County
          </h2>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/counties/bergen-county"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-orange-50"
            >
              Bergen County
            </Link>

            <Link
              href="/counties/essex-county"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-orange-50"
            >
              Essex County
            </Link>

            <Link
              href="/counties/hudson-county"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-orange-50"
            >
              Hudson County
            </Link>

            <Link
              href="/counties/middlesex-county"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-orange-50"
            >
              Middlesex County
            </Link>

            <Link
              href="/counties/camden-county"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-orange-50"
            >
              Camden County
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}