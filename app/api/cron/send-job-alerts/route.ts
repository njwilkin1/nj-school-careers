import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { jobs } from "@/data/jobs";

export async function GET(req: Request) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const resend = new Resend(process.env.RESEND_API_KEY!);

    const { data: subscribers, error } = await supabase
      .from("job_alert_subscribers")
      .select("*");

    if (error) throw error;

    for (const sub of subscribers) {
      const matches = jobs.filter((job) => {
        const matchCounty =
          !sub.county || job.county?.includes(sub.county);

        const matchKeyword =
          !sub.keyword ||
          job.title.toLowerCase().includes(sub.keyword.toLowerCase());

        const matchType =
          !sub.job_type || job.type === sub.job_type;

        return matchCounty && matchKeyword && matchType;
      });

      const newJobs = [];

      for (const job of matches) {
        const { data: alreadySent } = await supabase
          .from("sent_job_alerts")
          .select("id")
          .eq("subscriber_email", sub.email)
          .eq("job_slug", job.slug)
          .maybeSingle();

        if (!alreadySent) {
          newJobs.push(job);
        }
      }

      if (newJobs.length === 0) continue;

      // Build email HTML
      const jobList = newJobs
        .map(
          (job) => `
            <li>
              <strong>${job.title}</strong> – ${job.district}<br/>
              <a href="${job.applyUrl}">Apply here</a>
            </li>
          `
        )
        .join("");

      await resend.emails.send({
        from: process.env.ALERTS_FROM_EMAIL!,
        to: sub.email,
        subject: "New NJ School Jobs for You",
        html: `
          <h2>New Job Alerts 🎯</h2>
          <p>Here are new jobs matching your preferences:</p>
          <ul>${jobList}</ul>
          <br/>
          <p>— NJ School Careers</p>
        `,
      });

      // Save sent jobs
      const inserts = newJobs.map((job) => ({
        subscriber_email: sub.email,
        job_slug: job.slug,
      }));

      await supabase.from("sent_job_alerts").insert(inserts);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}