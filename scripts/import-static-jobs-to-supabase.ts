import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { jobs } from "../data/jobs";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function run() {
  console.log(`Found ${jobs.length} static jobs.`);

  const { data: existingJobs, error: existingError } = await supabase
    .from("jobs")
    .select("slug");

  if (existingError) {
    console.error("Failed to fetch existing jobs:", existingError.message);
    process.exit(1);
  }

  const existingSlugs = new Set((existingJobs || []).map((job: any) => job.slug));

  const jobsToInsert = jobs
    .filter((job) => job.slug && !existingSlugs.has(job.slug))
    .map((job) => ({
      title: job.title ?? "",
      district: job.district ?? "",
      location: job.location ?? "",
      county: job.county ?? "",
      type: job.type ?? "",
      posted: job.posted ?? null,
      applyUrl: job.applyUrl ?? "",
      overview: job.overview ?? "",
      responsibilities: Array.isArray(job.responsibilities)
        ? job.responsibilities
        : [],
      requirements: Array.isArray(job.requirements)
        ? job.requirements
        : [],
      slug: job.slug ?? "",
    }));

  if (jobsToInsert.length === 0) {
    console.log("No new jobs to import. Everything is already in Supabase.");
    return;
  }

  const { error: insertError } = await supabase
    .from("jobs")
    .insert(jobsToInsert);

  if (insertError) {
    console.error("Failed to insert jobs:", insertError.message);
    process.exit(1);
  }

  console.log(`Imported ${jobsToInsert.length} jobs into Supabase.`);
}

run().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});