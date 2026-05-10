import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getJobUrl(job: any) {
  return `https://www.njschoolcareers.com/jobs/${job.slug || job.id}`;
}

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: manualJobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(25);

  const { data: importedJobs } = await supabase
    .from("job_imports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(25);

  const jobs = [...(manualJobs || []), ...(importedJobs || [])]
    .map((job) => {
      const posted = job.date_posted || job.posted || job.created_at || "";
      const description =
        job.job_description ||
        job.overview ||
        job.additional_information ||
        `${job.title} position available at ${job.district || "a New Jersey education employer"}.`;

      return {
        id: job.id,
        slug: job.slug,
        title: job.title || "New Jersey Education Job",
        district: job.district || "NJSchoolCareers",
        location: job.city || job.location || "New Jersey",
        county: job.county || "",
        type: job.position_type || job.type || "",
        posted,
        description,
      };
    })
    .sort((a, b) => {
      const dateA = new Date(a.posted || 0).getTime();
      const dateB = new Date(b.posted || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 30);

  const items = jobs
    .map((job) => {
      const url = getJobUrl(job);
      const pubDate = job.posted
        ? new Date(job.posted).toUTCString()
        : new Date().toUTCString();

      return `
        <item>
          <title>${escapeXml(`${job.title} - ${job.district}`)}</title>
          <link>${escapeXml(url)}</link>
          <guid>${escapeXml(url)}</guid>
          <description>${escapeXml(
            `${job.title} at ${job.district}. ${job.location}${
              job.county ? `, ${job.county} County` : ""
            }. ${job.description}`
          )}</description>
          <pubDate>${pubDate}</pubDate>
        </item>
      `;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>NJSchoolCareers - New Jersey Education Jobs</title>
    <link>https://www.njschoolcareers.com/jobs</link>
    <description>Latest New Jersey school jobs from NJSchoolCareers.com</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}