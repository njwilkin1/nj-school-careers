import { createClient } from "@supabase/supabase-js";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const baseUrl = "https://www.njschoolcareers.com";

  // Static pages
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

  // Job pages
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

  // District pages
  const { data: districts } = await supabase
    .from("job_imports")
    .select("district")
    .not("district", "is", null);

  const uniqueDistricts = [
    ...new Set(
      districts
        ?.map((d) =>
          d.district
            ?.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
        )
        .filter(Boolean)
    ),
  ];

  const districtPages =
    uniqueDistricts.map((slug) => ({
      url: `${baseUrl}/districts/${slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })) || [];

  return [
    ...staticPages,
    ...jobPages,
    ...districtPages,
  ];
}