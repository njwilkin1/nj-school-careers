import Link from "next/link";

export default function NetworkingJobSearchTipsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Career Resources
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            Networking & Job Search Tips
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            A strong job search is about more than submitting applications.
            Building professional relationships, staying organized, and applying
            strategically can help New Jersey educators find better
            opportunities faster.
          </p>

          <div className="mt-12 space-y-10 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Stay Organized
              </h2>

              <p className="mt-4 leading-8">
                Keep track of the jobs you apply to, application deadlines,
                contact names, interview dates, and follow-up steps. A simple
                spreadsheet or notes document can help you avoid missing
                important opportunities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Use Your Professional Network
              </h2>

              <p className="mt-4 leading-8">
                Former colleagues, supervisors, cooperating teachers,
                professors, coaches, and professional associations can all be
                helpful sources of information. Many education opportunities
                are easier to understand when you have insight from someone who
                knows the district or school community.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Apply Strategically
              </h2>

              <p className="mt-4 leading-8">
                Instead of applying randomly, focus on roles that match your
                certification, experience, commute, and long-term goals. A
                targeted application is usually stronger than a generic one.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Follow Up Professionally
              </h2>

              <p className="mt-4 leading-8">
                When appropriate, a short and respectful follow-up email can
                reinforce your interest. Keep the message brief, professional,
                and focused on your continued enthusiasm for the opportunity.
              </p>
            </section>
          </div>

          <div className="mt-14 rounded-2xl bg-slate-100 p-8">
            <h3 className="text-2xl font-bold text-slate-900">
              Ready to continue your job search?
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