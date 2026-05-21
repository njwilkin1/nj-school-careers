import Link from "next/link";

export default function CoverLetterAdvicePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Career Resources
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            Education Cover Letter Advice
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            A strong cover letter can help New Jersey educators stand out during
            the hiring process. While many school districts focus heavily on
            resumes and certifications, a thoughtful cover letter still helps
            make a positive first impression.
          </p>

          <div className="mt-12 space-y-10 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Keep It Professional and Concise
              </h2>

              <p className="mt-4 leading-8">
                Most education cover letters should stay under one page. Focus
                on introducing yourself, explaining why you are interested in
                the position, and highlighting a few key strengths that connect
                to the school district’s needs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Highlight Relevant Experience
              </h2>

              <p className="mt-4 leading-8">
                Mention teaching experience, student populations you have worked
                with, classroom management strengths, leadership roles,
                coaching, curriculum writing, or technology integration when
                relevant.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Customize for Each District
              </h2>

              <p className="mt-4 leading-8">
                Hiring administrators can quickly tell when a cover letter is
                too generic. Reference the district name and explain why you are
                interested in that particular opportunity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Proofread Carefully
              </h2>

              <p className="mt-4 leading-8">
                Spelling mistakes and formatting issues can create a negative
                first impression. Review your letter carefully before submitting
                your application.
              </p>
            </section>
          </div>

          <div className="mt-14 rounded-2xl bg-slate-100 p-8">
            <h3 className="text-2xl font-bold text-slate-900">
              Ready to apply?
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