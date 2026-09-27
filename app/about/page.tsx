import Link from "next/link";

export const metadata = {
  title: "About NJSchoolCareers | New Jersey Education Jobs",
  description:
    "Learn how NJSchoolCareers helps New Jersey educators find jobs and helps education employers promote openings.",
};

export default function AboutPage() {
  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-gradient-to-r from-sky-50 via-blue-50 to-white">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            About NJSchoolCareers
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            New Jersey education opportunities, all in one place
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
            Find school-related jobs across New Jersey without creating an
            account or uploading a resume. When you find a role, apply directly
            with the employer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/jobs"
              className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Browse Jobs
            </Link>
            <Link
              href="/employers/pricing"
              className="rounded-xl border border-blue-700 bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-14 px-6 py-14 md:py-20">
        <section aria-labelledby="why-heading">
          <h2 id="why-heading" className="text-3xl font-bold tracking-tight">
            Why NJSchoolCareers?
          </h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold">Focused on New Jersey</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Explore teaching, administration, coaching, student support,
                operations, and other education roles across the state.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold">Easy to apply</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Search without an account or resume. Applications go to the
                employer&apos;s application page or contact information.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold">Visibility for employers</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Schools and education organizations can submit jobs and choose
                paid options to feature or promote priority openings.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="story-heading" className="rounded-3xl bg-white p-8 shadow-sm md:p-10">
          <h2 id="story-heading" className="text-3xl font-bold tracking-tight">
            Built from experience
          </h2>
          <p className="mt-5 leading-8 text-slate-700">
            NJSchoolCareers was created by a New Jersey educator with firsthand
            experience navigating education careers and school hiring. The goal
            is simple: make openings easier for candidates to discover and help
            employers reach people interested in working in New Jersey education.
          </p>
        </section>

        <section aria-labelledby="listings-heading">
          <h2 id="listings-heading" className="text-2xl font-bold tracking-tight">
            How job listings work
          </h2>
          <p className="mt-4 leading-8 text-slate-700">
            Listings may be submitted directly by schools, districts, and
            education organizations or obtained from publicly available employer
            career pages and applicant tracking systems. New opportunities are
            added and updated daily. Applicants complete the application process
            with the employer.
          </p>
          <p className="mt-4 leading-8 text-slate-700">
            Schools and employers retain full control over their job
            requirements, applications, interviews, hiring decisions, and
            employment processes. NJSchoolCareers.com does not participate in
            hiring decisions or act as a staffing agency, recruiter, or hiring
            representative.
          </p>
        </section>

        <section aria-labelledby="independence-heading" className="border-t border-slate-200 pt-10">
          <h2 id="independence-heading" className="text-2xl font-bold tracking-tight">
            Independent platform
          </h2>
          <p className="mt-4 leading-8 text-slate-700">
            Unless expressly stated, the appearance of a school, district,
            employer, job listing, name, or logo on NJSchoolCareers.com does not
            indicate sponsorship, endorsement, affiliation, authorization, or a
            formal partnership with NJSchoolCareers.com.
          </p>
          <p className="mt-4 leading-8 text-slate-700">
            Employers and authorized representatives may request a correction,
            update, or removal of a listing by contacting{" "}
            <a
              href="mailto:info@njschoolcareers.com"
              className="font-semibold text-blue-700 underline"
            >
              info@njschoolcareers.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
