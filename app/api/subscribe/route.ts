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
      <div style="background:#f8fafc;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
        <div style="max-width:620px;margin:auto;background:#ffffff;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;">

          <div style="background:#0f172a;padding:22px 28px;">
            <div style="color:white;font-size:22px;font-weight:700;">
              NJ School Careers
            </div>
            <div style="color:#cbd5e1;font-size:14px;margin-top:4px;">
              Job alerts for New Jersey educators
            </div>
          </div>

          <div style="padding:30px 28px;color:#0f172a;">
            <h2 style="margin-top:0;font-size:24px;">You’re subscribed 🎉</h2>

            <p style="font-size:16px;color:#475569;line-height:1.6;">
              You’re now signed up to receive job alerts that match your preferences.
            </p>

            <div style="background:#f1f5f9;padding:16px;border-radius:10px;margin:20px 0;line-height:1.8;">
              <div><strong>County:</strong> ${county || "Any"}</div>
              <div><strong>Keyword:</strong> ${keyword || "Any"}</div>
              <div><strong>Job Type:</strong> ${jobType || "Any"}</div>
            </div>

            <p style="font-size:15px;color:#475569;">
              We’ll email you as soon as new jobs match your criteria.
            </p>

            <a
              href="https://njschoolcareers.com"
              style="
                display:inline-block;
                margin-top:20px;
                background:#0f172a;
                color:white;
                padding:12px 20px;
                border-radius:8px;
                text-decoration:none;
                font-weight:600;
              "
            >
              Browse Jobs Now
            </a>
          </div>

          <div style="padding:18px 28px;font-size:13px;color:#94a3b8;border-top:1px solid #e2e8f0;line-height:1.6;">
            You’re receiving this email because you signed up at NJ School Careers.<br/>
            You can unsubscribe anytime from job alert emails.
          </div>

        </div>
      </div>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "You're subscribed to NJ School Careers",
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}