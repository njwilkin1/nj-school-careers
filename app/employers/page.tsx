import Link from "next/link";

export default function EmployersPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-b from-blue-50 to-white px-6 py-24 text-center">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-500">
            For New Jersey Schools
          </p>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Post jobs and reach New Jersey educators faster.
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">
            NJSchoolCareers helps New Jersey schools, districts, and education
            organizations connect with teachers, administrators, support staff,
            and school professionals through a platform built specifically for
            NJ education hiring.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/post-job"
              className="rounded-xl bg-orange-500 px-8 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-orange-600"
            >
              Post a Job
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-lg font-bold text-slate-800 transition hover:bg-slate-100"
            >
              Request Info
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-4xl font-bold text-orange-500">3,400+</p>
            <h2 className="mt-5 text-2xl font-bold text-slate-950">
              Search impressions
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              NJSchoolCareers is gaining visibility in Google search for New
              Jersey education hiring terms.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-4xl font-bold text-orange-500">1,800+</p>
            <h2 className="mt-5 text-2xl font-bold text-slate-950">
              Recent site sessions
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              Educators and job seekers are actively visiting the platform to
              search for school opportunities.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-4xl font-bold text-orange-500">NJ</p>
            <h2 className="mt-5 text-2xl font-bold text-slate-950">
              Focused audience
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              Reach candidates looking specifically for New Jersey teaching,
              leadership, coaching, and school support roles.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-blue-600">
            Posting Options
          </p>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">
            Simple options for schools and districts.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Start with a standard job post or increase visibility for important,
            urgent, or hard-to-fill roles.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm">
              <h3 className="text-3xl font-bold text-slate-950">
                Standard Job Posting
              </h3>

              <p className="mt-3 font-semibold text-orange-500">
                Available during early partner access
              </p>

              <p className="mt-6 leading-8 text-slate-600">
                Post a school opening and reach candidates searching for New
                Jersey education jobs.
              </p>

              <ul className="mt-8 space-y-4 text-slate-700">
                <li>✓ Included in job search results</li>
                <li>✓ Direct application link or email</li>
                <li>✓ No complicated setup</li>
                <li>✓ Built for New Jersey education hiring</li>
              </ul>

              <Link
                href="/post-job"
                className="mt-10 inline-flex w-full justify-center rounded-xl bg-orange-500 px-6 py-4 text-lg font-bold text-white transition hover:bg-orange-600"
              >
                Post a Job
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm">
              <h3 className="text-3xl font-bold text-slate-950">
                Featured Job Visibility
              </h3>

              <p className="mt-3 font-semibold text-orange-500">
                For high-priority openings
              </p>

              <p className="mt-6 leading-8 text-slate-600">
                Give important openings stronger visibility through featured
                placement and additional promotion options.
              </p>

              <ul className="mt-8 space-y-4 text-slate-700">
                <li>✓ Homepage visibility options</li>
                <li>✓ Highlighted job placement</li>
                <li>✓ Stronger visibility for urgent roles</li>
                <li>✓ Social promotion options available</li>
              </ul>

              <Link
                href="/contact"
                className="mt-10 inline-flex w-full justify-center rounded-xl border border-slate-300 px-6 py-4 text-lg font-bold text-slate-800 transition hover:bg-slate-100"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-3xl leading-8 text-slate-600">
            Featured options are designed for schools that want additional
            visibility for urgent, specialized, or hard-to-fill positions.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-orange-200 bg-orange-50 p-8">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-500">
              Employer Access
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">
              Reach candidates beyond your district website.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-700">
              Many candidates search across multiple sources when looking for
              education jobs. Posting on NJSchoolCareers helps increase
              visibility with educators actively searching for New Jersey school
              opportunities.
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-700">
              NJSchoolCareers supports schools and districts that want to
              advertise openings with a wider audience while keeping the process
              simple and direct.
            </p>

            <Link
              href="/post-job"
              className="mt-8 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Submit a Job
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-blue-600">
              Why Schools Use Us
            </p>

            <ul className="mt-8 space-y-6 text-lg leading-8 text-slate-700">
              <li>● Post jobs quickly without complicated setup.</li>
              <li>● Reach candidates searching specifically in New Jersey.</li>
              <li>● Support direct applications to your hiring process.</li>
              <li>● Increase visibility beyond your district website.</li>
              <li>● Connect with educators, administrators, and support staff.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-3xl bg-blue-700 p-10 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-blue-100">
              Ready to reach candidates?
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight">
              Start reaching New Jersey educators today.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">
              Submit your opening today or contact us to discuss visibility
              options for your school, district, or education organization.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="/post-job"
              className="rounded-xl bg-orange-500 px-8 py-4 text-center text-lg font-bold text-white transition hover:bg-orange-600"
            >
              Post a Job
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-blue-300 px-8 py-4 text-center text-lg font-bold text-white transition hover:bg-blue-600"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}