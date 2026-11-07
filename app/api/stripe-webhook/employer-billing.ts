export type RpcResult = {
  data: unknown;
  error: unknown;
};

export type RpcExecutor = (
  functionName: string,
  parameters: Record<string, unknown>
) => PromiseLike<RpcResult>;

export type EmployerProductPlan = {
  planType: string;
  remainingPosts: number | null;
  hasFeatured: boolean;
  hasUrgent: boolean;
  hasSocial: boolean;
  requiresSubscriptionPeriod: boolean;
};

export function getEmployerProductPlan(productName: string): EmployerProductPlan | null {
  const normalized = String(productName || "").trim();

  if (!normalized) {
    return null;
  }

  const lower = normalized.toLowerCase();

  if (lower.includes("standard job posting")) {
    return {
      planType: "single_job",
      remainingPosts: 1,
      hasFeatured: false,
      hasUrgent: false,
      hasSocial: false,
      requiresSubscriptionPeriod: false,
    };
  }

  if (lower.includes("featured job visibility")) {
    return {
      planType: "single_job",
      remainingPosts: 1,
      hasFeatured: true,
      hasUrgent: false,
      hasSocial: false,
      requiresSubscriptionPeriod: false,
    };
  }

  if (lower.includes("urgent hiring promotion")) {
    return {
      planType: "single_job",
      remainingPosts: 1,
      hasFeatured: false,
      hasUrgent: true,
      hasSocial: false,
      requiresSubscriptionPeriod: false,
    };
  }

  return null;
}

function rpcErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return String(error);
}

async function callRpc(
  rpc: RpcExecutor,
  functionName: string,
  parameters: Record<string, unknown>
): Promise<unknown> {
  const { data, error } = await rpc(functionName, parameters);

  if (error) {
    throw new Error(`${functionName} failed: ${rpcErrorMessage(error)}`);
  }

  return data;
}

export type EmployerCheckoutInput = {
  eventId: string;
  productName: string;
  employerName: string;
  employerEmail: string;
  paymentId: string | null;
  customerId: string | null;
  subscriptionId: string | null;
  unlimitedUntil: string | null;
};

export async function recordEmployerCheckout(
  rpc: RpcExecutor,
  input: EmployerCheckoutInput
): Promise<"created" | "duplicate"> {
  const plan = getEmployerProductPlan(input.productName);

  if (!plan) {
    throw new Error("Unrecognized employer product: cannot create employer access.");
  }

  if (plan.requiresSubscriptionPeriod && !input.unlimitedUntil) {
    throw new Error("A subscription period end is required for unlimited plans.");
  }

  const result = await callRpc(rpc, "record_employer_checkout", {
    p_event_id: input.eventId,
    p_employer_name: input.employerName,
    p_employer_email: input.employerEmail.trim().toLowerCase(),
    p_plan_type: plan.planType,
    p_remaining_posts: plan.remainingPosts,
    p_unlimited_until: input.unlimitedUntil,
    p_has_featured: plan.hasFeatured,
    p_has_urgent: plan.hasUrgent,
    p_has_social: plan.hasSocial,
    p_stripe_payment_id: input.paymentId,
    p_stripe_customer_id: input.customerId,
    p_stripe_subscription_id: input.subscriptionId,
    p_payment_method: "stripe",
    p_notes: `Created automatically from Stripe product: ${input.productName}`,
  });

  if (result !== "created" && result !== "duplicate") {
    throw new Error("Unexpected result recording employer checkout.");
  }

  return result;
}

export type PaidInvoice = {
  billing_reason: string | null;
  period_end: number | null;
  parent?: {
    subscription_details?: {
      subscription?: string | { id: string } | null;
    } | null;
  } | null;
  subscription?: string | { id: string } | null;
};

function stripeObjectId(value: string | { id: string } | null | undefined): string | null {
  if (typeof value === "string") return value;
  return value?.id ?? null;
}

