import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const sessionId = String(body.sessionId || "").trim();
    const county = String(body.county || "").trim();
    const keyword = String(body.keyword || "").trim();
    const jobType = String(body.job_type || "").trim();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing Stripe session." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment has not been completed." },
        { status: 403 }
      );
    }

    const email =
      session.customer_details?.email ||
      session.customer_email ||
      "";

    if (!email) {
      return NextResponse.json(
        { error: "No customer email found." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const normalizedEmail = email.toLowerCase();

    const { error: upsertError } = await supabase
      .from("job_alert_subscribers")
      .upsert(
        {
          email: normalizedEmail,
          county: county || null,
          keyword: keyword || null,
          job_type: jobType || null,
          priority_status: "active",
          stripe_customer_id: session.customer?.toString() || null,
          stripe_subscription_id:
            session.subscription?.toString() || null,
        },
        {
          onConflict: "email",
        }
      );

    if (upsertError) {
      return NextResponse.json(
        { error: upsertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save preferences.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
