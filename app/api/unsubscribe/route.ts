import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Missing email parameter." },
        { status: 400 }
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

    // Delete the subscriber
    const { error } = await supabase
      .from("job_alert_subscribers")
      .delete()
      .eq("email", email);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Return a simple confirmation page
    return new Response(
      `
      <html>
        <head>
          <title>Unsubscribed</title>
        </head>
        <body style="font-family: Arial; padding: 40px; background:#f8fafc;">
          <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:12px;border:1px solid #e2e8f0;">
            <h2 style="color:#0f172a;">You’re unsubscribed</h2>
            <p style="color:#475569;">
              You will no longer receive NJ School Careers job alerts.
            </p>
          </div>
        </body>
      </html>
      `,
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Unsubscribe failed." },
      { status: 500 }
    );
  }
}