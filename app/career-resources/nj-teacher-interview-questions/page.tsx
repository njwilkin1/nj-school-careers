import Link from "next/link";

export default function NJTeacherInterviewQuestionsPage() {
  return (
    <main className="bg-slate-50 py-16">
      <div className="mx-auto max-w-4xl px-6">

        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12">

          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
            Career Resources
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            How to Make a Strong First Impression During a Job Interview
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-700">
            Interviewing for a teaching or education position can feel stressful,
            especially when preparing for your first professional interview.
            Fortunately, preparation and confidence can go a long way toward
            helping you make a strong impression.
          </p>

          <p className="mt-6 text-lg leading-8 text-slate-700">
            School districts are looking for candidates who communicate well,
            demonstrate professionalism, and show genuine enthusiasm for working
            with students and staff.
          </p>

          <p className="mt-6 text-lg leading-8 text-slate-700">
            These interview tips can help New Jersey educators feel more prepared
            and confident before their next opportunity.
          </p>

          <h2 className="mt-12 text-2xl font-bold text-slate-900">
            Before the Interview
          </h2>

          <div className="mt-8 space-y-6">

            <div className="rounded-2xl bg-slate-100 p-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Practice Common Interview Questions
              </h3>

              <p className="mt-3 text-lg leading-8 text-slate-700">
                Practicing responses ahead of time can help reduce anxiety and
                improve confidence. Consider reviewing common teacher interview
                questions and conducting mock interviews with a friend, mentor,
                or colleague.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-100 p-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Research the School District
              </h3>

              <p className="mt-3 text-lg leading-8 text-slate-700">
                Learn about the district’s mission, values, programs, and student
                population before the interview. This preparation can help you
                better understand the district and demonstrate genuine interest
                during the interview process.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-100 p-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Review the Job Posting Carefully
              </h3>

              <p className="mt-3 text-lg leading-8 text-slate-700">
                Make sure you understand the responsibilities and qualifications
                listed in the job posting. Referencing specific expectations from
                the position can help strengthen your interview responses.
              </p>
            </div>

          </div>

          <h2 className="mt-12 text-2xl font-bold text-slate-900">
            Preparing for the Interview
          </h2>

          <div className="mt-8 space-y-6">

            <div className="rounded-2xl bg-slate-100 p-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Dress Professionally
              </h3>

              <p className="mt-3 text-lg leading-8 text-slate-700">
                First impressions matter. Professional attire helps demonstrate
                seriousness, preparation, and respect for the interview process.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-100 p-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Get Enough Rest
              </h3>

              <p className="mt-3 text-lg leading-8 text-slate-700">
                A good night’s sleep can help improve focus, confidence, and
                communication during the interview.
              </p>
            </div>

          </div>

          <h2 className="mt-12 text-2xl font-bold text-slate-900">
            During the Interview
          </h2>

          <div className="mt-8 space-y-6">

            <div className="rounded-2xl bg-slate-100 p-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Stay Calm and Confident
              </h3>

              <p className="mt-3 text-lg leading-8 text-slate-700">
                It is completely normal to feel nervous during an interview.
                Taking a deep breath and staying focused can help you communicate
                more effectively.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-100 p-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Maintain Eye Contact and Positive Body Language
              </h3>

              <p className="mt-3 text-lg leading-8 text-slate-700">
                Professional body language, eye contact, and a positive attitude
                can help demonstrate confidence and engagement during the interview.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-100 p-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Show Enthusiasm
              </h3>

              <p className="mt-3 text-lg leading-8 text-slate-700">
                Hiring committees want candidates who are genuinely excited about
                the opportunity to work with students and contribute to the school
                community.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-100 p-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Share Specific Examples
              </h3>

              <p className="mt-3 text-lg leading-8 text-slate-700">
                Instead of only listing qualifications, share examples of how you
                have used your skills in classrooms, student teaching experiences,
                leadership roles, or other educational settings.
              </p>
            </div>

          </div>

          <h2 className="mt-12 text-2xl font-bold text-slate-900">
            After the Interview
          </h2>

          <div className="mt-8 rounded-2xl bg-slate-100 p-6">
            <h3 className="text-xl font-semibold text-slate-900">
              Send a Follow-Up Email
            </h3>

            <p className="mt-3 text-lg leading-8 text-slate-700">
              Sending a professional thank-you email after the interview can help
              reinforce your interest in the position and leave a positive final
              impression with the hiring committee.
            </p>
          </div>

          <div className="mt-14 rounded-2xl bg-slate-100 p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900">
              Ready to Explore Teaching Opportunities?
            </h3>

            <p className="mt-4 text-lg text-slate-700">
              Browse current New Jersey education jobs and explore opportunities
              across the state.
            </p>

            <Link
              href="/jobs"
              className="mt-6 inline-flex rounded-xl bg-orange-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-orange-600"
            >
              Browse Current NJ Education Jobs
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}