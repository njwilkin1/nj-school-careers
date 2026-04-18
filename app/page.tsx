import EmailSignup from "./components/EmailSignup";
import { createClient } from "@supabase/supabase-js";

type Job = {
  slug: string;
  title: string;
  district: string;
  location: string;
  county?: string;
  type?: string;
  posted?: string;
  applyUrl: string;
};

function getDaysAgo(posted: string) {
  const postedDate = new Date(posted);
  const now = new Date();

  if (Number.isNaN(postedDate.getTime())) return "";

  const diffMs = now.getTime() - postedDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Posted today";
  if (diffDays === 1) return "Posted 1 day ago";
  return `Posted ${diffDays} days ago`;
}

function isNewJob(posted?: string) {
  if (!posted) return false;

  const postedDate = new Date(posted);
  const now = new Date();

  if (Number.isNaN(postedDate.getTime())) return false;

  const diffMs = now.getTime() - postedDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays <= 3;
}

export default async function Home() {
  const categories = [
    "Teaching Jobs",
    "Substitute Jobs",
    "Support Staff Roles",
    "Administrative Jobs",
    "Retired Teacher Roles",
    "Bilingual Roles",
  ];

  const popularSearches = [
    "Assistant Principal",
    "Spanish Teacher",
    "Substitute Teacher",
    "Supervisor",
    "Guidance Counselor",
  ];

  const employerHighlights = [
    "Post a job in minutes",
    "Reach New Jersey candidates directly",
    "Make it easier for candidates to apply",
  ];

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("jobs")
    .select("slug, title, district, location, county, type, posted, applyUrl")
    .order("posted", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Homepage featured jobs fetch error:", error);
  }

  const featuredJobs: Job[] = data ?? [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-xl font-bold tracking-tight">NJ School Careers</div>
            <div className="text-xs text-slate-500">
              A faster way to find school jobs in New Jersey
            </div>
          </div>

          <nav className="hidden gap-6 text-sm font-medium md:flex">
            <a href="/jobs" className="hover:text-slate-600">
              Browse Jobs
            </a>
            <a href="#why-us" className="hover:text-slate-600">
              Why Us
            </a>
            <a href="#employers" className="hover:text-slate-600">
              For Employers
            </a>
            <a href="#how-it-works" className="hover:text-slate-600">
              How It Works
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/post-job"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Post a Job
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.14),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              New Jersey School Hiring
            </div>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white md:text-6xl">
              Find school jobs across New Jersey — faster.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              Explore school job openings and apply directly to districts and schools.
            </p>

            <p className="mt-3 text-sm text-slate-300">
              Real New Jersey school jobs. Updated regularly.
            </p>

            <div className="mt-8 rounded-3xl bg-white p-4 shadow-2xl">
              <form action="/jobs" className="grid gap-3 md:grid-cols-[1.2fr_1fr_auto]">
                <input
                  name="search"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400"
                  placeholder="Job title, role, or keyword"
                />

                <input
                  name="location"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400"
                  placeholder="City or county"
                />

                <button
                  type="submit"
                  className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Search Jobs
                </button>
              </form>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                <span>Popular searches:</span>
                {popularSearches.map((item) => (
                  <a
                    key={item}
                    href={`/jobs?search=${encodeURIComponent(item)}`}
                    className="rounded-full bg-slate-100 px-3 py-1"
                  >
                    {item}
                  </a>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                <span>✔ Apply directly</span>
                <span>✔ No account required</span>
                <span>✔ Direct access to school openings</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.16em] text-white/70">
              For Employers
            </div>

            <h2 className="mt-3 text-2xl font-bold">
              Hiring? Reach New Jersey educators quickly.
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-200">
              Post your job and connect directly with candidates without adding extra steps.
            </p>

            <ul className="mt-6 space-y-3">
              {employerHighlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-white/90"
                >
                  <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="/post-job"
              className="mt-8 inline-block w-full rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Post a Job
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <EmailSignup />
      </section>

      <section id="why-us" className="mx-auto max-w-7xl px-6 py-14">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Why Job Seekers Choose Us
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            A simpler way to get hired in New Jersey schools
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Apply Directly</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Skip unnecessary logins and go straight to the school or district application.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold">New Jersey Focused</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Find New Jersey school jobs without sorting through unrelated listings.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Faster Job Search</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              See openings clearly, move faster, and connect with schools sooner.
            </p>
          </div>
        </div>
      </section>

     <section id="categories" className="bg-white">
  <div className="mx-auto max-w-7xl px-6 py-14">
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Explore Categories
      </p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight">
        Browse Jobs by Category
      </h2>
      <p className="mt-3 max-w-2xl text-slate-600">
        Explore popular job categories and county-based searches across New Jersey.
      </p>
    </div>

    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <a
        href="/jobs?search=Teacher"
        className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="text-lg font-semibold">Teaching Jobs</div>
        <div className="mt-2 text-sm text-slate-500">
          Browse classroom teaching roles across New Jersey.
        </div>
      </a>

      <a
        href="/jobs?search=Spanish Teacher"
        className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="text-lg font-semibold">Spanish Teacher Jobs</div>
        <div className="mt-2 text-sm text-slate-500">
          Find Spanish teaching opportunities across New Jersey schools.
        </div>
      </a>

      <a
        href="/jobs?search=Assistant Principal"
        className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="text-lg font-semibold">Assistant Principal Jobs</div>
        <div className="mt-2 text-sm text-slate-500">
          Explore assistant principal openings across New Jersey.
        </div>
      </a>

      <a
        href="/jobs?search=Substitute Teacher"
        className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="text-lg font-semibold">Substitute Teacher Jobs</div>
        <div className="mt-2 text-sm text-slate-500">
          Browse substitute teaching opportunities across the state.
        </div>
      </a>

      <a
        href="/jobs?search=Paraprofessional"
        className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="text-lg font-semibold">Paraprofessional Jobs</div>
        <div className="mt-2 text-sm text-slate-500">
          Explore paraprofessional and classroom support roles.
        </div>
      </a>

      <a
        href="/jobs?search=School Nurse"
        className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="text-lg font-semibold">School Nurse Jobs</div>
        <div className="mt-2 text-sm text-slate-500">
          Find school nurse openings across New Jersey districts.
        </div>
      </a>

      <a
        href="/jobs?county=Bergen%20County"
        className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="text-lg font-semibold">Bergen County Jobs</div>
        <div className="mt-2 text-sm text-slate-500">
          View current school job openings in Bergen County.
        </div>
      </a>

      <a
        href="/jobs?county=Hudson%20County"
        className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="text-lg font-semibold">Hudson County Jobs</div>
        <div className="mt-2 text-sm text-slate-500">
          View current school job openings in Hudson County.
        </div>
      </a>

      <a
        href="/jobs?county=Essex%20County"
        className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="text-lg font-semibold">Essex County Jobs</div>
        <div className="mt-2 text-sm text-slate-500">
          View current school job openings in Essex County.
        </div>
      </a>

      <a
        href="/jobs?county=Passaic%20County"
        className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="text-lg font-semibold">Passaic County Jobs</div>
        <div className="mt-2 text-sm text-slate-500">
          View current school job openings in Passaic County.
        </div>
      </a>

      <a
        href="/jobs?county=Union%20County"
        className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="text-lg font-semibold">Union County Jobs</div>
        <div className="mt-2 text-sm text-slate-500">
          View current school job openings in Union County.
        </div>
      </a>

      <a
        href="/jobs?county=Middlesex%20County"
        className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="text-lg font-semibold">Middlesex County Jobs</div>
        <div className="mt-2 text-sm text-slate-500">
          View current school job openings in Middlesex County.
        </div>
      </a>
    </div>
  </div>
</section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Featured Jobs
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Current Openings
            </h2>
          </div>

          <a
            href="/jobs"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            View All Jobs
          </a>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {featuredJobs.length > 0 ? (
            featuredJobs.map((job) => (
              <article
                key={job.slug}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {job.type && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                          {job.type}
                        </span>
                      )}

                      {isNewJob(job.posted) && (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                          New
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-2xl font-bold tracking-tight">
                      {job.title}
                    </h3>
                    <p className="mt-2 text-base font-medium text-slate-700">
                      {job.district}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {job.location}
                      {job.county ? ` · ${job.county}` : ""}
                    </p>
                  </div>

                  <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                    {getDaysAgo(job.posted ?? "")}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={`/jobs/${job.slug}`}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                  >
                    View Details
                  </a>
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Apply Now
                  </a>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-slate-500">
                No featured jobs are available right now.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="how-it-works" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              How It Works
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Go from search to application in minutes
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="text-3xl font-bold text-slate-900">1</div>
              <h3 className="mt-3 text-xl font-semibold">
                Search by role or location
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Find jobs that match your background and where you want to work.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="text-3xl font-bold text-slate-900">2</div>
              <h3 className="mt-3 text-xl font-semibold">
                View job details instantly
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                See the role, district, requirements, and application process clearly.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="text-3xl font-bold text-slate-900">3</div>
              <h3 className="mt-3 text-xl font-semibold">Apply directly</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Connect with schools faster without getting stuck in complicated systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="employers" className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-8 rounded-[2rem] bg-slate-900 px-8 py-10 text-white lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
              Built for Hiring Teams
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              A faster way for schools to connect with candidates
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200">
              Post your job quickly and connect directly with candidates without
              forcing them through unnecessary steps.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-3xl font-bold">Fast</div>
              <p className="mt-2 text-sm text-slate-200">
                Post a job in under 60 seconds.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-3xl font-bold">Direct</div>
              <p className="mt-2 text-sm text-slate-200">
                Let candidates apply without unnecessary portals.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-5 sm:col-span-2">
              <div className="text-3xl font-bold">Local</div>
              <p className="mt-2 text-sm text-slate-200">
                Reach New Jersey educators looking for local school opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="resources" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Built for New Jersey Educators
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Start your job search today
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            Created to simplify the hiring process for both schools and job seekers
            across New Jersey.
          </p>
          <p className="mt-4 max-w-2xl text-slate-600">
            Coming soon: district salary guides and pay scale tools for New Jersey educators.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/jobs"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Search Jobs
            </a>
            <a
              href="/post-job"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium hover:bg-slate-50"
            >
              Post a Job
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}