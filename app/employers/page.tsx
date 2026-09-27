import Link from "next/link";

export default function EmployersPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-b from-slate-50 to-white px-6 py-24 text-center">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-500">
            NEW JERSEY EDUCATION RECRUITING
          </p>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Put Your Openings in Front of New Jersey Education Job Seekers
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">
            NJSchoolCareers helps schools, districts, charter schools, private
            schools, and education organizations reach candidates searching for
            New Jersey jobs. Candidates can continue to the employer’s existing
            application system.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/post-job"
              className="rounded-xl bg-[#007c89] px-8 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-[#006b75]"
            >
              Post a Job
            </Link>

            <Link
              href="/employers/pricing"
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-lg font-bold text-slate-800 transition hover:bg-slate-100"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-4xl font-bold text-orange-500">108,000+</p>
            <h2 className="mt-5 text-2xl font-bold text-slate-950">
              Google Search Impressions
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              Google Search Console · past 3 months (approximately June 25–September 25, 2026).
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-4xl font-bold text-orange-500">4,930</p>
            <h2 className="mt-5 text-2xl font-bold text-slate-950">
              Google Search Clicks
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              Google Search Console · past 3 months (approximately June 25–September 25, 2026).
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#0f172a] px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-300">
            Organic discovery and paid promotion
          </p>
          <h2 className="mt-5 max-w-4xl text-3xl font-bold tracking-tight md:text-4xl">
            Your Jobs May Already Be Listed. Paid Promotion Helps Them Stand Out.
          </h2>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            NJSchoolCareers helps people discover education openings across New Jersey.
            Paid promotion gives employers additional visibility for priority, urgent,
            and hard-to-fill positions. Featured listings receive a visible featured
            label and sort ahead of standard listings; urgent listings are labeled and
            sorted first in job browsing. Candidates can continue to the employer’s
            existing application system.
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-500">
            Employer Solutions
          </p>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">
            Get More Visibility for the Positions You Need to Fill
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Promote one opening or support hiring throughout the school year with an
            option that fits your needs.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950">
                Standard Job Posting
              </h3>
              <p className="mt-5 leading-8 text-slate-600">
                Submit one employer-provided opening with its application URL for
                review. Imported listings come from configured feeds; this gives you
                a direct way to submit a role yourself. Standard posts are not marked
                featured or urgent.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950">
                Visibility Add-Ons
              </h3>
              <p className="mt-5 leading-8 text-slate-600">
                Featured Job Visibility adds a featured label and improved browse
                placement. Urgent Hiring Promotion marks urgent roles and moves them
                to the top of job browsing.
              </p>
            </div>

            <div className="rounded-3xl border border-orange-200 bg-orange-50 p-8 text-left shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950">
                Purchase Order Billing
              </h3>
              <p className="mt-5 leading-8 text-slate-700">
                Public school districts and education organizations can contact us
                about invoice or purchase order billing.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-6">

  <Link
    href="/employers/pricing"
    className="inline-flex rounded-xl bg-[#007c89] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#006b75]"
  >
    View Employer Pricing
  </Link>

  <div className="max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
      Looking to Promote Your Organization?
    </p>

    <p className="mt-3 text-lg leading-8 text-slate-700">
      NJSchoolCareers also offers advertising opportunities for universities,
      certification programs, education vendors, staffing agencies, summer
      camps, tutoring companies, and organizations serving New Jersey
      educators.
    </p>

    <Link
      href="/advertise"
      className="mt-5 inline-flex font-bold text-[#007c89] hover:underline"
    >
      Learn about Advertising Opportunities →
    </Link>

  </div>

</div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-orange-200 bg-orange-50 p-8">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-500">
              Employer Access
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">
              Reach Candidates Beyond Your District Website
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-700">
              Candidates search for education jobs in more than one place.
              NJSchoolCareers gives your openings additional exposure while directing
              candidates to your existing application process.
            </p>

            <ul className="mt-6 space-y-3 text-base leading-7 text-slate-700">
              <li>• Reach New Jersey education job seekers.</li>
              <li>• Give priority vacancies additional visibility.</li>
              <li>• Extend exposure beyond your district website.</li>
              <li>• Link candidates to your existing application system.</li>
            </ul>

            <Link
              href="/employers/pricing"
              className="mt-8 inline-flex rounded-xl bg-[#007c89] px-6 py-3 font-bold text-white transition hover:bg-[#006b75]"
            >
              View Pricing
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-500">
              Keep Your Application Process
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-700">
              Include the application URL your school already uses. When candidates
              choose to continue, they are sent to that destination to complete the
              employer’s application process.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl rounded-3xl bg-[#0f172a] p-8 text-white md:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-300">
              New Jersey education recruiting
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight">
              Need More Candidates for an Open Position?
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Promote your opening to people searching for New Jersey education
              opportunities.
            </p>
          </div>

          <div className="mt-8 grid w-full max-w-2xl gap-4 sm:grid-cols-2">
            <Link
              href="/post-job"
              className="flex min-h-16 items-center justify-center rounded-xl bg-[#007c89] px-6 py-4 text-center text-lg font-bold text-white transition hover:bg-[#006b75]"
            >
              Post a Job
            </Link>

            <Link
              href="/employers/pricing"
              className="flex min-h-16 items-center justify-center rounded-xl border border-slate-500 px-6 py-4 text-center text-lg font-bold text-white transition hover:bg-slate-800"
            >
              View Employer Pricing
            </Link>
          </div>

          <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-300">
            Already use Frontline/AppliTrack or another hiring system? Candidates can
            be directed to your existing application.
          </p>
        </div>
      </section>
    </main>
  );
}