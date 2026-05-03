import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type PageProps = {
  searchParams?: Promise<{
    search?: string;
    location?: string;
    county?: string;
    type?: string;
    postedWithin?: string;
    category?: string;
  }>;
};

type Job = {
  slug: string;
  title: string;
  district: string;
  location: string;
  county?: string;
  type?: string;
  posted?: string;
  applyUrl: string;
  overview?: string | null;
  source?: "manual" | "applitrack";
};

function getDaysAgo(posted?: string) {
  if (!posted) return "";

  const postedDate = new Date(posted);
  const now = new Date();

  if (Number.isNaN(postedDate.getTime())) return "";

  const diffMs = now.getTime() - postedDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Posted today";
  if (diffDays === 1) return "Posted 1 day ago";
  return `Posted ${diffDays} days ago`;
}

function getDaysOld(posted?: string) {
  if (!posted) return Number.MAX_SAFE_INTEGER;

  const postedDate = new Date(posted);
  const now = new Date();

  if (Number.isNaN(postedDate.getTime())) return Number.MAX_SAFE_INTEGER;

  const diffMs = now.getTime() - postedDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function isNewJob(posted?: string) {
  return getDaysOld(posted) <= 3;
}

function getCategoryFromTitle(title: string) {
  const value = title.toLowerCase();

  if (value.includes("coach") || value.includes("coaching")) return "Coaching";
  if (value.includes("substitute")) return "Substitute";

  if (
    value.includes("principal") ||
    value.includes("assistant principal") ||
    value.includes("vice principal") ||
    value.includes("supervisor") ||
    value.includes("director") ||
    value.includes("administrator")
  ) {
    return "Administrator";
  }

  if (
    value.includes("counselor") ||
    value.includes("social worker") ||
    value.includes("behaviorist") ||
    value.includes("nurse") ||
    value.includes("child study")
  ) {
    return "Special Services";
  }

  if (
    value.includes("secretary") ||
    value.includes("paraprofessional") ||
    value.includes("aide") ||
    value.includes("clerk")
  ) {
    return "Support Staff";
  }

  return "Teacher";
}

export default async function JobsPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};

  const search = (params.search || "").toLowerCase().trim();
  const location = (params.location || "").toLowerCase().trim();
  const county = (params.county || "").toLowerCase().trim();
  const type = (params.type || "").toLowerCase().trim();
  const postedWithin = (params.postedWithin || "").trim();
  const category = (params.category || "").trim();

  const normalizedSearch = search
    .replace(/\bap\b/g, "assistant principal")
    .replace(/\bsub\b/g, "substitute")
    .trim();

  const searchWords = normalizedSearch.split(/\s+/).filter(Boolean);

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

const { data: manualData, error: manualError } = await supabase
  .from("jobs")
  .select("*")
  .eq("status", "published")
  .order("posted", { ascending: false });

const { data: importData, error: importError } = await supabase
  .from("job_imports")
  .select("*")
  .order("date_posted", { ascending: false });

  const manualJobs: Job[] = (manualData ?? []).map((job) => ({
    slug: job.slug,
    title: job.title,
    district: job.district,
    location: job.city || job.location || "",
    county: job.county || "",
    type: job.type || "",
    posted: job.posted || "",
    applyUrl: job.applyUrl || "",
    overview: job.overview || job.job_description || "",
    source: "manual",
  }));

  const importedJobs: Job[] = (importData ?? []).map((job) => ({
    slug: String(job.id),
    title: job.title,
    district: job.district,
    location: job.city || job.location || "",
    county: job.county || "",
    type: job.position_type || job.type || "",
    posted: job.date_posted || "",
    applyUrl: job.apply_url || job.applyUrl || "",
    overview: job.additional_information || "",
    source: "applitrack",
  }));

  const jobs = [...manualJobs, ...importedJobs].sort((a, b) => {
    const dateA = new Date(a.posted || "").getTime() || 0;
    const dateB = new Date(b.posted || "").getTime() || 0;
    return dateB - dateA;
  });

  const filteredJobs = jobs.filter((job) => {
    const haystack = [
      job.title ?? "",
      job.district ?? "",
      job.location ?? "",
      job.type ?? "",
      job.county ?? "",
      job.overview ?? "",
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      normalizedSearch === "" ||
      searchWords.every((word) => haystack.includes(word));

    const matchesLocation =
      location === "" ||
      (job.location ?? "").toLowerCase().includes(location) ||
      (job.county ?? "").toLowerCase().includes(location);

    const matchesCounty =
      county === "" || (job.county ?? "").toLowerCase() === county;

    const matchesType =
      type === "" || (job.type ?? "").toLowerCase() === type;

    const jobCategory = getCategoryFromTitle(job.title ?? "");
    const matchesCategory =
      category === "" || jobCategory.toLowerCase() === category.toLowerCase();

    const daysOld = getDaysOld(job.posted);
    const matchesPostedWithin =
      postedWithin === "" ||
      (postedWithin === "3" && daysOld <= 3) ||
      (postedWithin === "7" && daysOld <= 7) ||
      (postedWithin === "30" && daysOld <= 30);

    return (
      matchesSearch &&
      matchesLocation &&
      matchesCounty &&
      matchesType &&
      matchesCategory &&
      matchesPostedWithin
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Browse Jobs</h1>

        <form action="/jobs" className="mt-6 rounded-2xl bg-white p-4 shadow">
          <div className="grid gap-3 md:grid-cols-3">
            <input name="search" placeholder="Keyword" className="input" />
            <input name="location" placeholder="City or county" className="input" />
            <button className="rounded-xl bg-orange-500 px-4 py-3 text-white transition hover:bg-orange-600">
              Search
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-gray-500">
          Showing {filteredJobs.length} jobs
        </p>

        <div className="mt-8 space-y-4">
          {filteredJobs.map((job) => {
            const categoryLabel = getCategoryFromTitle(job.title);

            return (
              <div
                key={`${job.source}-${job.slug}`}
                className="rounded-2xl bg-white p-6 shadow transition hover:shadow-md"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {job.type && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                          {job.type}
                        </span>
                      )}

                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-600">
                        {categoryLabel}
                      </span>


                      {isNewJob(job.posted) && (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-600">
                          New
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-semibold">{job.title}</h2>
                    <p className="text-gray-600">{job.district}</p>
                    <p className="text-sm text-gray-500">
                      {job.location}
                      {job.county ? ` · ${job.county}` : ""}
                    </p>
                  </div>

                  <div className="text-sm text-gray-500">
                    {getDaysAgo(job.posted)}
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="rounded-lg border px-4 py-2 hover:bg-gray-100"
                  >
                    View Details
                  </Link>

                  {job.applyUrl && (
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600"
                    >
                      Apply Now
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}