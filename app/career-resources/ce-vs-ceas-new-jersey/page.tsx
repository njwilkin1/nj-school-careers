import Link from "next/link";

export default function CEVsCEASPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Career Resources
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            CE vs CEAS in New Jersey
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Many New Jersey education candidates encounter the terms CE and
            CEAS during the certification process. Understanding the difference
            can help future teachers better plan their pathway into education.
          </p>

          <div className="mt-12 space-y-10 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                What Is a CE?
              </h2>

              <p className="mt-4 leading-8">
                A Certificate of Eligibility (CE) is commonly associated with
                alternate route teaching candidates. Individuals with a CE may
                meet certification requirements without completing a traditional
                teacher preparation program beforehand.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                What Is a CEAS?
              </h2>

              <p className="mt-4 leading-8">
                A Certificate of Eligibility with Advanced Standing (CEAS) is
                generally issued to candidates who completed an approved teacher
                preparation program, including student teaching requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Certification Requirements May Change
              </h2>

              <p className="mt-4 leading-8">
                Certification rules and testing requirements may change over
                time. Candidates should always review the most current guidance
                from the New Jersey Department of Education and approved
                preparation programs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Choosing the Right Path
              </h2>

              <p className="mt-4 leading-8">
                The best pathway depends on your educational background,
                teaching goals, experience, and whether you completed a teacher
                preparation program. Speaking with universities and certification
                specialists can help clarify next steps.
              </p>
            </section>
          </div>

          <div className="mt-14 rounded-2xl bg-slate-100 p-8">
            <h3 className="text-2xl font-bold text-slate-900">
              Ready to begin your education career?
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