import Link from "next/link";

export default function BecomingPrincipalPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Career Resources
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            Becoming a Principal in New Jersey
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            School leadership roles in New Jersey often require a combination
            of classroom experience, graduate coursework, certification, and
            leadership development. Many educators begin by serving as teachers,
            supervisors, instructional coaches, or assistant principals before
            pursuing principal positions.
          </p>

          <div className="mt-12 space-y-10 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Gain Classroom and Leadership Experience
              </h2>

              <p className="mt-4 leading-8">
                Most principals build experience through teaching, committee
                work, mentoring, department leadership, coaching, curriculum
                projects, or school improvement initiatives.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Complete Graduate Coursework
              </h2>

              <p className="mt-4 leading-8">
                New Jersey school leaders typically complete graduate-level
                educational leadership programs aligned with certification
                requirements. Coursework may focus on supervision, school law,
                leadership, curriculum, finance, and school operations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Understand Certification Requirements
              </h2>

              <p className="mt-4 leading-8">
                Certification requirements may vary based on prior experience
                and educational background. Candidates should review current
                New Jersey Department of Education requirements and speak with
                approved preparation programs when planning a leadership path.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Develop Strong Communication Skills
              </h2>

              <p className="mt-4 leading-8">
                Principals work closely with students, staff, families, school
                boards, and community members. Effective communication,
                organization, professionalism, and problem-solving are essential
                leadership skills.
              </p>
            </section>
          </div>

          <div className="mt-14 rounded-2xl bg-slate-100 p-8">
            <h3 className="text-2xl font-bold text-slate-900">
              Ready to explore school leadership opportunities?
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