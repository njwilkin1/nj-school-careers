export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export function shouldSendVerificationEmails(): boolean {
  if (process.env.NODE_ENV !== "production") {
    return false;
  }

  return process.env.ALLOW_VERIFICATION_EMAILS === "true";
}

export function shouldSendDailyJobAlertEmails(): boolean {
  if (process.env.NODE_ENV !== "production") {
    return false;
  }

  return process.env.ALLOW_JOB_ALERT_EMAILS === "true";
}

export function shouldSendTransactionalEmails(): boolean {
  return shouldSendDailyJobAlertEmails();
}

export function buildVerificationUrl(email: string, token: string): string {
  const safeEmail = encodeURIComponent(String(email || "").trim().toLowerCase());
  const safeToken = encodeURIComponent(String(token || "").trim());
  return `https://www.njschoolcareers.com/api/subscribe/verify?email=${safeEmail}&token=${safeToken}`;
}

export function isVerifiedSubscriber(subscriber?: {
  verified_at?: string | null;
  email_verified?: boolean | null;
  is_verified?: boolean | null;
  verified?: boolean | null;
} | null): boolean {
  if (!subscriber) {
    return false;
  }

  return Boolean(
    subscriber.verified_at ||
      subscriber.email_verified === true ||
      subscriber.is_verified === true ||
      subscriber.verified === true
  );
}

export function isEligibleAlertSubscriber(subscriber?: {
  email?: string | null;
  unsubscribed_at?: string | null;
  is_unsubscribed?: boolean | null;
  status?: string | null;
  verified_at?: string | null;
  email_verified?: boolean | null;
  is_verified?: boolean | null;
  verified?: boolean | null;
} | null): boolean {
  if (!subscriber || !subscriber.email || !isValidEmail(subscriber.email)) {
    return false;
  }

  if (
    subscriber.unsubscribed_at ||
    subscriber.is_unsubscribed === true ||
    subscriber.status === "unsubscribed"
  ) {
    return false;
  }

  return isVerifiedSubscriber(subscriber);
}
