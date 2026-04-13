import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return new Response("Missing email", { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from("job_alert_subscribers")
    .delete()
    .eq("email", email);

  if (error) {
    return new Response("Error unsubscribing", { status: 500 });
  }

  return new Response(
    `
    <html>
      <body style="font-family: Arial; padding:40px;">
        <h2>You have been unsubscribed.</h2>
        <p>You will no longer receive job alerts.</p>
      </body>
    </html>
    `,
    { headers: { "Content-Type": "text/html" } }
  );
}