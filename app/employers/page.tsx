import Link from "next/link";

export default function EmployersPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-b from-slate-50 to-white px-6 py-24 text-center">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-500">
            For New Jersey Schools
          </p>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Reach New Jersey educators faster.
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-600">
            NJSchoolCareers helps schools, districts, charter schools, private
            schools, and education organizations promote openings to candidates
            searching specifically for New Jersey education jobs.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/employers/pricing"
              className="rounded-xl bg-[#007c89] px-8 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-[#006b75]"
            >
              View Pricing
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
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-500">
            Employer Solutions
          </p>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">
            Choose the plan that fits your hiring needs.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Post a single job, promote urgent openings, or choose an unlimited
            plan for ongoing school-year recruitment.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950">
                One-Time Job Posts
              </h3>
              <p className="mt-5 leading-8 text-slate-600">
                Ideal for schools with occasional hiring needs or individual
                openings.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950">
                Visibility Add-Ons
              </h3>
              <p className="mt-5 leading-8 text-slate-600">
                Increase exposure for urgent, specialized, or hard-to-fill
                roles.
              </p>
            </div>

            <div className="rounded-3xl border border-orange-200 bg-orange-50 p-8 text-left shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950">
                Unlimited Plans
              </h3>
              <p className="mt-5 leading-8 text-slate-700">
                Best for districts and organizations with ongoing hiring needs
                throughout the year.
              </p>
            </div>
          </div>

          <Link
            href="/employers/pricing"
            className="mt-12 inline-flex rounded-xl bg-[#007c89] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#006b75]"
          >
            View Employer Pricing
          </Link>
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
              NJSchoolCareers gives schools and districts a simple way to
              advertise openings while directing candidates back to their own
              application process.
            </p>

            <Link
              href="/employers/pricing"
              className="mt-8 inline-flex rounded-xl bg-[#007c89] px-6 py-3 font-bold text-white transition hover:bg-[#006b75]"
            >
              View Pricing
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-500">
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
        <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-3xl bg-[#0f172a] p-10 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-300">
              Ready to reach candidates?
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight">
              Start reaching New Jersey educators today.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Review our pricing options or contact us to discuss job posting,
              visibility, and recruitment advertising options for your school or
              district.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="/employers/pricing"
              className="rounded-xl bg-[#007c89] px-8 py-4 text-center text-lg font-bold text-white transition hover:bg-[#006b75]"
            >
              View Pricing
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-slate-500 px-8 py-4 text-center text-lg font-bold text-white transition hover:bg-slate-800"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}