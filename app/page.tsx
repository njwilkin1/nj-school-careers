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

  const diffDays = Math.floor(
    (now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) return "Posted today";
  if (diffDays === 1) return "Posted 1 day ago";
  return `Posted ${diffDays} days ago`;
}

function isNewJob(posted?: string) {
  if (!posted) return false;
  const postedDate = new Date(posted);
  const now = new Date();

  if (Number.isNaN(postedDate.getTime())) return false;

  const diffDays = Math.floor(
    (now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

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

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from("jobs")
    .select(
      "slug, title, district, location, county, type, posted, applyUrl, is_featured"
    )
    .eq("is_featured", true)
    .order("posted", { ascending: false })
    .limit(4);

  const featuredJobs: Job[] = data ?? [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-xl font-bold">NJ School Careers</div>
            <div className="text-xs text-slate-500">
              A faster way to find school jobs in New Jersey
            </div>
          </div>

          <nav className="hidden gap-6 text-sm md:flex">
            <a href="/jobs">Browse Jobs</a>
            <a href="#why-us">Why Us</a>
            <a href="#employers">For Employers</a>
            <a href="#how-it-works">How It Works</a>
          </nav>

          <a
            href="/post-job"
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Post a Job
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-r from-sky-50 via-blue-50 to-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2">

          <div>
            <div className="mb-4 inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold uppercase text-blue-700">
              New Jersey School Hiring
            </div>

            <h1 className="text-5xl font-bold text-slate-900">
              Find school jobs across New Jersey.
            </h1>

            <p className="mt-4 text-lg text-slate-700">
              Explore school job openings and apply directly to districts and schools.
            </p>

            {/* SEARCH BOX */}
            <div className="mt-6 rounded-2xl bg-white p-4 shadow-lg">
              <form action="/jobs" className="grid gap-3 md:grid-cols-3">
                <input
                  name="search"
                  className="rounded-xl border px-4 py-3"
                  placeholder="Job title or keyword"
                />
                <input
                  name="location"
                  className="rounded-xl border px-4 py-3"
                  placeholder="City or county"
                />
                <button className="rounded-xl bg-orange-500 text-white hover:bg-orange-600">
                  Search Jobs
                </button>
              </form>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                {popularSearches.map((item) => (
                  <span key={item} className="rounded-full bg-slate-100 px-3 py-1">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* EMPLOYER BOX */}
          <div className="rounded-3xl border bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold">
              Hiring? Reach New Jersey educators quickly.
            </h2>

            <ul className="mt-4 space-y-2 text-sm">
              {employerHighlights.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>

            <a
              href="/post-job"
              className="mt-6 block rounded-xl bg-orange-500 py-3 text-center font-semibold text-white hover:bg-orange-600"
            >
              Post a Job
            </a>
          </div>

        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <h2 className="text-2xl font-bold">Featured Jobs</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {featuredJobs.map((job) => (
            <div key={job.slug} className="rounded-xl border p-4 shadow-sm">
              <h3 className="text-lg font-bold">{job.title}</h3>
              <p className="text-sm text-slate-600">{job.district}</p>

              <div className="mt-3 flex gap-2">
                <a href={`/jobs/${job.slug}`} className="text-blue-600">
                  View
                </a>
                <a href={job.applyUrl} className="text-orange-500">
                  Apply
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <EmailSignup />

    </div>
  );
}