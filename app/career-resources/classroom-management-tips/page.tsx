import Link from "next/link";

export default function ClassroomManagementTipsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Career Resources
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            Classroom Management Tips
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Strong classroom management helps teachers create safe, respectful,
            and productive learning environments. Whether you are a new teacher
            or an experienced educator, clear routines and consistent
            expectations can make a major difference.
          </p>

          <div className="mt-12 space-y-10 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Start With Clear Expectations
              </h2>

              <p className="mt-4 leading-8">
                Students are more successful when they understand what is
                expected of them. Set clear classroom rules, routines, and
                procedures early, then practice them consistently.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Build Relationships First
              </h2>

              <p className="mt-4 leading-8">
                Classroom management is not only about rules. Students are more
                likely to respond positively when they feel respected, known,
                and supported by their teacher.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Be Consistent and Calm
              </h2>

              <p className="mt-4 leading-8">
                Consistency helps students feel secure. Respond to behavior in
                a calm and predictable way, and avoid escalating situations
                whenever possible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Reflect and Adjust
              </h2>

              <p className="mt-4 leading-8">
                Effective classroom management takes practice. Pay attention to
                what works, ask colleagues for ideas, and adjust routines when
                students need more structure or support.
              </p>
            </section>
          </div>

          <div className="mt-14 rounded-2xl bg-slate-100 p-8">
            <h3 className="text-2xl font-bold text-slate-900">
              Looking for your next classroom role?
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