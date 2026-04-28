import { createClient } from "@supabase/supabase-js";
import * as cheerio from "cheerio";
import crypto from "crypto";

type JobSource = {
  id: number;
  district_name: string;
  source_type: string;
  source_url: string;
  county?: string | null;
  is_active?: boolean;
  last_checked_at?: string | null;
  notes?: string | null;
};

type ParsedJob = {
  title: string;
  district: string;
  location: string | null;
  county: string | null;
  type: string | null;
  posted: string | null;
  applyUrl: string;
  overview: string | null;
  raw_source_text: string | null;
  position_type: string | null;
  date_posted: string | null;
  closing_date: string | null;
  additional_information: string | null;
};

function normalizeText(value: string | null | undefined): string {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function cleanAdditionalInfo(text: string): string {
  if (!text) return "";

  return text
    .replace(/\r/g, "")
    .replace(/Show\/Hide/gi, "")
    .replace(/Email To A Friend/gi, "")
    .replace(/Print Version/gi, "")
    .replace(/Attachment\(s\):[\s\S]*$/gi, "")
    .replace(/JobID:\s*\d+/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/(Qualifications:)/gi, "\n\n$1\n")
    .replace(/(Salary:)/gi, "\n\n$1\n")
    .replace(/(Salary Range:)/gi, "\n\n$1\n")
    .replace(/(Benefits:)/gi, "\n\n$1\n")
    .replace(/(Responsibilities:)/gi, "\n\n$1\n")
    .replace(/(Requirements:)/gi, "\n\n$1\n")
    .replace(/•/g, "\n• ")
    .trim();
}

function createHash(title: string, district: string, applyUrl: string): string {
  return crypto
    .createHash("sha256")
    .update(`${title}|${district}|${applyUrl}`)
    .digest("hex");
}

function buildApplitrackApplicationUrl(sourceUrl: string, jobId: string): string {
  const url = new URL(sourceUrl);
  const beforeJobPostings = url.pathname.split("/JobPostings/")[0];
  url.pathname = `${beforeJobPostings}/_application.aspx`;
  url.search = `?posJobCodes=${jobId}`;
  return url.toString();
}

function inferJobType(title: string, fallback?: string | null): string {
  const base = `${title} ${fallback || ""}`.toLowerCase();

  // 🔥 OVERRIDES (fix bad Applitrack data)
  if (base.includes("bus driver")) return "Transportation";
  if (base.includes("custodian")) return "Facilities";
  if (base.includes("secretary") || base.includes("administrative")) return "Administrative";

  // Existing logic
  if (base.includes("substitute")) return "Substitute";
  if (base.includes("part time") || base.includes("part-time")) return "Part Time";
  if (base.includes("summer") || base.includes("extended school year")) return "Summer";
  if (base.includes("coach") || base.includes("athletic")) return "Stipend";

  return fallback || "Full Time";
}

function buildOverview(
  title: string,
  district: string,
  location?: string | null
): string {
  const locationPart = location ? ` in ${location}` : "";
  return `The ${title} position at ${district}${locationPart} is now available. Review the full posting for qualifications, responsibilities, and application details.`;
}

function parseDateString(value: string | null | undefined): string | null {
  const text = normalizeText(value);
  if (!text) return null;

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString().split("T")[0];
}

function isJunkTitle(text: string): boolean {
  const value = text.toLowerCase();

  const badPhrases = [
    "admin login",
    "log in",
    "request technical help",
    "technical help",
    "fmla notice",
    "all jobs",
    "view internal positions",
    "internal positions",
    "internal applicants",
    "internal only",
    "email to a friend",
    "print version",
    "show/hide",
    "apply",
    "jobid",
  ];

  return badPhrases.some((phrase) => value.includes(phrase));
}

function getCleanField(fullText: string, label: string): string | null {
  const labels = [
    "Position Type",
    "Date Posted",
    "Location",
    "Closing Date",
    "Date Available",
    "Additional Information",
    "Attachment\\(s\\)",
  ];

  const otherLabels = labels.filter(
    (item) => item.toLowerCase() !== label.toLowerCase()
  );

  const regex = new RegExp(
    `${label}\\s*:\\s*([\\s\\S]*?)(?=\\s*(?:${otherLabels.join(
      "|"
    )})\\s*:|\\s*Email To A Friend|\\s*Print Version|\\s*JobID:|$)`,
    "i"
  );

  const match = fullText.match(regex);
  if (!match || !match[1]) return null;

  const cleaned = normalizeText(match[1])
    .replace(/Show\/Hide/gi, "")
    .replace(/Email To A Friend/gi, "")
    .replace(/Print Version/gi, "")
    .replace(/Attachment\(s\):.*$/gi, "")
    .replace(/job descriptions?/gi, "")
    .trim();

  return cleaned.length > 0 ? cleaned : null;
}

function getAdditionalInformation(fullText: string): string | null {
  const match = fullText.match(
    /Additional Information\s*:?\s*Show\/Hide\s*([\s\S]*?)(?=\s*Attachment\(s\):|\s*Email To A Friend|\s*Print Version|\s*JobID:|$)/i
  );

  if (!match || !match[1]) return null;

  const cleaned = cleanAdditionalInfo(match[1]);
  return cleaned.length > 0 ? cleaned : null;
}

function getJobBlockText($: cheerio.CheerioAPI, table: any): string {
  let container = $(table);
  let parent = container.parent();

  for (let i = 0; i < 8; i++) {
    const parentText = parent.text();

    if (
      parentText.includes("Position Type:") &&
      parentText.includes("Date Posted:") &&
      parentText.includes("Additional Information")
    ) {
      container = parent;
      break;
    }

    parent = parent.parent();
  }

  return container.text();
}

function parseApplitrackLandingPage(html: string, source: JobSource): ParsedJob[] {
  const $ = cheerio.load(html);
  const jobs: ParsedJob[] = [];
  const seen = new Set<string>();

  const jobTables = $("table").filter((_, el) => {
    return $(el).text().includes("JobID:");
  });

  console.log("APPLITRACK TABLES FOUND:", jobTables.length);

  jobTables.each((_, el) => {
    const container = $(el);
    const fullText = getJobBlockText($, el);

    const jobIdMatch = fullText.match(/JobID:\s*(\d+)/i);
    const jobId = jobIdMatch ? jobIdMatch[1] : "";

    if (!jobId) return;

    const headerText = normalizeText(container.find("tr").first().text());

    let title = normalizeText(
      headerText.replace(/JobID:\s*\d+.*/i, "").replace(/Apply/i, "")
    );

    if (!title) {
      title = normalizeText(
        container
          .find("b, strong, i")
          .filter((_, item) => {
            const text = normalizeText($(item).text());
            return Boolean(text) && !text.toLowerCase().includes("jobid");
          })
          .first()
          .text()
      );
    }

    if (!title || title.length < 5) return;
    if (isJunkTitle(title)) return;

    const lowerTitle = title.toLowerCase();
    const lowerText = fullText.toLowerCase();

    if (
      lowerTitle.includes("internal") ||
      lowerText.includes("internal applicants only") ||
      lowerText.includes("internal only") ||
      lowerText.includes("view internal positions")
    ) {
      return;
    }

    const positionType = getCleanField(fullText, "Position Type");
    const location = getCleanField(fullText, "Location") || source.district_name || null;
    const datePosted = parseDateString(getCleanField(fullText, "Date Posted"));
    const closingDate = getCleanField(fullText, "Closing Date");
    const additionalInformation = getAdditionalInformation(fullText);

    const type = inferJobType(title, positionType);
    const applyUrl = buildApplitrackApplicationUrl(source.source_url, jobId);

    const key = `${title}|${source.district_name}|${jobId}`;
    if (seen.has(key)) return;
    seen.add(key);

    jobs.push({
      title,
      district: source.district_name,
      location,
      county: source.county ?? null,
      type,
      posted: datePosted,
      applyUrl,
      overview: buildOverview(title, source.district_name, location),
      raw_source_text: normalizeText(fullText.slice(0, 3000)),
      position_type: positionType,
      date_posted: datePosted,
      closing_date: closingDate,
      additional_information: additionalInformation,
    });

    console.log("FOUND JOB:", title);
    console.log("POSITION TYPE:", positionType);
    console.log("LOCATION:", location);
    console.log("CLOSING DATE:", closingDate);
    console.log("ADDITIONAL INFO:", additionalInformation);
    console.log("APPLY URL:", applyUrl);
  });

  return jobs;
}

function parseGenericDistrictPage(html: string, source: JobSource): ParsedJob[] {
  const $ = cheerio.load(html);
  const jobs: ParsedJob[] = [];
  const seen = new Set<string>();

  $("a").each((_, el) => {
    const rawText = normalizeText($(el).text());
    const href = normalizeText($(el).attr("href"));

    if (!href || !rawText) return;
    if (isJunkTitle(rawText)) return;

    const hrefLower = href.toLowerCase();
    const looksLikeJobLink =
      hrefLower.includes("job") ||
      hrefLower.includes("position") ||
      hrefLower.includes("career") ||
      hrefLower.includes("vacanc");

    if (!looksLikeJobLink) return;

    const applyUrl = new URL(href, source.source_url).toString();
    const key = `${rawText}|${applyUrl}`;

    if (seen.has(key)) return;
    seen.add(key);

    jobs.push({
      title: rawText,
      district: source.district_name,
      location: source.district_name || null,
      county: source.county ?? null,
      type: inferJobType(rawText),
      posted: null,
      applyUrl,
      overview: buildOverview(rawText, source.district_name),
      raw_source_text: rawText,
      position_type: null,
      date_posted: null,
      closing_date: null,
      additional_information: null,
    });
  });

  return jobs;
}

async function parseJobsFromSource(
  html: string,
  source: JobSource
): Promise<ParsedJob[]> {
  const sourceType = normalizeText(source.source_type).toLowerCase();

  if (sourceType === "applitrack" || sourceType === "frontline") {
    const jobs = parseApplitrackLandingPage(html, source);
    console.log("APPLITRACK JOBS FOUND:", jobs.length);
    return jobs;
  }

  const jobs = parseGenericDistrictPage(html, source);
  console.log("GENERIC JOBS FOUND:", jobs.length);
  return jobs;
}

export async function GET(req: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.get("authorization");

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return Response.json(
        { error: "Missing Supabase environment variables." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: sources, error: sourcesError } = await supabase
      .from("job_sources")
      .select("*")
      .eq("is_active", true);

    if (sourcesError) {
      return Response.json({ error: sourcesError.message }, { status: 500 });
    }

    const results: Array<{
      source: string;
      found: number;
      inserted: number;
      errors: string[];
    }> = [];

    for (const source of (sources || []) as JobSource[]) {
      const sourceResult = {
        source: source.district_name,
        found: 0,
        inserted: 0,
        errors: [] as string[],
      };

      try {
        const response = await fetch(source.source_url, {
          headers: {
            "User-Agent":
              "NJSchoolCareersBot/1.0 (+https://www.njschoolcareers.com)",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          sourceResult.errors.push(`Fetch failed: ${response.status}`);
          results.push(sourceResult);
          continue;
        }

        const html = await response.text();
        const parsedJobs = await parseJobsFromSource(html, source);
        sourceResult.found = parsedJobs.length;

        for (const job of parsedJobs) {
          const hash = createHash(job.title, job.district, job.applyUrl);

          const payload = {
            source_id: source.id,
            title: job.title,
            district: job.district,
            location: job.location,
            county: job.county,
            type: job.type,
            posted: job.posted,
            applyUrl: job.applyUrl,
            overview: job.overview,
            raw_source_text: job.raw_source_text,
            position_type: job.position_type,
            date_posted: job.date_posted,
            closing_date: job.closing_date,
            additional_information: job.additional_information,
            source_url: source.source_url,
            status: "new",
            hash,
            created_at: new Date().toISOString(),
          };

          const { error: upsertError } = await supabase
            .from("job_imports")
            .upsert(payload, {
              onConflict: "hash",
              ignoreDuplicates: false,
            });

          if (upsertError) {
            sourceResult.errors.push(
              `Insert failed for "${job.title}": ${upsertError.message}`
            );
          } else {
            sourceResult.inserted += 1;
          }
        }

        await supabase
          .from("job_sources")
          .update({ last_checked_at: new Date().toISOString() })
          .eq("id", source.id);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown server error";
        sourceResult.errors.push(message);
      }

      results.push(sourceResult);
    }

    return Response.json({
      success: true,
      checkedSources: results.length,
      results,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    return Response.json({ error: message }, { status: 500 });
  }
}