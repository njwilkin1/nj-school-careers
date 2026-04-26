export default function EmployersPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-gradient-to-r from-sky-50 via-blue-50 to-white px-6 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            For New Jersey Schools
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Post jobs and reach New Jersey educators faster.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-700">
            NJSchoolCareers helps schools, districts, and education employers
            promote openings to candidates actively searching for New Jersey
            school jobs.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/post-job"
              className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Post a Job
            </a>

            <a
              href="mailto:info@njschoolcareers.com"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:border-orange-500 hover:text-orange-600"
            >
              Request Info
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-orange-500">100+</div>
            <h2 className="mt-3 text-xl font-semibold">NJ jobs listed</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Build visibility with candidates already browsing education jobs
              across New Jersey.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-orange-500">Direct</div>
            <h2 className="mt-3 text-xl font-semibold">Candidate access</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Send candidates directly to your application link or hiring email
              without unnecessary barriers.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-orange-500">NJ</div>
            <h2 className="mt-3 text-xl font-semibold">Focused audience</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Reach job seekers looking specifically for New Jersey teaching,
              leadership, coaching, and support roles.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Posting Options
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Simple options for schools and districts.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl leading-8 text-slate-700">
            During launch, schools can post jobs at no cost while
            NJSchoolCareers grows its employer network and candidate reach.
            Visibility upgrades will be optional as paid plans are introduced.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950">
                Free Launch Posting
              </h3>

              <p className="mt-2 text-sm font-semibold text-orange-600">
                Limited launch access
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                Post a job during the launch period and reach New Jersey
                candidates searching for school opportunities.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                <li>✓ 30-day job listing</li>
                <li>✓ Direct application link or email</li>
                <li>✓ Included in job search results</li>
                <li>✓ No account required during launch</li>
              </ul>

              <a
                href="/post-job"
                className="mt-8 inline-block w-full rounded-xl bg-orange-500 px-5 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-orange-600"
              >
                Post a Job
              </a>
            </div>

            <div className="relative rounded-3xl border-2 border-orange-300 bg-orange-50 p-8 text-left shadow-md">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Coming Soon
              </div>

              <h3 className="text-2xl font-bold text-slate-950">
                Standard Visibility
              </h3>

              <p className="mt-2 text-sm font-semibold text-orange-700">
                For priority openings
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-700">
                Increase visibility for jobs that need more attention from
                active New Jersey education candidates.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                <li>✓ Everything in Free Launch Posting</li>
                <li>✓ Improved placement in job listings</li>
                <li>✓ Better visibility for hard-to-fill roles</li>
                <li>✓ Designed for schools that need faster reach</li>
              </ul>

              <a
                href="mailto:info@njschoolcareers.com"
                className="mt-8 inline-block w-full rounded-xl bg-slate-950 px-5 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Request Info
              </a>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950">
                Featured Job
              </h3>

              <p className="mt-2 text-sm font-semibold text-orange-600">
                Maximum exposure
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                Give important openings stronger visibility through homepage and
                featured placement options.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                <li>✓ Homepage visibility</li>
                <li>✓ Featured job placement</li>
                <li>✓ Highlighted listing design</li>
                <li>✓ Best for urgent or hard-to-fill roles</li>
              </ul>

              <a
                href="mailto:info@njschoolcareers.com"
                className="mt-8 inline-block w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-center font-semibold text-slate-900 transition hover:border-orange-500 hover:text-orange-600"
              >
                Contact Us
              </a>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-sm leading-7 text-slate-600">
            Schools will always be able to post jobs. Paid options will focus on
            visibility, placement, and employer reach.
          </p>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-orange-100 bg-orange-50 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Founding Partner Access
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Launch access is limited.
            </h2>

            <p className="mt-4 leading-8 text-slate-700">
              Select New Jersey schools and districts can post jobs at no cost
              while we continue building employer participation and candidate
              reach.
            </p>

            <p className="mt-4 leading-8 text-slate-700">
              This offer is intended for early partner schools and may change as
              paid visibility options are introduced.
            </p>

            <a
              href="/post-job"
              className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Submit a Job
            </a>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Why schools use us
            </p>

            <ul className="mt-6 space-y-5 text-slate-700">
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
                <span>Post jobs quickly without complicated setup.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
                <span>Reach candidates searching specifically in New Jersey.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
                <span>Support direct applications to your hiring process.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
                <span>Increase visibility beyond your district website.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-gradient-to-r from-blue-900 to-blue-700 p-8 text-white md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
                Ready to reach candidates?
              </p>
              <h2 className="mt-3 text-3xl font-bold">
                Start with a launch-period job posting.
              </h2>
              <p className="mt-4 max-w-2xl leading-8 text-blue-50">
                Submit your opening today or contact us to discuss employer
                options for your school or district.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <a
                href="/post-job"
                className="rounded-xl bg-orange-500 px-6 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-orange-600"
              >
                Post a Job
              </a>
              <a
                href="mailto:info@njschoolcareers.com"
                className="rounded-xl border border-white/30 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}