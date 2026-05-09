import { createClient } from "@supabase/supabase-js";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

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

  const { data: jobs } = await supabase
    .from("jobs")
    .select("slug, created_at")
    .eq("status", "published");

  const jobPages =
    (jobs ?? [])
      .filter((job) => job.slug)
      .map((job) => ({
        url: `${baseUrl}/jobs/${job.slug}`,
        lastModified: job.created_at
          ? new Date(job.created_at)
          : new Date(),
        changeFrequency: "daily" as const,
        priority: 0.7,
      }));

  const { data: importedJobs } = await supabase
    .from("job_imports")
    .select("district, county");

  const uniqueDistricts = [
    ...new Set(
      (importedJobs ?? [])
        .map((job) =>
          job.district
            ?.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
        )
        .filter(Boolean)
    ),
  ];

  const districtPages = uniqueDistricts.map((slug) => ({
    url: `${baseUrl}/districts/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const uniqueCounties = [
    ...new Set(
      (importedJobs ?? [])
        .map((job) =>
          job.county
            ?.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
        )
        .filter(Boolean)
    ),
  ];

  const countyPages = uniqueCounties.map((slug) => ({
    url: `${baseUrl}/counties/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...jobPages,
    ...districtPages,
    ...countyPages,
  ];
}