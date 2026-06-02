import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

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
  posted?: string;
  overview?: string;
  responsibilities?: string[];
  requirements?: string[];
};

function normalize(value: string | null | undefined): string {
  return String(value || "").trim().toLowerCase();
}

function buildJobCards(jobsToSend: Job[]): string {
  return jobsToSend
    .map((job) => {
      const jobUrl =
        job.applyUrl || `https://www.njschoolcareers.com/jobs/${job.slug}`;

      return `
        <div style="margin-bottom:18px;padding:22px;border:1px solid #e2e8f0;border-radius:18px;background:#ffffff;">
          <div style="font-size:21px;font-weight:800;color:#020617;margin-bottom:8px;line-height:1.3;">
            ${job.title}
          </div>

          <div style="font-size:15px;color:#334155;margin-bottom:6px;">
            <strong>${job.district}</strong>
          </div>

          ${
            job.posted
              ? `<div style="font-size:13px;color:#64748b;margin-bottom:8px;">
                   Posted ${new Date(job.posted).toLocaleDateString("en-US", {
                     month: "short",
                     day: "numeric",
                     year: "numeric",
                   })}
                 </div>`
              : ""
          }

          ${
            job.location || job.county || job.type
              ? `<div style="font-size:14px;color:#64748b;margin-bottom:16px;line-height:1.6;">
                   ${[job.location, job.county, job.type].filter(Boolean).join(" • ")}
                 </div>`
              : ""
          }

          ${
            job.overview
              ? `<div style="font-size:14px;line-height:1.7;color:#475569;margin-bottom:18px;">
                   ${job.overview}
                 </div>`
              : ""
          }

          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="border-radius:10px;background:#f97316;">
                <a
                  href="${jobUrl}"
                  style="display:inline-block;padding:12px 18px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px;"
                >
                  Apply Now
                </a>
              </td>
            </tr>
          </table>
        </div>
      `;
    })
    .join("");
}

function buildEmailHtml(
  jobsToSend: Job[],
  email: string,
  totalMatches: number
): string {
  const headingText =
    totalMatches > jobsToSend.length
      ? `We found ${totalMatches} matching New Jersey education jobs. Showing the ${jobsToSend.length} newest positions for your alert.`
      : jobsToSend.length === 1
        ? "We found 1 new New Jersey education job that matches your alert preferences."
        : `We found ${jobsToSend.length} new New Jersey education jobs that match your alert preferences.`;

  const unsubscribeUrl = `https://www.njschoolcareers.com/api/unsubscribe?email=${encodeURIComponent(
    email
  )}`;

  return `
    <div style="background:#f8fafc;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:680px;margin:auto;background:#ffffff;border-radius:24px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 4px 14px rgba(15,23,42,0.06);">
        <div style="background:#eff6ff;padding:40px 40px 28px;border-bottom:1px solid #dbeafe;">
          <div style="font-size:15px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#2563eb;margin-bottom:18px;">
            New Jersey Education Job Alerts
          </div>

          <div style="color:#020617;font-size:34px;line-height:1.1;font-weight:800;margin-bottom:18px;word-break:break-word;">
            NJSchoolCareers
          </div>

          <div style="font-size:20px;line-height:1.7;color:#475569;max-width:540px;">
            New school jobs matching your interests.
          </div>
        </div>

        <div style="padding:40px;">
          <h1 style="margin-top:0;margin-bottom:16px;font-size:32px;line-height:1.2;color:#020617;">
            New Jersey school jobs for you
          </h1>

          <p style="font-size:17px;line-height:1.8;color:#475569;margin-bottom:22px;">
            ${headingText}
          </p>

          <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:16px;padding:18px 20px;margin-bottom:28px;color:#92400e;line-height:1.7;font-size:15px;">
            Apply early. Many New Jersey school positions receive applications quickly.
          </div>

          ${buildJobCards(jobsToSend)}

          <div style="text-align:center;margin-top:30px;">
            <a
              href="https://www.njschoolcareers.com/jobs"
              style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:12px;font-size:15px;font-weight:700;"
            >
              Browse More NJ Jobs
            </a>
          </div>
        </div>

        <div style="padding:28px 40px;border-top:1px solid #e2e8f0;background:#f8fafc;">
          <div style="font-size:14px;line-height:1.8;color:#64748b;">
            NJSchoolCareers focuses exclusively on New Jersey education jobs.
          </div>

          <div style="margin-top:10px;font-size:14px;line-height:1.8;color:#64748b;">
            You are receiving this email because you subscribed to job alerts at NJSchoolCareers.com.
          </div>

          <div style="margin-top:12px;">
            <a href="${unsubscribeUrl}" style="color:#ef4444;text-decoration:none;font-size:14px;font-weight:600;">
              Unsubscribe
            </a>
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

    if (
      !supabaseUrl ||
      !supabaseServiceRoleKey ||
      !resendApiKey ||
      !fromEmail
    ) {
      return NextResponse.json(
        { error: "Missing environment variables." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const resend = new Resend(resendApiKey);

    const { data: manualJobs } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "published");

    const { data: importedJobs } = await supabase
      .from("job_imports")
      .select("*")
      .or("status.eq.new,status.eq.published,status.is.null");

    const allJobs: Job[] = [
      ...(manualJobs || []).map((job) => ({
        slug: job.slug || String(job.id || ""),
        title: job.title || "",
        district: job.district || "",
        location: job.city || job.location || "",
        county: job.county || "",
        type: job.type || "",
        posted: job.posted || job.created_at || "",
        applyUrl: job.applyUrl || job.apply_url || "",
      })),
      ...(importedJobs || []).map((job) => ({
        slug: job.slug || String(job.id || ""),
        title: job.title || "",
        district: job.district || "",
        location: job.city || job.location || "",
        county: job.county || "",
        type: job.position_type || job.type || "",
        posted: job.date_posted || job.created_at || "",
        applyUrl: job.apply_url || "",
      })),
    ];

    const { data: subscribers, error: subscriberError } = await supabase
      .from("job_alert_subscribers")
      .select("*");

    if (subscriberError) {
      return NextResponse.json(
        { error: `Subscriber fetch failed: ${subscriberError.message}` },
        { status: 500 }
      );
    }

    const debugResults = [];

    for (const sub of (subscribers || []) as Subscriber[]) {
      const matches = allJobs.filter((job) => {
        const matchCounty =
          !sub.county || normalize(job.county).includes(normalize(sub.county));

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

      const jobsToSend = unsentJobs
        .sort((a, b) => {
          const dateA = new Date(a.posted || 0).getTime();
          const dateB = new Date(b.posted || 0).getTime();
          return dateB - dateA;
        })
        .slice(0, 20);

      const emailHtml = buildEmailHtml(jobsToSend, sub.email, unsentJobs.length);

      const emailResult = await resend.emails.send({
        from: fromEmail,
        to: sub.email,
        subject: `${jobsToSend.length} New NJ Education Job${
          jobsToSend.length === 1 ? "" : "s"
        } Matching Your Alert`,
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

      const inserts = jobsToSend.map((job) => ({
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
      totalJobsInSystem: allJobs.length,
      results: debugResults,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cron failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}