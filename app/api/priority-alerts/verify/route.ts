import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sessionId = String(body.sessionId || "").trim();

    if (!sessionId) {
      return NextResponse.json(
        { verified: false, error: "Missing Stripe session." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { verified: false },
        { status: 403 }
      );
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(
      session.id,
      {
        expand: ["data.price.product"],
      }
    );

    const productName = String(
      (lineItems.data[0]?.price?.product as Stripe.Product)?.name || ""
    );

    if (!productName.includes("Priority Job Alerts")) {
      return NextResponse.json(
        { verified: false },
        { status: 403 }
      );
    }

    return NextResponse.json({
      verified: true,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to verify purchase.";

    return NextResponse.json(
      { verified: false, error: message },
      { status: 500 }
    );
  }
}
