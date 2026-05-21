import Link from "next/link";

export default function NJTeacherResumeTipsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Career Resources
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            NJ Teacher Resume Tips
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            A strong teaching resume helps school districts quickly understand
            your experience, certifications, and strengths as an educator.
            Clear formatting and relevant information can help New Jersey
            teachers stand out during the hiring process.
          </p>

          <div className="mt-12 space-y-10 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Keep Your Resume Clear and Organized
              </h2>

              <p className="mt-4 leading-8">
                Use a clean layout with clear section headings, consistent
                formatting, and readable fonts. Administrators often review
                many applications quickly, so clarity matters.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Highlight Certifications and Endorsements
              </h2>

              <p className="mt-4 leading-8">
                Make sure your New Jersey certifications and endorsements are
                easy to find near the top of the resume. Include grade levels,
                subject areas, and bilingual or special education credentials
                when applicable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Focus on Impact and Student Learning
              </h2>

              <p className="mt-4 leading-8">
                Whenever possible, describe accomplishments and contributions
                instead of only listing responsibilities. Mention curriculum
                development, student engagement strategies, technology use, or
                extracurricular involvement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Proofread Before Applying
              </h2>

              <p className="mt-4 leading-8">
                Small spelling or formatting errors can create a negative
                impression. Review your resume carefully and ask a trusted
                colleague or mentor to review it before submitting applications.
              </p>
            </section>
          </div>

          <div className="mt-14 rounded-2xl bg-slate-100 p-8">
            <h3 className="text-2xl font-bold text-slate-900">
              Ready to apply for teaching jobs?
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