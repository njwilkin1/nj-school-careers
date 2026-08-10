import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_TEST_WEBHOOK_SECRET!
    );

    console.log("TEST STRIPE WEBHOOK RECEIVED:", event.type);

    return NextResponse.json({
      received: true,
      event: event.type,
      test: true,
    });
  } catch (err: any) {
    console.error("Test webhook error:", err.message);

    return NextResponse.json(
      { error: `Webhook error: ${err.message}` },
      { status: 400 }
    );
  }
}