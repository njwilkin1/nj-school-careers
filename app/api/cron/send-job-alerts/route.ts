import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { jobs } from "@/data/jobs";

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

    const debugResults: any[] = [];

    for (const sub of subscribers || []) {
      const matches = jobs.filter((job) => {
        const matchCounty =
          !sub.county ||
          String(job.county || "").toLowerCase().includes(String(sub.county || "").toLowerCase());

        const matchKeyword =
          !sub.keyword ||
          [
            job.title,
            job.district,
            job.location,
            job.overview,
            ...(job.responsibilities || []),
            ...(job.requirements || []),
          ]
            .join(" ")
            .toLowerCase()
            .includes(String(sub.keyword || "").toLowerCase());

        const matchType =
          !sub.job_type ||
          String(job.type || "").toLowerCase() === String(sub.job_type || "").toLowerCase();

        return matchCounty && matchKeyword && matchType;
      });

      const unsentJobs = [];

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

      const jobList = unsentJobs
        .map(
          (job) => `
            <li>
              <strong>${job.title}</strong> – ${job.district}<br/>
              ${job.location}<br/>
              <a href="${job.applyUrl}">Apply here</a>
            </li>
          `
        )
        .join("");

      const emailResult = await resend.emails.send({
        from: fromEmail,
        to: sub.email,
        subject: `New NJ School Jobs for You (${unsentJobs.length})`,
        html: `
          <h2>New Job Alerts</h2>
          <p>Here are new jobs matching your preferences:</p>
          <ul>${jobList}</ul>
          <p>— NJ School Careers</p>
        `,
      });

      if ((emailResult as any)?.error) {
        debugResults.push({
          email: sub.email,
          matchedJobs: matches.length,
          newJobs: unsentJobs.length,
          sent: false,
          error: (emailResult as any).error,
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