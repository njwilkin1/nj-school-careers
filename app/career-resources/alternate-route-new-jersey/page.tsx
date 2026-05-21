import Link from "next/link";

export default function AlternateRouteNewJerseyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Career Resources
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            Alternate Route Teaching in New Jersey
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            The alternate route pathway allows eligible candidates to begin a
            teaching career in New Jersey without completing a traditional
            teacher preparation program first. It can be an important option for
            career changers and professionals entering education.
          </p>

          <div className="mt-12 space-y-10 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Understand the Basic Pathway
              </h2>

              <p className="mt-4 leading-8">
                Alternate route candidates typically begin by meeting
                certification requirements, obtaining a Certificate of
                Eligibility, securing employment, and completing required
                training while working toward standard certification.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Check Certification Requirements
              </h2>

              <p className="mt-4 leading-8">
                Requirements can vary by subject area, grade level, degree
                background, testing, and state rules. Candidates should review
                current New Jersey Department of Education guidance before
                applying.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Prepare for the Classroom
              </h2>

              <p className="mt-4 leading-8">
                Alternate route teachers often learn while working. Strong
                organization, classroom management, lesson planning, and support
                from mentors can make the transition smoother.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Search for the Right Opportunity
              </h2>

              <p className="mt-4 leading-8">
                Look for positions that match your certification area,
                experience, and long-term goals. Districts may consider
                alternate route candidates when certification requirements are
                met and the candidate shows strong potential.
              </p>
            </section>
          </div>

          <div className="mt-14 rounded-2xl bg-slate-100 p-8">
            <h3 className="text-2xl font-bold text-slate-900">
              Ready to explore teaching jobs?
            </h3>

            <p className="mt-3 text-slate-600">
              Browse current New Jersey education jobs on NJSchoolCareers.
            </p>

            <Link
              href="/jobs"
              className="mt-6 inline-flex rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Browse Current NJ Education Jobs
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}