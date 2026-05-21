import Link from "next/link";

export default function AssistantPrincipalInterviewTipsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Career Resources
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            Assistant Principal Interview Tips
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Assistant principal interviews often focus on instructional
            leadership, school culture, student support, communication, and how
            you respond to real school-based scenarios.
          </p>

          <div className="mt-12 space-y-10 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Prepare Leadership Examples
              </h2>
              <p className="mt-4 leading-8">
                Be ready to discuss times when you led a team, supported a
                school initiative, helped colleagues grow, or contributed to
                improving student outcomes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Connect Your Answers to Instruction
              </h2>
              <p className="mt-4 leading-8">
                School leaders are expected to support teaching and learning.
                Share how you use data, observe instruction, provide feedback,
                and help teachers improve practice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Practice Scenario-Based Questions
              </h2>
              <p className="mt-4 leading-8">
                Interview committees may ask how you would handle parent
                concerns, student discipline, staff conflict, attendance issues,
                safety concerns, or urgent school situations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Show Professional Judgment
              </h2>
              <p className="mt-4 leading-8">
                Strong assistant principal candidates demonstrate fairness,
                calm communication, confidentiality, follow-through, and the
                ability to make decisions aligned with school goals.
              </p>
            </section>
          </div>

          <div className="mt-14 rounded-2xl bg-slate-100 p-8">
            <h3 className="text-2xl font-bold text-slate-900">
              Ready to explore school leadership jobs?
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