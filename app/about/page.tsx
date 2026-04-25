export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight">
          About NJSchoolCareers
        </h1>

        <p className="mt-6 text-lg text-slate-600 leading-8">
          NJSchoolCareers was built to make it easier for educators and school
          districts in New Jersey to connect — without unnecessary barriers,
          logins, or complicated systems.
        </p>

        <p className="mt-6 text-lg text-slate-600 leading-8">
          We focus exclusively on New Jersey school jobs — including teaching,
          administration, coaching, and support staff roles — so job seekers can
          find relevant opportunities faster, and districts can reach qualified
          candidates more directly.
        </p>

        <h2 className="mt-12 text-2xl font-semibold">Why NJSchoolCareers?</h2>

        <ul className="mt-6 space-y-4 text-slate-600 text-lg">
          <li>• No accounts required for job seekers</li>
          <li>• Simple and fast job posting for schools</li>
          <li>• Focused exclusively on New Jersey education jobs</li>
          <li>• Built by an educator who understands the hiring process</li>
        </ul>

        <h2 className="mt-12 text-2xl font-semibold">
          Built from Experience
        </h2>

        <p className="mt-6 text-lg text-slate-600 leading-8">
          NJSchoolCareers was created after firsthand experience working in the
          education job space. The goal is simple: create a cleaner, more
          effective platform that actually helps both job seekers and school
          districts.
        </p>

        <div className="mt-12 rounded-2xl bg-orange-50 border border-orange-200 p-6">
          <p className="text-orange-800 font-medium">
            Our mission is simple: make it easier for New Jersey educators to
            find the right opportunities — and for schools to find the right
            candidates.
          </p>
        </div>
      </div>
    </main>
  );
}