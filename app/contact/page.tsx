export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
          Contact
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
          Contact NJSchoolCareers
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-700">
          Have a question about posting a job, reaching New Jersey educators,
          or promoting your school district’s openings? We’d be happy to help.
        </p>

        <p className="mt-4 text-lg leading-8 text-slate-700">
          NJSchoolCareers helps connect New Jersey schools with educators
          through a growing platform featuring 2,000+ New Jersey education jobs
          across teaching, administration, coaching, and support staff roles.
        </p>

        <p className="mt-4 text-lg leading-8 text-slate-700">
          Built by a New Jersey educator with firsthand experience in school
          hiring and recruitment, NJSchoolCareers is designed to be simple,
          direct, and focused exclusively on New Jersey education jobs.
        </p>

        <div className="mt-8 rounded-2xl border border-orange-100 bg-orange-50 p-6">
          <h2 className="text-2xl font-semibold text-slate-950">
            For schools, districts, and employers
          </h2>

          <p className="mt-3 leading-8 text-slate-700">
            Contact us to learn more about job postings, featured listings,
            school-year plans, monthly options, and employer visibility
            services. Flexible posting and recruitment advertising options are
            available.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/employers/pricing"
              className="inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              View Employer Pricing
            </a>

            <a
              href="mailto:info@njschoolcareers.com"
              className="inline-block rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100"
            >
              Email Us
            </a>
          </div>

          <p className="mt-4 text-sm font-medium text-slate-700">
            info@njschoolcareers.com
          </p>

          <p className="mt-4 text-sm leading-6 text-slate-600">
            Email is the best way to reach us. School districts and employers
            may also leave a voicemail or text message at{" "}
            <a
              href="tel:+12017465250"
              className="font-semibold text-slate-800 hover:text-orange-600"
            >
              (201) 746-5250
            </a>
            . We typically respond within 1 business day.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-950">Post a Job</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Share openings with candidates actively searching for New Jersey
              education jobs.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-950">
              Increase Visibility
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Reach more job seekers beyond your district website or hiring
              system.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-950">Ask a Question</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Need help submitting a job or learning how the site works?
              Reach out anytime.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-semibold text-slate-950">
            Common employer uses
          </h2>

          <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-700 md:grid-cols-2">
            <li>• Teaching positions</li>
            <li>• Administrative openings</li>
            <li>• Coaching opportunities</li>
            <li>• Support staff hiring</li>
            <li>• Long-term substitute roles</li>
            <li>• Hard-to-fill education positions</li>
          </ul>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6">
          <h2 className="text-xl font-semibold text-slate-950">
            For job seekers
          </h2>

          <p className="mt-3 leading-8 text-slate-700">
            If you have a question about a listing, please contact the school
            or employer listed in the job post directly. For website questions,
            you may email us at{" "}
            <a
              href="mailto:info@njschoolcareers.com"
              className="font-medium text-orange-600 hover:text-orange-700"
            >
              info@njschoolcareers.com
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}