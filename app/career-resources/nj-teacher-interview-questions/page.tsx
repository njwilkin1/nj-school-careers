import Link from "next/link";

export default function NJTeacherInterviewQuestionsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Career Resources
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            NJ Teacher Interview Questions
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Teacher interviews often focus on instruction, classroom management,
            student relationships, collaboration, and how you support diverse
            learners. Preparing thoughtful examples can help you answer with
            confidence.
          </p>

          <div className="mt-12 space-y-10 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Be Ready to Discuss Instruction
              </h2>
              <p className="mt-4 leading-8">
                Interview teams may ask how you plan lessons, differentiate
                instruction, use assessment data, and keep students engaged.
                Prepare examples from your classroom, student teaching, or
                previous school experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Prepare Classroom Management Examples
              </h2>
              <p className="mt-4 leading-8">
                Schools want to know how you build routines, set expectations,
                and respond to challenging behavior. Focus on consistency,
                relationships, and creating a respectful learning environment.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Show That You Can Collaborate
              </h2>
              <p className="mt-4 leading-8">
                Teachers work closely with colleagues, families, counselors,
                case managers, administrators, and support staff. Be prepared to
                explain how you communicate professionally and contribute to a
                school team.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Practice Common Questions
              </h2>
              <p className="mt-4 leading-8">
                Common questions may include why you want to teach in the
                district, how you support struggling learners, how you use data,
                and how you build positive relationships with students and
                families.
              </p>
            </section>
          </div>

          <div className="mt-14 rounded-2xl bg-slate-100 p-8">
            <h3 className="text-2xl font-bold text-slate-900">
              Ready to find your next teaching opportunity?
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