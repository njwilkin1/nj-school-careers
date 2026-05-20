import { createClient } from "@supabase/supabase-js";
import JobFilters from "@/app/components/JobFilters";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchAllRows(supabase: any, tableName: string, queryBuilder?: any) {
  const pageSize = 1000;
  let from = 0;
  let allRows: any[] = [];

  while (true) {
    let query = supabase.from(tableName).select("*");

    if (queryBuilder) {
      query = queryBuilder(query);
    }

    const { data, error } = await query.range(from, from + pageSize - 1);

    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      break;
    }

    if (!data || data.length === 0) break;

    allRows = [...allRows, ...data];

    if (data.length < pageSize) break;

    from += pageSize;
  }

  return allRows;
}

export default async function JobsPage() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

 const manualData = await fetchAllRows(supabase, "jobs", (query: any) =>
  query.or("status.eq.published,status.is.null")
);

  const importData = await fetchAllRows(supabase, "job_imports");

  const manualJobs = manualData.map((job) => ({
    id: job.id,
    slug: job.slug || "",
    title: job.title,
    district: job.district,
    location: job.city || job.location || "",
    county: job.county || "",
    type: job.type || "",
    posted: job.posted || job.created_at || "",
    applyUrl: job.applyUrl || job.apply_url || "",
  }));

  const importedJobs = importData.map((job) => ({
    id: job.id,
    slug: job.slug || "",
    title: job.title,
    district: job.district,
    location: job.city || job.location || "",
    county: job.county || "",
    type: job.position_type || job.type || "",
    posted: job.date_posted || job.created_at || "",
    applyUrl: job.apply_url || job.applyUrl || "",
  }));

  const allJobs = [...manualJobs, ...importedJobs];

  const jobs = Array.from(
    new Map(
      allJobs.map((job) => [
        `${job.title?.toLowerCase().trim()}-${job.district?.toLowerCase().trim()}`,
        job,
      ])
    ).values()
  );

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Browse Jobs
        </h1>

        <JobFilters jobs={jobs} />
      </div>
    </main>
  );
}