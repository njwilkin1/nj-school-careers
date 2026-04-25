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

// 🔥 UPDATED: better category detection (includes coaching)
function getCategoryFromTitle(title: string) {
  const value = title.toLowerCase();

  if (value.includes("coach") || value.includes("coaching")) {
    return "Coaching";
  }

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

  const rawSearch = params.search || "";
  const rawLocation = params.location || "";
  const rawCounty = params.county || "";
  const rawType = params.type || "";
  const rawPostedWithin = params.postedWithin || "";
  const rawCategory = params.category || "";

  const search = rawSearch.toLowerCase().trim();
  const location = rawLocation.toLowerCase().trim();
  const county = rawCounty.toLowerCase().trim();
  const type = rawType.toLowerCase().trim();
  const postedWithin = rawPostedWithin.trim();
  const category = rawCategory.trim();

  const normalizedSearch = search
    .replace(/\bap\b/g, "assistant principal")
    .replace(/\bsub\b/g, "substitute")
    .trim();

  const searchWords = normalizedSearch.split(/\s+/).filter(Boolean);

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from("jobs")
    .select("*")
    .order("posted", { ascending: false });

  const jobs: Job[] = data ?? [];

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
      location === "" || (job.location ?? "").toLowerCase().includes(location);

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

        <form action="/jobs" className="mt-6 bg-white p-4 rounded-2xl shadow">
          <div className="grid gap-3 md:grid-cols-3">
            <input name="search" placeholder="Keyword" className="input" />
            <input name="location" placeholder="City" className="input" />
            <button className="bg-orange-500 text-white rounded-xl px-4 py-3 hover:bg-orange-600 transition">
              Search
            </button>
          </div>
        </form>

        <div className="mt-8 space-y-4">
          {filteredJobs.map((job) => {
            const categoryLabel = getCategoryFromTitle(job.title);

            return (
              <div
                key={job.slug}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="flex gap-2 mb-2">

                      {job.type && (
                        <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                          {job.type}
                        </span>
                      )}

                      <span className="bg-orange-50 text-orange-600 text-xs px-3 py-1 rounded-full">
                        {categoryLabel}
                      </span>

                      {isNewJob(job.posted) && (
                        <span className="bg-green-50 text-green-600 text-xs px-3 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-semibold">{job.title}</h2>
                    <p className="text-gray-600">{job.district}</p>
                    <p className="text-sm text-gray-500">{job.location}</p>
                  </div>

                  <div className="text-sm text-gray-500">
                    {getDaysAgo(job.posted ?? "")}
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="border px-4 py-2 rounded-lg hover:bg-gray-100"
                  >
                    View Details
                  </Link>

                  <a
                    href={job.applyUrl}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}