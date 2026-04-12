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

    // Check if already exists
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

    // Insert into DB
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

    // 📧 SEND CONFIRMATION EMAIL
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "You're subscribed to NJ School Careers",
      html: `
        <h2>You're subscribed 🎉</h2>
        <p>You’ll now receive job alerts based on your preferences:</p>
        <ul>
          <li><strong>County:</strong> ${county || "Any"}</li>
          <li><strong>Keyword:</strong> ${keyword || "Any"}</li>
          <li><strong>Job Type:</strong> ${jobType || "Any"}</li>
        </ul>
        <p>We’ll send you new NJ school jobs as they come in.</p>
        <br/>
        <p>— NJ School Careers</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}