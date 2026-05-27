import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email =
      session.customer_details?.email ||
      session.customer_email ||
      "";

    const employerName =
      session.customer_details?.name ||
      "";

    if (!email) {
      return NextResponse.json({ error: "No customer email found" }, { status: 400 });
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    const productName = String(
      (lineItems.data[0]?.price?.product as Stripe.Product)?.name || ""
    );

    let planType = "single_job";
    let remainingPosts: number | null = 1;
    let unlimitedUntil: string | null = null;
    let hasFeatured = false;
    let hasUrgent = false;
    let hasSocial = false;

    if (productName.includes("Standard Job Posting")) {
      planType = "single_job";
      remainingPosts = 1;
    }

    if (productName.includes("Featured Job Visibility")) {
      planType = "single_job";
      remainingPosts = 1;
      hasFeatured = true;
    }

    if (productName.includes("Urgent Hiring Promotion")) {
      planType = "single_job";
      remainingPosts = 1;
      hasUrgent = true;
    }

    if (productName.includes("Social Media Promotion")) {
      planType = "single_job";
      remainingPosts = 1;
      hasSocial = true;
    }

    if (productName.includes("Monthly Unlimited Plan")) {
      planType = "monthly_unlimited";
      remainingPosts = null;

      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      unlimitedUntil = date.toISOString();
    }

    if (productName.includes("District Unlimited Plan")) {
      planType = "annual_unlimited";
      remainingPosts = null;

      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      unlimitedUntil = date.toISOString();
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from("employer_orders").insert({
      employer_name: employerName,
      employer_email: email.toLowerCase(),
      plan_type: planType,
      remaining_posts: remainingPosts,
      unlimited_until: unlimitedUntil,
      has_featured: hasFeatured,
      has_urgent: hasUrgent,
      has_social: hasSocial,
      stripe_payment_id: session.payment_intent?.toString() || null,
      stripe_customer_id: session.customer?.toString() || null,
      stripe_subscription_id: session.subscription?.toString() || null,
      payment_method: "stripe",
      status: "active",
      notes: `Created automatically from Stripe product: ${productName}`,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}