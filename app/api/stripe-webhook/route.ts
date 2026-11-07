import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import {
  extendEmployerAccessForPaidInvoice,
  getEmployerProductPlan,
  isEmployerAccessActive,
  isPaidCheckoutSession,
  recordEmployerCheckout,
  resolveEmployerSubscriptionAccess,
  type RpcExecutor,
} from "./employer-billing";

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

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid webhook signature";
    return NextResponse.json(
      { error: `Webhook error: ${message}` },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const rpc: RpcExecutor = async (functionName, parameters) => {
    const { data, error } = await supabase.rpc(functionName, parameters);
    return { data, error };
  };

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice & {
      subscription?: string | Stripe.Subscription | null;
    };

    try {
      const result = await extendEmployerAccessForPaidInvoice(
        rpc,
        event.id,
        invoice
      );

      if (result === "unmatched") {
        console.error(
          "Employer renewal invoice has no recorded subscription order; asking Stripe to retry."
        );

        return NextResponse.json(
          { error: "Employer subscription order is not available yet." },
          { status: 500 }
        );
      }

      return NextResponse.json({ received: true, renewal: result });
    } catch (error) {
      console.error("Employer subscription renewal processing failed:", error);

      return NextResponse.json(
        { error: "Employer subscription renewal processing failed." },
        { status: 500 }
      );
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    const { data: employerOrders, error: lookupError } = await supabase
      .from("employer_orders")
      .select("id, status, unlimited_until, remaining_posts, stripe_subscription_id")
      .eq("stripe_subscription_id", subscription.id)
      .neq("status", "used");

    if (lookupError) {
      console.error("Employer subscription cancellation lookup error:", lookupError);
      return NextResponse.json(
        { error: lookupError.message },
        { status: 500 }
      );
    }

    for (const order of employerOrders ?? []) {
      const accessStillActive = isEmployerAccessActive(order);
      const paidThrough = order.unlimited_until
        ? new Date(order.unlimited_until).getTime()
        : null;

      if (!accessStillActive && paidThrough === null) {
        const { error: updateError } = await supabase
          .from("employer_orders")
          .update({
            status: "expired",
            unlimited_until: null,
          })
          .eq("id", order.id);

        if (updateError) {
          console.error("Employer cancellation expiry update error:", updateError);
        }
      } else if (paidThrough && paidThrough > Date.now()) {
        const { error: updateError } = await supabase
          .from("employer_orders")
          .update({
            status: "active",
            unlimited_until: new Date(paidThrough).toISOString(),
          })
          .eq("id", order.id);

        if (updateError) {
          console.error("Employer paid-through cancellation update error:", updateError);
        }
      }
    }

    const { error } = await supabase
      .from("job_alert_subscribers")
      .update({
        priority_status: "free",
        stripe_subscription_id: null,
      })
      .eq("stripe_subscription_id", subscription.id);

    if (error) {
      console.error("Priority cancellation update error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ received: true });
  }

  // Priority Alerts cancellation
  // intentionally handled in the employer subscription deletion branch above

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const subscriptionWithPeriod = subscription as Stripe.Subscription & {
      current_period_end?: number | null;
    };
    const currentPeriodEnd = subscriptionWithPeriod.current_period_end
      ? new Date(subscriptionWithPeriod.current_period_end * 1000)
      : null;

    const { data: employerOrders, error: lookupError } = await supabase
      .from("employer_orders")
      .select("id, status, unlimited_until, remaining_posts, stripe_subscription_id")
      .eq("stripe_subscription_id", subscription.id)
      .neq("status", "used");

    if (lookupError) {
      console.error("Employer subscription update lookup error:", lookupError);
      return NextResponse.json(
        { error: lookupError.message },
        { status: 500 }
      );
    }

    for (const order of employerOrders ?? []) {
      const nextState = resolveEmployerSubscriptionAccess({
        currentStatus: order.status,
        unlimitedUntil: order.unlimited_until,
        paidThroughTimestamp: currentPeriodEnd ? Math.floor(currentPeriodEnd.getTime() / 1000) : null,
        eventType: "customer.subscription.updated",
      });

      const { error: updateError } = await supabase
        .from("employer_orders")
        .update({
          status: nextState.status,
          unlimited_until: nextState.unlimited_until,
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("Employer subscription update status error:", updateError);
      }
    }

    return NextResponse.json({ received: true });
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice & {
      subscription?: string | Stripe.Subscription | null;
    };
    const subscriptionId =
      typeof invoice.subscription === "string"
        ? invoice.subscription
        : invoice.subscription?.id ?? null;

    if (!subscriptionId) {
      return NextResponse.json({ received: true });
    }

    const { data: employerOrders, error: lookupError } = await supabase
      .from("employer_orders")
      .select("id, status, unlimited_until, remaining_posts, stripe_subscription_id")
      .eq("stripe_subscription_id", subscriptionId)
      .neq("status", "used");

    if (lookupError) {
      console.error("Employer failed payment lookup error:", lookupError);
      return NextResponse.json(
        { error: lookupError.message },
        { status: 500 }
      );
    }

    for (const order of employerOrders ?? []) {
      const nextState = resolveEmployerSubscriptionAccess({
        currentStatus: order.status,
        unlimitedUntil: order.unlimited_until,
        paidThroughTimestamp: invoice.period_end,
        eventType: "invoice.payment_failed",
      });

      const { error: updateError } = await supabase
        .from("employer_orders")
        .update({
          status: nextState.status,
          unlimited_until: nextState.unlimited_until,
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("Employer failed payment status update error:", updateError);
      }
    }

    return NextResponse.json({ received: true });
  }

  // Successful Stripe checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (!isPaidCheckoutSession(session)) {
      console.warn("Employer checkout is not paid; ignoring session.", {
        sessionId: session.id,
        paymentStatus: session.payment_status,
      });
      return NextResponse.json({ received: true, ignored: "unpaid" });
    }

    const email =
      session.customer_details?.email ||
      session.customer_email ||
      "";

    const employerName =
      session.customer_details?.name ||
      "";

    if (!email) {
      return NextResponse.json(
        { error: "No customer email found" },
        { status: 400 }
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

    // Priority Job Alerts purchase
    if (productName.includes("Priority Job Alerts")) {
      const normalizedEmail = email.toLowerCase();

      const { data: existing, error: lookupError } = await supabase
        .from("job_alert_subscribers")
        .select("id")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (lookupError) {
        console.error("Priority subscriber lookup error:", lookupError);

        return NextResponse.json(
          { error: lookupError.message },
          { status: 500 }
        );
      }

      if (existing) {
        const { error: updateError } = await supabase
          .from("job_alert_subscribers")
          .update({
            priority_status: "active",
            stripe_customer_id: session.customer?.toString() || null,
            stripe_subscription_id:
              session.subscription?.toString() || null,
          })
          .eq("id", existing.id);

        if (updateError) {
          console.error("Priority subscriber update error:", updateError);

          return NextResponse.json(
            { error: updateError.message },
            { status: 500 }
          );
        }
      } else {
        const { error: insertError } = await supabase
          .from("job_alert_subscribers")
          .insert({
            email: normalizedEmail,
            county: null,
            keyword: null,
            job_type: null,
            priority_status: "active",
            stripe_customer_id: session.customer?.toString() || null,
            stripe_subscription_id:
              session.subscription?.toString() || null,
          });

        if (insertError) {
          console.error("Priority subscriber insert error:", insertError);

          return NextResponse.json(
            { error: insertError.message },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({ received: true });
    }

    const productPlan = getEmployerProductPlan(productName);

    if (!productPlan) {
      console.warn("Rejected employer checkout for unknown product name.", {
        sessionId: session.id,
        productName,
      });
      return NextResponse.json({ received: true, ignored: "unrecognized-product" });
    }

    const subscriptionId = getStripeReferenceId(session.subscription);
    let unlimitedUntil: string | null = null;

    if (productPlan.requiresSubscriptionPeriod) {
      if (!subscriptionId) {
        console.error("Recurring employer checkout has no Stripe subscription ID.");

        return NextResponse.json(
          { error: "Recurring employer checkout is missing its subscription." },
          { status: 500 }
        );
      }

      try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const periodEnd = Math.max(
          ...subscription.items.data.map((item) => item.current_period_end)
        );

        if (!Number.isFinite(periodEnd) || periodEnd <= 0) {
          throw new Error("Stripe subscription has no current billing-period end.");
        }

        unlimitedUntil = new Date(periodEnd * 1000).toISOString();
      } catch (error) {
        console.error("Unable to read initial subscription period:", error);

        return NextResponse.json(
          { error: "Unable to read the employer subscription period." },
          { status: 500 }
        );
      }
    }

    try {
      await recordEmployerCheckout(rpc, {
        eventId: event.id,
        productName,
        employerName,
        employerEmail: email,
        paymentId: getStripeReferenceId(session.payment_intent) || session.id,
        customerId: getStripeReferenceId(session.customer),
        subscriptionId,
        unlimitedUntil,
      });
    } catch (error) {
      console.error("Employer checkout processing failed:", error);

      return NextResponse.json(
        { error: "Employer checkout processing failed." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

function getStripeReferenceId(
  value: string | { id: string } | null | undefined
): string | null {
  if (typeof value === "string") return value;
  return value?.id ?? null;
}