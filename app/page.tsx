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
  is_featured?: boolean;
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

  const quickJobPaths = [
    ["Assistant Principal Jobs", "Leadership roles", "/jobs?search=Assistant%20Principal"],
    ["Special Education Jobs", "Make a difference every day", "/jobs?search=Special%20Education"],
    ["Substitute Teacher Jobs", "Flexible school opportunities", "/jobs?search=Substitute%20Teacher"],
    ["School Counselor Jobs", "Support student success", "/jobs?search=School%20Counselor"],
    ["Summer Jobs", "Seasonal opportunities", "/jobs?search=Summer"],
    ["Support Staff Jobs", "Keep schools running", "/jobs?search=Support%20Staff"],
    ["Bilingual / ESL Jobs", "Language skills in demand", "/jobs?search=ESL"],
    ["Coaching Jobs", "Athletics and activities", "/jobs?search=Coaching"],
  ];

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("jobs")
    .select("slug, title, district, location, county, type, posted, applyUrl, is_featured")
    .eq("is_featured", true)
    .order("posted", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Homepage featured jobs fetch error:", error);
  }

  const featuredJobs: Job[] = data ?? [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-r from-sky-50 via-blue-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.12),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(249,115,22,0.08),_transparent_30%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24">
          <div>
            <div className="mb-4 inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              New Jersey School Hiring
            </div>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
              NJSchoolCareers
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
              A faster way to get hired in New Jersey schools.
            </p>

            <p className="mt-3 text-sm text-slate-600">
              Browse 100+ New Jersey school jobs. Updated regularly.
            </p>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
              <form action="/jobs" className="grid gap-3 md:grid-cols-[1.2fr_1fr_auto]">
                <input
                  name="search"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400"
                  placeholder="Job title, role, or keyword"
                />

                <input
                  name="location"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400"
                  placeholder="City or county"
                />

                <button
                  type="submit"
                  className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
                >
                  Search Jobs
                </button>
              </form>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                <span>Trending searches:</span>
                {popularSearches.map((item) => (
                  <a
                    key={item}
                    href={`/jobs?search=${encodeURIComponent(item)}`}
                    className="rounded-full bg-blue-50 px-3 py-1 text-blue-700 transition hover:bg-blue-100"
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

          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl">
            <div className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
              For Employers
            </div>

            <h2 className="mt-3 text-2xl font-bold">
              Hiring? Reach New Jersey educators{" "}
              <span className="text-orange-500">quickly.</span>
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Post your job and connect directly with candidates without adding extra steps.
            </p>

            <ul className="mt-6 space-y-3">
              {employerHighlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-orange-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="/post-job"
              className="mt-8 inline-block w-full rounded-2xl bg-orange-500 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Post a Job
            </a>
          </div>
        </div>
      </section>

      <section id="quick-links" className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Quick Job Paths
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Quick ways to find the right job
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Jump to the most in-demand school jobs in New Jersey.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickJobPaths.map(([title, subtitle, href]) => (
              <a
                key={title}
                href={href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-950 group-hover:text-blue-700">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                  </div>
                  <span className="text-xl text-blue-600 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-4">
            <div>
              <div className="font-semibold text-slate-950">Apply Directly</div>
              <p className="mt-1 text-sm text-slate-500">No unnecessary accounts.</p>
            </div>

            <div>
              <div className="font-semibold text-slate-950">NJ Focused</div>
              <p className="mt-1 text-sm text-slate-500">Only New Jersey school jobs.</p>
            </div>

            <div>
              <div className="font-semibold text-slate-950">Updated Regularly</div>
              <p className="mt-1 text-sm text-slate-500">Fresh opportunities added.</p>
            </div>

            <div>
              <div className="font-semibold text-slate-950">Simple Search</div>
              <p className="mt-1 text-sm text-slate-500">Find openings faster.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <EmailSignup />
      </section>

      <section id="why-us" className="mx-auto max-w-7xl px-6 py-14">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Why Job Seekers Choose Us
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            A simpler way to get hired in New Jersey schools
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-xl font-semibold">Apply Directly</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Skip unnecessary logins and go straight to the school or district application.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-xl font-semibold">New Jersey Focused</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Find New Jersey school jobs without sorting through unrelated listings.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-xl font-semibold">Faster Job Search</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              See openings clearly, move faster, and connect with schools sooner.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Featured Jobs
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Current Openings
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Want more visibility for your opening? Featured jobs appear on the homepage for added exposure.
            </p>
          </div>

          <a
            href="/post-job"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium transition hover:border-orange-500 hover:text-orange-600"
          >
            Feature Your Job
          </a>
        </div>

        <p className="mt-3 text-sm text-green-600">
          Posting jobs is currently free for New Jersey schools during launch.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {featuredJobs.length > 0 ? (
            featuredJobs.map((job) => (
              <article
                key={job.slug}
                className="rounded-3xl border-2 border-orange-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
                        Featured
                      </span>

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
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium transition hover:border-blue-400 hover:bg-blue-50"
                  >
                    View Details
                  </a>
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
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
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              How It Works
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Go from search to application in minutes
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="text-3xl font-bold text-blue-700">1</div>
              <h3 className="mt-3 text-xl font-semibold">
                Search by role or location
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Find jobs that match your background and where you want to work.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="text-3xl font-bold text-blue-700">2</div>
              <h3 className="mt-3 text-xl font-semibold">
                View job details instantly
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                See the role, district, requirements, and application process clearly.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="text-3xl font-bold text-blue-700">3</div>
              <h3 className="mt-3 text-xl font-semibold">Apply directly</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Connect with schools faster without getting stuck in complicated systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="employers" className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-8 rounded-[2rem] bg-gradient-to-r from-blue-900 to-blue-700 px-8 py-10 text-white lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
              Built for Hiring Teams
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              A faster way for schools to connect with candidates
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-blue-50">
              Post your job quickly and connect directly with candidates without
              forcing them through unnecessary steps.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-3xl font-bold text-orange-300">Fast</div>
              <p className="mt-2 text-sm text-blue-50">
                Post a job in under 60 seconds.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-3xl font-bold text-orange-300">Direct</div>
              <p className="mt-2 text-sm text-blue-50">
                Let candidates apply without unnecessary portals.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-5 sm:col-span-2">
              <div className="text-3xl font-bold text-orange-300">Local</div>
              <p className="mt-2 text-sm text-blue-50">
                Reach New Jersey educators looking for local school opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="resources" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
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
              className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Search Jobs
            </a>
            <a
              href="/post-job"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium transition hover:border-orange-500 hover:text-orange-600"
            >
              Post a Job
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}