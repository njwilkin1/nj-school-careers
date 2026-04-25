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
};

function normalizeText(value: string | null | undefined): string {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function makeAbsoluteUrl(href: string, baseUrl: string): string {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return href;
  }
}

function createHash(title: string, district: string, applyUrl: string): string {
  return crypto.createHash("sha256").update(`${title}|${district}|${applyUrl}`).digest("hex");
}

function inferJobType(title: string, fallback?: string | null): string {
  const base = `${title} ${fallback || ""}`.toLowerCase();

  if (base.includes("substitute")) return "Substitute";
  if (base.includes("part time") || base.includes("part-time")) return "Part Time";

  if (
    base.includes("principal") ||
    base.includes("vice principal") ||
    base.includes("assistant principal") ||
    base.includes("supervisor") ||
    base.includes("director") ||
    base.includes("administrator") ||
    base.includes("superintendent")
  ) {
    return "Administrative";
  }

  return fallback || "Full Time";
}

function buildOverview(title: string, district: string, location?: string | null): string {
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

function looksLikeJobTitle(text: string): boolean {
  const value = text.toLowerCase();

  const keywords = [
    "teacher",
    "principal",
    "assistant principal",
    "vice principal",
    "supervisor",
    "director",
    "counselor",
    "social worker",
    "nurse",
    "secretary",
    "paraprofessional",
    "aide",
    "substitute",
    "behaviorist",
    "coordinator",
    "special education",
    "math",
    "science",
    "english",
    "ela",
    "esl",
    "spanish",
    "music",
    "technology",
    "physical education",
    "guidance",
    "child study",
    "administrator",
    "athletics",
    "custodian",
    "maintenance",
    "band",
    "choir",
    "intern",
    "translator",
    "human resources",
    "superintendent",
    "coach",
    "bcba",
    "autism",
    "preschool",
    "chemistry",
    "biology",
    "engineering",
  ];

  return keywords.some((keyword) => value.includes(keyword));
}

function isJunkTitle(text: string): boolean {
  const value = text.toLowerCase();

  const badPhrases = [
    "admin login",
    "log in",
    "request technical help",
    "technical help",
    "fmla notice",
    "new jersey teaching jobs",
    "our homepage",
    "benefits",
    "certification information",
    "employment opportunities",
    "district compliance officers",
    "employment contracts",
    "human resources menu",
    "job descriptions",
    "start an application",
    "use passcodes sent to me",
    "all jobs",
  ];

  if (badPhrases.some((phrase) => value.includes(phrase))) return true;
  if (value === "district") return true;
  if (/\(\d+\)$/.test(text) && !looksLikeJobTitle(text)) return true;

  return false;
}

/**
 * APPLITRACK / FRONTLINE
 * Basic temporary parser. This is not the full category-crawler yet.
 */
function parseApplitrackLandingPage(html: string, source: JobSource): ParsedJob[] {
  const $ = cheerio.load(html);
  const jobs: ParsedJob[] = [];
  const seen = new Set<string>();

  $('a[href*="default.aspx"], a[href*="onlineapp"], a[href*="applitrack"]').each((_, el) => {
    const rawText = normalizeText($(el).text());
    const href = normalizeText($(el).attr("href"));

    if (!href || !rawText) return;
    if (isJunkTitle(rawText)) return;
    if (!looksLikeJobTitle(rawText)) return;

    const applyUrl = makeAbsoluteUrl(href, source.source_url);
    const key = `${rawText}|${applyUrl}`;

    if (seen.has(key)) return;
    seen.add(key);

    jobs.push({
      title: rawText,
      district: source.district_name,
      location: null,
      county: source.county ?? null,
      type: inferJobType(rawText),
      posted: null,
      applyUrl,
      overview: buildOverview(rawText, source.district_name),
      raw_source_text: rawText,
    });
  });

  return jobs;
}

/**
 * GENERIC FALLBACK
 */
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
      looksLikeJobTitle(rawText) ||
      hrefLower.includes("job") ||
      hrefLower.includes("position") ||
      hrefLower.includes("career") ||
      hrefLower.includes("vacanc");

    if (!looksLikeJobLink) return;

    const applyUrl = makeAbsoluteUrl(href, source.source_url);
    const key = `${rawText}|${applyUrl}`;

    if (seen.has(key)) return;
    seen.add(key);

    jobs.push({
      title: rawText,
      district: source.district_name,
      location: null,
      county: source.county ?? null,
      type: inferJobType(rawText),
      posted: null,
      applyUrl,
      overview: buildOverview(rawText, source.district_name),
      raw_source_text: rawText,
    });
  });

  return jobs;
}

async function parseJobsFromSource(html: string, source: JobSource): Promise<ParsedJob[]> {
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
    "User-Agent": "NJSchoolCareersBot/1.0 (+https://www.njschoolcareers.com)",
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
        const message = error instanceof Error ? error.message : "Unknown server error";
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
    const message = error instanceof Error ? error.message : "Unknown server error";
    return Response.json({ error: message }, { status: 500 });
  }
}