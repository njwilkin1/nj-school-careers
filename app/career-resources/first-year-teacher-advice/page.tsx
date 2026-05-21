import Link from "next/link";

export default function FirstYearTeacherAdvicePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Career Resources
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            First-Year Teacher Advice
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            The first year of teaching can feel exciting, overwhelming, and
            exhausting all at once. Many new educators quickly discover that
            strong organization, flexibility, and support systems are essential
            for long-term success.
          </p>

          <div className="mt-12 space-y-10 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Focus on Routines Early
              </h2>

              <p className="mt-4 leading-8">
                Clear classroom procedures help students understand expectations
                and create a more manageable learning environment. Spend time
                teaching routines and reinforcing them consistently.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Ask Questions and Seek Support
              </h2>

              <p className="mt-4 leading-8">
                Experienced teachers, mentors, supervisors, and support staff
                can provide valuable guidance. Asking questions is part of the
                learning process and helps new teachers grow more quickly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Stay Organized
              </h2>

              <p className="mt-4 leading-8">
                Lesson plans, grading, communication, meetings, and paperwork
                can become overwhelming without strong organization systems.
                Find routines and tools that help you stay consistent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Give Yourself Grace
              </h2>

              <p className="mt-4 leading-8">
                No first-year teacher has everything figured out immediately.
                Focus on steady growth, building relationships with students,
                and improving one step at a time.
              </p>
            </section>
          </div>

          <div className="mt-14 rounded-2xl bg-slate-100 p-8">
            <h3 className="text-2xl font-bold text-slate-900">
              Ready to begin your teaching career?
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