import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import {
  buildVerificationUrl,
  isValidEmail,
  shouldSendTransactionalEmails,
} from "@/app/lib/job-alerts";

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

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const body = await req.json();

    const email = String(body.email || "").trim().toLowerCase();
    const county = String(body.county || "").trim();
    const keyword = String(body.keyword || "").trim();
    const jobType = String(body.job_type || "").trim();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("job_alert_subscribers")
      .select(
        "id, email, county, keyword, job_type, unsubscribed_at, is_unsubscribed, status, verified_at, email_verified, is_verified"
      )
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      if (
        existing.unsubscribed_at ||
        existing.is_unsubscribed === true ||
        existing.status === "unsubscribed"
      ) {
        return NextResponse.json(
          {
            error:
              "This email has been unsubscribed. Please contact us to re-enroll.",
          },
          { status: 409 }
        );
      }

      if (
        existing.verified_at ||
        existing.email_verified === true ||
        existing.is_verified === true
      ) {
        return NextResponse.json(
          { error: "This email is already subscribed." },
          { status: 409 }
        );
      }

      const token = randomBytes(32).toString("hex");
      const { error: updateError } = await supabase
        .from("job_alert_subscribers")
        .update({
          county: county || existing.county || null,
          keyword: keyword || existing.keyword || null,
          job_type: jobType || existing.job_type || null,
          verification_token: token,
          email_verified: false,
          is_verified: false,
          verified_at: null,
          priority_status: "free",
        })
        .eq("email", email);

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      const resend =
        shouldSendTransactionalEmails() && resendApiKey && fromEmail
          ? new Resend(resendApiKey)
          : null;
      const canSend = Boolean(resend && fromEmail);

      if (canSend && resend && fromEmail) {
        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: "Confirm your NJSchoolCareers job alerts",
          html: `
            <div style="background:#f8fafc;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;">
              <div style="max-width:640px;margin:auto;background:#ffffff;border-radius:24px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 4px 14px rgba(15,23,42,0.06);">
                <div style="background:#eff6ff;padding:40px 40px 28px;border-bottom:1px solid #dbeafe;">
                  <div style="font-size:15px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#2563eb;margin-bottom:18px;">NJSchoolCareers</div>
                  <div style="font-size:32px;line-height:1.15;color:#020617;font-weight:800;margin-bottom:12px;">Confirm your email</div>
                  <div style="font-size:18px;color:#475569;line-height:1.7;">Please confirm that you want to receive free job alerts for New Jersey education roles.</div>
                </div>
                <div style="padding:40px;">
                  <p style="font-size:18px;line-height:1.8;color:#475569;">Click the button below to verify your email and begin receiving matches for your saved preferences.</p>
                  <div style="margin:26px 0;">
                    <a href="${buildVerificationUrl(email, token)}" style="display:inline-block;padding:14px 24px;border-radius:12px;background:#f97316;color:#ffffff;text-decoration:none;font-weight:700;">Confirm my email</a>
                  </div>
                  <p style="font-size:14px;line-height:1.8;color:#64748b;">If you did not request this, you can safely ignore this email.</p>
                </div>
              </div>
            </div>
          `,
        });
      }

      return NextResponse.json({
        success: true,
        verified: false,
        message: "Please check your email and confirm your subscription.",
      });
    }

    const token = randomBytes(32).toString("hex");
    const insertPayload = {
      email,
      county: county || null,
      keyword: keyword || null,
      job_type: jobType || null,
      priority_status: "free",
      verification_token: token,
      email_verified: false,
      is_verified: false,
      verified_at: null,
    };

    const { error: insertError } = await supabase
      .from("job_alert_subscribers")
      .insert([insertPayload]);

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    const resend =
      shouldSendTransactionalEmails() && resendApiKey && fromEmail
        ? new Resend(resendApiKey)
        : null;

    if (resend && fromEmail) {
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Confirm your NJSchoolCareers job alerts",
        html: `
          <div style="background:#f8fafc;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;">
            <div style="max-width:640px;margin:auto;background:#ffffff;border-radius:24px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 4px 14px rgba(15,23,42,0.06);">
              <div style="background:#eff6ff;padding:40px 40px 28px;border-bottom:1px solid #dbeafe;">
                <div style="font-size:15px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#2563eb;margin-bottom:18px;">NJSchoolCareers</div>
                <div style="font-size:32px;line-height:1.15;color:#020617;font-weight:800;margin-bottom:12px;">Confirm your email</div>
                <div style="font-size:18px;color:#475569;line-height:1.7;">Please confirm that you want to receive free matching job alerts.</div>
              </div>
              <div style="padding:40px;">
                <p style="font-size:18px;line-height:1.8;color:#475569;">Click the button below to verify your email and begin receiving free alerts for ${county} ${keyword} roles.</p>
                <div style="margin:26px 0;">
                  <a href="${buildVerificationUrl(email, token)}" style="display:inline-block;padding:14px 24px;border-radius:12px;background:#f97316;color:#ffffff;text-decoration:none;font-weight:700;">Confirm my email</a>
                </div>
                <p style="font-size:14px;line-height:1.8;color:#64748b;">If you did not request this, you can safely ignore this email.</p>
              </div>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      verified: false,
      message: "Please check your email and confirm your subscription.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
