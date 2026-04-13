import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { jobs } from "@/data/jobs";

type Subscriber = {
  email: string;
  county: string | null;
  keyword: string | null;
  job_type: string | null;
};

type Job = {
  slug: string;
  title: string;
  district: string;
  location: string;
  county?: string;
  type?: string;
  applyUrl: string;
  overview?: string;
  responsibilities?: string[];
  requirements?: string[];
};

function normalize(value: string | null | undefined): string {
  return String(value || "").trim().toLowerCase();
}

function buildJobCards(unsentJobs: Job[]): string {
  return unsentJobs
    .map(
      (job) => `
        <div style="margin-bottom:20px;padding:20px;border:1px solid #e5e7eb;border-radius:12px;background:#ffffff;">
          <div style="font-size:20px;font-weight:700;color:#0f172a;margin-bottom:8px;">
            ${job.title}
          </div>

          <div style="font-size:15px;color:#334155;margin-bottom:6px;">
            <strong>${job.district}</strong>
          </div>

          <div style="font-size:14px;color:#64748b;margin-bottom:14px;">
            ${job.location}${job.county ? ` • ${job.county}` : ""}${job.type ? ` • ${job.type}` : ""}
          </div>

          ${
            job.overview
              ? `<div style="font-size:14px;line-height:1.6;color:#475569;margin-bottom:14px;">
                   ${job.overview}
                 </div>`
              : ""
          }

          <a
            href="${job.applyUrl}"
            style="
              display:inline-block;
              background:#0f172a;
              color:#ffffff;
              text-decoration:none;
              padding:10px 16px;
              border-radius:8px;
              font-size:14px;
              font-weight:600;
            "
          >
            Apply Now
          </a>
        </div>
      `
    )
    .join("");
}

function buildEmailHtml(unsentJobs: Job[]): string {
  const headingText =
    unsentJobs.length === 1
      ? "We found 1 new job matching your preferences."
      : `We found ${unsentJobs.length} new jobs matching your preferences.`;

  const jobCards = buildJobCards(unsentJobs);

  return `
    <div style="margin:0;padding:0;background:#f8fafc;">
      <div style="max-width:680px;margin:0 auto;padding:32px 20px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <div style="background:#ffffff;border-radius:18px;padding:32px;border:1px solid #e2e8f0;">
          <div style="font-size:28px;font-weight:800;margin-bottom:10px;color:#0f172a;">
            New NJ School Jobs for You
          </div>

          <div style="font-size:16px;line-height:1.6;color:#475569;margin-bottom:24px;">
            ${headingText}
          </div>

          <div style="margin-bottom:28px;">
            ${jobCards}
          </div>

          <div style="font-size:13px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:18px;">
            You’re receiving this email because you subscribed at NJ School Careers.
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.ALERTS_FROM_EMAIL;

    if (!supabaseUrl || !supabaseServiceRoleKey || !resendApiKey || !fromEmail) {
      return NextResponse.json(
        { error: "Missing environment variables." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const resend = new Resend(resendApiKey);

    const { data: subscribers, error: subscriberError } = await supabase
      .from("job_alert_subscribers")
      .select("*");

    if (subscriberError) {
      return NextResponse.json(
        { error: `Subscriber fetch failed: ${subscriberError.message}` },
        { status: 500 }
      );
    }

    const debugResults: Array<{
      email: string;
      matchedJobs: number;
      newJobs: number;
      sent: boolean;
      error?: unknown;
    }> = [];

    for (const sub of (subscribers || []) as Subscriber[]) {
      const matches = (jobs as Job[]).filter((job) => {
        const matchCounty =
          !sub.county ||
          normalize(job.county).includes(normalize(sub.county));

        const haystack = [
          job.title,
          job.district,
          job.location,
          job.overview || "",
          ...(job.responsibilities || []),
          ...(job.requirements || []),
        ]
          .join(" ")
          .toLowerCase();

        const matchKeyword =
          !sub.keyword || haystack.includes(normalize(sub.keyword));

        const matchType =
          !sub.job_type || normalize(job.type) === normalize(sub.job_type);

        return matchCounty && matchKeyword && matchType;
      });

      const unsentJobs: Job[] = [];

      for (const job of matches) {
        const { data: alreadySent, error: sentCheckError } = await supabase
          .from("sent_job_alerts")
          .select("id")
          .eq("subscriber_email", sub.email)
          .eq("job_slug", job.slug)
          .maybeSingle();

        if (sentCheckError) {
          return NextResponse.json(
            { error: `Sent check failed: ${sentCheckError.message}` },
            { status: 500 }
          );
        }

        if (!alreadySent) {
          unsentJobs.push(job);
        }
      }

      if (unsentJobs.length === 0) {
        debugResults.push({
          email: sub.email,
          matchedJobs: matches.length,
          newJobs: 0,
          sent: false,
        });
        continue;
      }

      const emailHtml = buildEmailHtml(unsentJobs);

      const emailResult = await resend.emails.send({
        from: fromEmail,
        to: sub.email,
        subject: `New NJ School Jobs for You (${unsentJobs.length})`,
        html: emailHtml,
      });

      if ((emailResult as { error?: unknown })?.error) {
        debugResults.push({
          email: sub.email,
          matchedJobs: matches.length,
          newJobs: unsentJobs.length,
          sent: false,
          error: (emailResult as { error?: unknown }).error,
        });
        continue;
      }

      const inserts = unsentJobs.map((job) => ({
        subscriber_email: sub.email,
        job_slug: job.slug,
      }));

      const { error: insertSentError } = await supabase
        .from("sent_job_alerts")
        .insert(inserts);

      if (insertSentError) {
        return NextResponse.json(
          { error: `Saving sent jobs failed: ${insertSentError.message}` },
          { status: 500 }
        );
      }

      debugResults.push({
        email: sub.email,
        matchedJobs: matches.length,
        newJobs: unsentJobs.length,
        sent: true,
      });
    }

    return NextResponse.json({
      success: true,
      totalSubscribers: subscribers?.length || 0,
      totalJobsInSystem: jobs.length,
      results: debugResults,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cron failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}