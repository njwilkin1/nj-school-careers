import { createClient } from "@supabase/supabase-js";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Manual jobs
  const { data: jobs } = await supabase
    .from("jobs")
    .select("slug, updated_at");

  // Imported jobs
  const { data: importedJobs } = await supabase
    .from("job_imports")
    .select("slug, created_at");

  const baseUrl = "https://www.njschoolcareers.com";

  const staticPages = [
    "",
    "/jobs",
    "/about",
    "/contact",
    "/post-job",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const jobPages =
    jobs?.map((job) => ({
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: job.updated_at || new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })) || [];

  const importedJobPages =
    importedJobs?.map((job) => ({
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: job.created_at || new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })) || [];

  return [
    ...staticPages,
    ...jobPages,
    ...importedJobPages,
  ];
}