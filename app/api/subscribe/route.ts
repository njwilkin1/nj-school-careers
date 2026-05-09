import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.ALERTS_FROM_EMAIL;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: "Missing Supabase environment variables." },
        { status: 500 }
      );
    }

    if (!resendApiKey || !fromEmail) {
      return NextResponse.json(
        { error: "Missing Resend environment variables." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const resend = new Resend(resendApiKey);

    const body = await req.json();

    const email = String(body.email || "").trim().toLowerCase();
    const county = String(body.county || "").trim();
    const keyword = String(body.keyword || "").trim();
    const jobType = String(body.job_type || "").trim();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("job_alert_subscribers")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "This email is already subscribed." },
        { status: 409 }
      );
    }

    const { error: insertError } = await supabase
      .from("job_alert_subscribers")
      .insert([
        {
          email,
          county,
          keyword,
          job_type: jobType,
        },
      ]);

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    const html = `
      <div style="background:#f8fafc;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;">
        <div style="max-width:640px;margin:auto;background:#ffffff;border-radius:24px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 4px 14px rgba(15,23,42,0.06);">

          <div style="background:#eff6ff;padding:40px 40px 28px;border-bottom:1px solid #dbeafe;">
            <div style="font-size:15px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#2563eb;margin-bottom:18px;">
              New Jersey School Hiring
            </div>

            <div style="color:#020617;font-size:42px;line-height:1.05;font-weight:800;margin-bottom:18px;">
              NJSchoolCareers
            </div>

            <div style="font-size:20px;line-height:1.7;color:#475569;max-width:520px;">
              A faster way to get hired in New Jersey schools.
            </div>
          </div>

          <div style="padding:40px;">
            <h2 style="margin-top:0;margin-bottom:18px;font-size:34px;line-height:1.2;color:#020617;">
              You're subscribed 🎉
            </h2>

            <p style="font-size:18px;color:#475569;line-height:1.8;margin-bottom:28px;">
              You'll now receive new NJ education job openings directly in your inbox.
            </p>

            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:18px;padding:24px;margin-bottom:30px;">
              <div style="margin-bottom:12px;font-size:16px;color:#0f172a;">
                <strong>County:</strong> ${county || "All New Jersey counties"}
              </div>

              <div style="margin-bottom:12px;font-size:16px;color:#0f172a;">
                <strong>Keyword:</strong> ${keyword || "All education jobs"}
              </div>

              <div style="font-size:16px;color:#0f172a;">
                <strong>Job Type:</strong> ${jobType || "All job types"}
              </div>
            </div>

            <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:16px;padding:18px 20px;margin-bottom:32px;color:#92400e;line-height:1.7;font-size:15px;">
              New jobs are added regularly from school districts, charter schools,
              private schools, and education employers across New Jersey.
            </div>

            <a
              href="https://njschoolcareers.com/jobs"
              style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;padding:16px 30px;border-radius:14px;font-size:17px;font-weight:700;"
            >
              Browse NJ Jobs
            </a>
          </div>

          <div style="padding:28px 40px;border-top:1px solid #e2e8f0;background:#f8fafc;">
            <div style="font-size:14px;line-height:1.8;color:#64748b;">
              You're receiving this email because you subscribed to job alerts at NJSchoolCareers.com.
            </div>

            <div style="margin-top:10px;font-size:14px;color:#64748b;">
              No spam. Unsubscribe anytime.
            </div>
          </div>

        </div>
      </div>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "You're subscribed to NJSchoolCareers job alerts",
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}