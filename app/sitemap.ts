import { createClient } from "@supabase/supabase-js";
import { MetadataRoute } from "next";

function slugify(value: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const baseUrl = "https://www.njschoolcareers.com";

  // STATIC PAGES
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
    priority: route === "" ? 1 : 0.9,
  }));

  // MANUAL / PAID JOB PAGES
  const { data: jobs } = await supabase
    .from("jobs")
    .select("slug, created_at")
    .eq("status", "published");

  const jobPages =
    (jobs ?? [])
      .filter((job) => job.slug)
      .map((job) => ({
        url: `${baseUrl}/jobs/${job.slug}`,
        lastModified: job.created_at ? new Date(job.created_at) : new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      }));

  // IMPORTED APPLITRACK JOB DATA
  const { data: importedJobs } = await supabase
    .from("job_imports")
    .select("id, district, county, title, date_posted")
    .or("status.eq.new,status.eq.published,status.is.null");

  // IMPORTED APPLITRACK JOB DETAIL PAGES
  const importedJobPages =
    (importedJobs ?? [])
      .filter((job) => job.id)
      .map((job) => ({
        url: `${baseUrl}/jobs/${job.id}`,
        lastModified: job.date_posted
          ? new Date(job.date_posted)
          : new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      }));

  // DISTRICT PAGES
  const uniqueDistricts = [
    ...new Set(
      (importedJobs ?? [])
        .map((job) => slugify(job.district))
        .filter(Boolean)
    ),
  ];

  const districtPages = uniqueDistricts.map((slug) => ({
    url: `${baseUrl}/districts/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // COUNTY PAGES
  const uniqueCounties = [
    ...new Set(
      (importedJobs ?? [])
        .map((job) => slugify(job.county))
        .filter(Boolean)
    ),
  ];

  const countyPages = uniqueCounties.map((slug) => ({
    url: `${baseUrl}/counties/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // CATEGORY PAGES
  const categoryKeywords = [
    "spanish teacher",
    "special education teacher",
    "school counselor",
    "assistant principal",
    "math teacher",
    "science teacher",
    "esl teacher",
    "school psychologist",
    "speech therapist",
    "supervisor",
  ];

  const categoryPages = categoryKeywords.map((category) => ({
    url: `${baseUrl}/jobs/${slugify(category)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [
    ...staticPages,
    ...jobPages,
    ...importedJobPages,
    ...districtPages,
    ...countyPages,
    ...categoryPages,
  ];
}