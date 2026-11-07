import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isValidEmail } from "@/app/lib/job-alerts";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = String(searchParams.get("email") || "").trim().toLowerCase();
    const token = String(searchParams.get("token") || "").trim();

    if (!email || !token || !isValidEmail(email)) {
      return new Response(
        `
        <html>
          <head><title>Invalid verification link</title></head>
          <body style="font-family:Arial,sans-serif;padding:40px;background:#f8fafc;">
            <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e2e8f0;padding:32px;">
              <h2 style="margin-top:0;color:#0f172a;">Invalid verification link</h2>
              <p style="color:#475569;">This confirmation link is invalid or incomplete.</p>
            </div>
          </body>
        </html>
        `,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: "Missing Supabase environment variables." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { data: subscriber, error: lookupError } = await supabase
      .from("job_alert_subscribers")
      .select("id, email, verification_token, unsubscribed_at, is_unsubscribed, status, verified_at, email_verified, is_verified")
      .eq("email", email)
      .maybeSingle();

    if (lookupError) {
      return NextResponse.json(
        { error: lookupError.message },
        { status: 500 }
      );
    }

    if (!subscriber) {
      return new Response(
        `
        <html>
          <head><title>Not found</title></head>
          <body style="font-family:Arial,sans-serif;padding:40px;background:#f8fafc;">
            <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e2e8f0;padding:32px;">
              <h2 style="margin-top:0;color:#0f172a;">Subscriber not found</h2>
              <p style="color:#475569;">We could not find a matching email alert subscription.</p>
            </div>
          </body>
        </html>
        `,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    if (
      subscriber.unsubscribed_at ||
      subscriber.is_unsubscribed === true ||
      subscriber.status === "unsubscribed"
    ) {
      return new Response(
        `
        <html>
          <head><title>Subscription cancelled</title></head>
          <body style="font-family:Arial,sans-serif;padding:40px;background:#f8fafc;">
            <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e2e8f0;padding:32px;">
              <h2 style="margin-top:0;color:#0f172a;">Subscription cancelled</h2>
              <p style="color:#475569;">This email is unsubscribed and cannot be reactivated without a new signup.</p>
            </div>
          </body>
        </html>
        `,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    if (subscriber.verification_token !== token) {
      return new Response(
        `
        <html>
          <head><title>Verification failed</title></head>
          <body style="font-family:Arial,sans-serif;padding:40px;background:#f8fafc;">
            <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e2e8f0;padding:32px;">
              <h2 style="margin-top:0;color:#0f172a;">Verification failed</h2>
              <p style="color:#475569;">The confirmation token does not match this subscriber.</p>
            </div>
          </body>
        </html>
        `,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    const { error: updateError } = await supabase
      .from("job_alert_subscribers")
      .update({
        verified_at: new Date().toISOString(),
        email_verified: true,
        is_verified: true,
        verification_token: null,
      })
      .eq("email", email);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return new Response(
      `
      <html>
        <head><title>Email confirmed</title></head>
        <body style="font-family:Arial,sans-serif;padding:40px;background:#f8fafc;">
          <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #e2e8f0;padding:32px;">
            <h2 style="margin-top:0;color:#0f172a;">Email confirmed</h2>
            <p style="color:#475569;">Your free NJSchoolCareers job alerts subscription is active. We’ll send matching alerts to this address after verification.</p>
          </div>
        </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
