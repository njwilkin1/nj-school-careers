import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { jobs } from "../../../../data/jobs";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resendApiKey = process.env.RESEND_API_KEY!;
const fromEmail = process.env.ALERTS_FROM_EMAIL!;
const cronSecret = process.env.CRON_SECRET!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const resend = new Resend(resendApiKey);

type Job = (typeof jobs)[number];

function normalize(value: string | undefined | null) {
  return String(value || "").trim().toLowerCase();
}

function matchesSubscriber(
  job: Job,
  subscriber: {
    county: string | null;
    keyword: string | null;
    job_type: string | null;
  }
) {
  const countyMatch =
    !subscriber.county ||
    normalize(job.county).includes(normalize(subscriber.county));

  const keyword = normalize(subscriber.keyword);
  const haystack = [
    job.title,
    job.district,
    job.location,
    job.overview,
    ...(job.requirements || []),
    ...(job.responsibilities || []),
  ]
    .join(" ")
    .toLowerCase();

  const keywordMatch = !keyword || haystack.includes(keyword);

  const typeMatch =
    !subscriber.job_type ||
    normalize(job.type) === normalize(subscriber.job_type);

  return countyMatch && keywordMatch && typeMatch;
}

function buildEmailHtml(email: string, matchedJobs: Job[]) {
  const items = matchedJobs
    .map(
      (job) => `
        <div style="margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid #e5e7eb;">
          <h3 style="margin:0 0 8px 0;">${job.title}</h3>
          <p style="margin:0 0 4px 0;"><strong>${job.district}</strong></p>
          <p style="margin:0 0 8px 0;">${job.location} · ${job.county} · ${job.type}</p>
          <p style="margin:0 0 12px 0;">${job.overview}</p>
          <a href="${job.applyUrl}" target="_blank" style="display:inline-block;padding:10px 14px;background:#0f172a;color:#fff;text-decoration:none;border-radius:8px;">
            Apply Now
          </a>
        </div>
      `
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:24px;">
      <h1 style="margin-bottom:12px;">New NJ School Jobs for You</h1>
      <p style="margin-bottom:24px;">Here are the latest matching jobs we found for ${email}.</p>
      ${items}
      <p style="margin-top:24px;color:#64748b;font-size:14px;">
        NJ School Careers
      </p>
    </div>
  `;
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: subscribers, error } = await supabase
      .from("job_alert_subscribers")
      .select("email, county, keyword, job_type");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const results: Array<{
      email: string;
      sent: boolean;
      count: number;
      error?: string;
    }> = [];

    for (const subscriber of subscribers || []) {
      const matchedJobs = jobs.filter((job) =>
        matchesSubscriber(job, subscriber)
      );

      if (matchedJobs.length === 0) {
        results.push({
          email: subscriber.email,
          sent: false,
          count: 0,
        });
        continue;
      }

      const { error: sendError } = await resend.emails.send({
        from: fromEmail,
        to: [subscriber.email],
        subject: `New NJ school jobs matching your alert (${matchedJobs.length})`,
        html: buildEmailHtml(subscriber.email, matchedJobs.slice(0, 10)),
      });

      if (sendError) {
        results.push({
          email: subscriber.email,
          sent: false,
          count: matchedJobs.length,
          error: sendError.message,
        });
      } else {
        results.push({
          email: subscriber.email,
          sent: true,
          count: matchedJobs.length,
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}