export async function extendEmployerAccessForPaidInvoice(
  rpc: RpcExecutor,
  eventId: string,
  invoice: PaidInvoice
): Promise<"ignored" | "extended" | "duplicate" | "unmatched"> {
  if (invoice.billing_reason !== "subscription_cycle") {
    return "ignored";
  }

  const subscription =
    invoice.parent?.subscription_details?.subscription ?? invoice.subscription;
  const subscriptionId = stripeObjectId(subscription);

  if (!subscriptionId || !invoice.period_end || invoice.period_end <= 0) {
    throw new Error("Paid renewal invoice is missing its subscription or period end.");
  }

  const periodEnd = new Date(invoice.period_end * 1000);
  if (Number.isNaN(periodEnd.getTime())) {
    throw new Error("Paid renewal invoice has an invalid period end.");
  }

  const result = await callRpc(rpc, "extend_employer_subscription_access", {
    p_event_id: eventId,
    p_stripe_subscription_id: subscriptionId,
    p_period_end: periodEnd.toISOString(),
  });

  if (result !== "extended" && result !== "duplicate" && result !== "unmatched") {
    throw new Error("Unexpected result extending employer subscription access.");
  }

  return result;
}

export type EmployerAccessSnapshot = {
  status?: string | null;
  remaining_posts?: number | null;
  unlimited_until?: string | null;
};

export function isEmployerAccessActive(
  order: EmployerAccessSnapshot
): boolean {
  const status = String(order.status ?? "").trim().toLowerCase();
  const hasRemainingPosts =
    typeof order.remaining_posts === "number" && order.remaining_posts > 0;

  const unlimitedUntil = order.unlimited_until
    ? new Date(order.unlimited_until)
    : null;
  const hasUnlimitedAccess =
    Boolean(unlimitedUntil) &&
    !Number.isNaN(unlimitedUntil!.getTime()) &&
    unlimitedUntil!.getTime() > Date.now();

  if (!status && !hasRemainingPosts && !hasUnlimitedAccess) {
    return false;
  }

  return status === "active" || hasRemainingPosts || hasUnlimitedAccess;
}

export function resolveEmployerSubscriptionAccess({
  currentStatus,
  unlimitedUntil,
  paidThroughTimestamp,
  eventType,
}: {
  currentStatus?: string | null;
  unlimitedUntil?: string | null;
  paidThroughTimestamp?: number | null;
  eventType?: "customer.subscription.deleted" | "customer.subscription.updated" | "invoice.payment_failed" | "invoice.paid" | "checkout.session.completed" | string;
}): { status: string; unlimited_until: string | null; isActive: boolean } {
  const now = Date.now();
  const candidateEnd = paidThroughTimestamp
    ? new Date(paidThroughTimestamp * 1000)
    : unlimitedUntil
      ? new Date(unlimitedUntil)
      : null;

  const effectiveExpiry =
    candidateEnd && !Number.isNaN(candidateEnd.getTime()) ? candidateEnd : null;
  const isPaidThrough = effectiveExpiry ? effectiveExpiry.getTime() > now : false;

  if (eventType === "customer.subscription.deleted" || eventType === "customer.subscription.updated") {
    if (isPaidThrough) {
      return {
        status: "active",
        unlimited_until: effectiveExpiry!.toISOString(),
        isActive: true,
      };
    }

    return {
      status: "expired",
      unlimited_until: effectiveExpiry ? effectiveExpiry.toISOString() : null,
      isActive: false,
    };
  }

  if (eventType === "invoice.payment_failed") {
    if (isPaidThrough) {
      return {
        status: "active",
        unlimited_until: effectiveExpiry!.toISOString(),
        isActive: true,
      };
    }

    return {
      status: "expired",
      unlimited_until: effectiveExpiry ? effectiveExpiry.toISOString() : null,
      isActive: false,
    };
  }

  if (eventType === "invoice.paid" || eventType === "checkout.session.completed") {
    if (effectiveExpiry && effectiveExpiry.getTime() > now) {
      return {
        status: "active",
        unlimited_until: effectiveExpiry.toISOString(),
        isActive: true,
      };
    }

    return {
      status: String(currentStatus ?? "active").trim().toLowerCase() || "active",
      unlimited_until: effectiveExpiry ? effectiveExpiry.toISOString() : null,
      isActive: !!effectiveExpiry && effectiveExpiry.getTime() > now,
    };
  }

  if (currentStatus && currentStatus.toLowerCase() === "expired") {
    return {
      status: "expired",
      unlimited_until: effectiveExpiry ? effectiveExpiry.toISOString() : null,
      isActive: false,
    };
  }

  return {
    status: String(currentStatus ?? "active").trim().toLowerCase() || "active",
    unlimited_until: effectiveExpiry ? effectiveExpiry.toISOString() : null,
    isActive: isPaidThrough,
  };
}

export function isPaidCheckoutSession(
  session: { payment_status?: string | null } | null | undefined
): boolean {
  return String(session?.payment_status ?? "").trim().toLowerCase() === "paid";
}
