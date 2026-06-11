import JobSearchForm from "./components/JobSearchForm";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  is_urgent?: boolean;
};

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
  const totalJobs = 4000;
  const subscriberCount = 327;

  const defaultSearches = [
    "Teacher",
    "Kindergarten",
    "Elementary Teacher",
    "ESL",
    "Math",
    "Assistant Principal",
    "Special Education",
    "Substitute Teacher",
    "School Counselor",
    "Coaching",
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
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("jobs")
    .select("slug, title, district, location, county, type, posted, applyUrl, is_featured, is_urgent")
    .eq("is_featured", true)
    .eq("status", "published")
    .order("posted", { ascending: false })
    .limit(18);

  if (error) {
    console.error("Homepage featured jobs fetch error:", error);
  }

  const featuredJobs: Job[] = data ?? [];

  const { data: searchData, error: searchError } = await supabase
    .from("search_queries")
    .select("query, created_at")
    .gte(
      "created_at",
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    );

  if (searchError) {
    console.error("Popular searches fetch error:", searchError);
  }

  const popularSearches =
    searchData && searchData.length > 0
      ? Object.entries(
          searchData.reduce<Record<string, number>>((acc, item) => {
            const query = item.query
              .trim()
              .toLowerCase()
              .replace(/\b\w/g, (char: string) => char.toUpperCase());

            acc[query] = (acc[query] || 0) + 1;
            return acc;
          }, {})
        )
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([query]) => query)
      : defaultSearches;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-r from-sky-50 via-blue-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.12),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(249,115,22,0.08),_transparent_30%)]" />

        <div className="relative mx-auto max-w-[1400px] px-6 py-14 text-center md:py-20">
          <div className="mx-auto max-w-4xl">

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-6xl">
              Find New Jersey Education Jobs.
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Search thousands of New Jersey education jobs.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <JobSearchForm />
           
          </div>

{/* POPULAR SEARCHES */}
<div className="mx-auto mt-8 max-w-5xl">
            <p className="text-base font-semibold text-slate-700">
              Popular Searches
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {popularSearches.map((item) => (
                <a
                  key={item}
                  href={`/jobs?search=${encodeURIComponent(item)}`}
                  className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-blue-50"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1400px] gap-4 px-6 py-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-3xl font-bold text-slate-950">
              {totalJobs}+
            </div>
            <p className="mt-1 text-sm font-medium text-slate-600">
              Jobs
            </p>
          </div>

          <div>
            <div className="text-3xl font-bold text-slate-950">
              {subscriberCount}+
            </div>
            <p className="mt-1 text-sm font-medium text-slate-600">
              Subscribers
            </p>
          </div>

          <div>
            <div className="text-3xl font-bold text-slate-950">
              150+
            </div>
            <p className="mt-1 text-sm font-medium text-slate-600">
              School Districts
            </p>
          </div>

          <div>
            <div className="text-3xl font-bold text-slate-950">
              Updated
            </div>
            <p className="mt-1 text-sm font-medium text-slate-600">
              Daily
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED JOBS MOVED HIGHER */}
      <section className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Featured Jobs
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Highlighted openings from New Jersey schools
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Explore featured school openings across New Jersey.
            </p>
          </div>

          <a
            href="/employers/pricing"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium transition hover:border-orange-500 hover:text-orange-600"
          >
            Post a Featured Job
          </a>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {featuredJobs.length > 0 ? (
            featuredJobs.map((job) => (
              <article
                key={job.slug}
                className="rounded-3xl border-2 border-teal-300 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
                        Featured Employer
                      </span>

                      {job.is_urgent && (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-700">
                          Urgent Hiring
                        </span>
                      )}

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

                    <h3 className="mt-3 text-xl font-bold tracking-tight">
                      {job.title}
                    </h3>

                    <p className="mt-2 text-sm font-medium text-slate-700">
                      {job.district}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {job.location}
                      {job.county ? ` · ${job.county}` : ""}
                    </p>
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
              <p className="text-slate-600">
                No featured jobs are available right now.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/jobs"
            className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
          >
            Browse all {totalJobs}+ NJ education jobs →
          </a>
        </div>
      </section>

      {/* QUICK JOB PATHS */}
      <section id="quick-links" className="bg-slate-50">
        <div className="mx-auto max-w-[1400px] px-6 py-12">
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
                    <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
                  </div>
                  <span className="text-xl text-blue-600 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* WHY NJSchoolCareers */}
      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-[1400px]">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Why NJSchoolCareers?
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Built for New Jersey education hiring
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-bold text-slate-950">No Account Required</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Apply directly to schools without unnecessary accounts.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-bold text-slate-950">NJ Focused</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Only New Jersey education jobs in one place.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-bold text-slate-950">Updated Daily</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Fresh school openings are added regularly.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-bold text-slate-950">Free Alerts</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Get notified when new jobs match your interests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CAREER RESOURCES PROMO */}
      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-[1400px] rounded-3xl border border-slate-200 bg-slate-50 p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Career Resources
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Get help with your New Jersey school job search
              </h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                Explore interview tips, resume guidance, certification information, and job search resources for educators.
              </p>
            </div>

            <a
              href="/career-resources"
              className="inline-flex justify-center rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              View Career Resources
            </a>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <a
              href="/career-resources"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-bold text-slate-950">Resume Tips</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Strengthen your resume for teaching, leadership, and school support roles.
              </p>
            </a>

            <a
              href="/career-resources"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-bold text-slate-950">Interview Prep</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Prepare for educator interviews with clear, practical guidance.
              </p>
            </a>

            <a
              href="/career-resources"
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-bold text-slate-950">Certification Help</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Find resources related to New Jersey educator certification pathways.
              </p>
            </a>
          </div>
        </div>
      </section>
{/* TRUSTED BY NJ SCHOOLS */}
<section className="bg-white border-t border-slate-200">
  <div className="mx-auto max-w-[1400px] px-6 py-12">
    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
        Trusted Across New Jersey
      </p>

      <h2 className="mt-2 text-3xl font-bold text-slate-950">
        Schools and education organizations use NJSchoolCareers
      </h2>

      <p className="mt-3 text-slate-600">
        Helping New Jersey schools and education employers connect with candidates.
      </p>
    </div>

    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center font-semibold text-slate-800">
        Trenton Public Schools
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center font-semibold text-slate-800">
        Great Oaks Legacy Charter School
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center font-semibold text-slate-800">
        Oak Crest Day Camp
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center font-semibold text-slate-800">
        Spectrum Support Consulting
      </div>
    </div>
  </div>
</section>
      {/* EMPLOYER CTA BAND */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5 px-6 py-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              For Employers
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Hiring for your school or district?
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
              Post jobs, promote urgent openings, or choose an unlimited plan to reach New Jersey educators.
            </p>
          </div>

          <a
            href="/employers/pricing"
            className="inline-flex justify-center rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            View Employer Pricing
          </a>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-[1400px] rounded-3xl border border-slate-200 bg-slate-50 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Ready to get started?
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Search jobs or promote your school opening today.
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/jobs"
                className="rounded-xl bg-orange-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
              >
                Search Jobs
              </a>

              <a
                href="/employers/pricing"
                className="rounded-xl border border-slate-300 px-6 py-3 text-center text-sm font-medium transition hover:border-orange-500 hover:text-orange-600"
              >
                Post a Job
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}