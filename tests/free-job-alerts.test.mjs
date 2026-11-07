import assert from "node:assert/strict";
import test from "node:test";
import { isEligibleAlertSubscriber } from "../app/lib/job-alerts.ts";
import { openDirectApplication } from "../app/utils/direct-application.ts";

function createMemoryStore(initial = {}) {
  const state = {
    jobs: initial.jobs ?? [],
    subscribers: initial.subscribers ?? [],
    sentJobAlerts: initial.sentJobAlerts ?? [],
    sentEmails: [],
  };

  function findSubscriber(email) {
    return state.subscribers.find((item) => item.email === email.toLowerCase());
  }

  function createVerificationToken() {
    return `token-${Math.random().toString(36).slice(2, 10)}`;
  }

  async function signup({ email, county, keyword, jobType }) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new Error("Valid email is required.");
    }

    const existing = findSubscriber(normalizedEmail);
    if (existing) {
      if (existing.unsubscribed_at || existing.is_unsubscribed || existing.status === "unsubscribed") {
        throw new Error("This email has been unsubscribed. Please contact us to re-enroll.");
      }

      if (existing.verified_at || existing.email_verified === true || existing.is_verified === true) {
        throw new Error("This email is already subscribed.");
      }

      const token = createVerificationToken();
      existing.county = county || existing.county || null;
      existing.keyword = keyword || existing.keyword || null;
      existing.job_type = jobType || existing.job_type || null;
      existing.verification_token = token;
      existing.email_verified = false;
      existing.is_verified = false;
      existing.verified_at = null;
      existing.priority_status = "free";

      const link = `https://www.njschoolcareers.com/api/subscribe/verify?email=${encodeURIComponent(normalizedEmail)}&token=${encodeURIComponent(token)}`;
      state.sentEmails.push({ to: normalizedEmail, html: link, subject: "Confirm your NJSchoolCareers job alerts" });
      return { success: true, verified: false, message: "Please check your email and confirm your subscription.", verificationLink: link, subscriber: existing };
    }

    const token = createVerificationToken();
    const subscriber = {
      id: state.subscribers.length + 1,
      email: normalizedEmail,
      county: county || null,
      keyword: keyword || null,
      job_type: jobType || null,
      priority_status: "free",
      verification_token: token,
      email_verified: false,
      is_verified: false,
      verified_at: null,
      unsubscribed_at: null,
      is_unsubscribed: false,
      status: "active",
    };

    state.subscribers.push(subscriber);
    const link = `https://www.njschoolcareers.com/api/subscribe/verify?email=${encodeURIComponent(normalizedEmail)}&token=${encodeURIComponent(token)}`;
    state.sentEmails.push({ to: normalizedEmail, html: link, subject: "Confirm your NJSchoolCareers job alerts" });
    return { success: true, verified: false, message: "Please check your email and confirm your subscription.", verificationLink: link, subscriber };
  }

  async function verify({ email, token }) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const subscriber = findSubscriber(normalizedEmail);
    if (!subscriber) {
      throw new Error("Subscriber not found");
    }

    if (subscriber.unsubscribed_at || subscriber.is_unsubscribed || subscriber.status === "unsubscribed") {
      throw new Error("Subscription cancelled");
    }

    if (subscriber.verification_token !== token) {
      throw new Error("Verification failed");
    }

    subscriber.verified_at = new Date().toISOString();
    subscriber.email_verified = true;
    subscriber.is_verified = true;
    subscriber.verification_token = null;
    return { success: true, verified: true, subscriber };
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  async function runCron() {
    const results = [];

    for (const subscriber of state.subscribers) {
      if (!isEligibleAlertSubscriber(subscriber)) {
        continue;
      }

      const matches = state.jobs.filter((job) => {
        const countyMatches = !subscriber.county || normalize(job.county).includes(normalize(subscriber.county));
        const haystack = [job.title, job.district, job.location, job.overview || "", ...(job.responsibilities || []), ...(job.requirements || [])].join(" ").toLowerCase();
        const keywordMatches = !subscriber.keyword || haystack.includes(normalize(subscriber.keyword));
        const typeMatches = !subscriber.job_type || normalize(job.type) === normalize(subscriber.job_type);
        return countyMatches && keywordMatches && typeMatches;
      });

      const unsentJobs = [];
      for (const job of matches) {
        const alreadySent = state.sentJobAlerts.some(
          (entry) => entry.subscriber_email === subscriber.email && entry.job_slug === job.slug
        );
        if (!alreadySent) {
          unsentJobs.push(job);
        }
      }

      if (unsentJobs.length === 0) {
        continue;
      }

      const jobsToSend = unsentJobs
        .slice()
        .sort((a, b) => new Date(b.posted || 0).getTime() - new Date(a.posted || 0).getTime())
        .slice(0, 20);

      state.sentEmails.push({
        to: subscriber.email,
        html: `Matching jobs: ${jobsToSend.map((job) => job.slug).join(",")}`,
        subject: "New NJ Education Job Matching Your Alert",
      });

      for (const job of jobsToSend) {
        state.sentJobAlerts.push({ subscriber_email: subscriber.email, job_slug: job.slug });
      }

      results.push({ subscriber: subscriber.email, sent: jobsToSend.length });
    }

    return { success: true, results };
  }

  return { state, signup, verify, runCron };
}

test("free alert signup creates an unverified subscriber and generates a confirmation link", async () => {
  const store = createMemoryStore({
    jobs: [
      {
        slug: "math-teacher",
        title: "Math Teacher",
        district: "Demo District",
        city: "Hackensack",
        county: "Bergen",
        type: "teacher",
        posted: "2026-11-01T00:00:00.000Z",
        overview: "Teach mathematics to middle school students.",
        responsibilities: ["Instruction", "Parent communication"],
        requirements: ["NJ certification"],
      },
    ],
  });

  const result = await store.signup({
    email: "jobseeker@example.com",
    county: "Bergen",
    keyword: "math",
    jobType: "teacher",
  });

  assert.equal(result.success, true);
  assert.equal(result.verified, false);
  assert.equal(store.state.subscribers.length, 1);
  assert.equal(store.state.subscribers[0].email, "jobseeker@example.com");
  assert.equal(store.state.subscribers[0].email_verified, false);
  assert.equal(store.state.subscribers[0].is_verified, false);
  assert.ok(store.state.subscribers[0].verification_token);
  assert.equal(store.state.sentEmails.length, 1);
  assert.match(store.state.sentEmails[0].html, /api\/subscribe\/verify\?email=jobseeker%40example.com/);
});

test("verification marks the subscriber as verified and eligible for matching job alerts", async () => {
  const store = createMemoryStore();
  const signedUp = await store.signup({
    email: "verified@example.com",
    county: "Essex",
    keyword: "science",
    jobType: "teacher",
  });

  const verification = await store.verify({
    email: "verified@example.com",
    token: signedUp.subscriber.verification_token,
  });

  assert.equal(verification.success, true);
  assert.equal(verification.verified, true);
  assert.equal(store.state.subscribers[0].email_verified, true);
  assert.equal(store.state.subscribers[0].is_verified, true);
  assert.ok(store.state.subscribers[0].verified_at);
  assert.equal(store.state.subscribers[0].verification_token, null);
  assert.equal(isEligibleAlertSubscriber(store.state.subscribers[0]), true);

  const unverified = {
    email: "unverified@example.com",
    verified_at: null,
    email_verified: false,
    is_verified: false,
    is_unsubscribed: false,
    status: "active",
  };
  const unsubscribed = {
    email: "unsubscribed@example.com",
    verified_at: new Date().toISOString(),
    email_verified: true,
    is_verified: true,
    unsubscribed_at: new Date().toISOString(),
    is_unsubscribed: true,
    status: "unsubscribed",
  };

  assert.equal(isEligibleAlertSubscriber(unverified), false);
  assert.equal(isEligibleAlertSubscriber(unsubscribed), false);
});

test("verified subscribers get matching job alerts while unverified and unsubscribed records remain ineligible", async () => {
  const store = createMemoryStore({
    jobs: [
      {
        slug: "math-teacher",
        title: "Math Teacher",
        district: "Demo District",
        city: "Hackensack",
        county: "Bergen",
        type: "teacher",
        posted: "2026-11-01T00:00:00.000Z",
        overview: "Teach mathematics.",
        responsibilities: ["Instruction"],
        requirements: ["NJ certification"],
      },
      {
        slug: "science-teacher",
        title: "Science Teacher",
        district: "Demo District",
        city: "Paramus",
        county: "Bergen",
        type: "teacher",
        posted: "2026-11-02T00:00:00.000Z",
        overview: "Teach science.",
        responsibilities: ["Instruction"],
        requirements: ["NJ certification"],
      },
    ],
    subscribers: [
      {
        id: 1,
        email: "verified@example.com",
        county: "Bergen",
        keyword: "teacher",
        job_type: "teacher",
        priority_status: "free",
        verified_at: "2026-11-01T00:00:00.000Z",
        email_verified: true,
        is_verified: true,
        unsubscribed_at: null,
        is_unsubscribed: false,
        status: "active",
      },
      {
        id: 2,
        email: "unverified@example.com",
        county: "Bergen",
        keyword: "teacher",
        job_type: "teacher",
        priority_status: "free",
        verified_at: null,
        email_verified: false,
        is_verified: false,
        unsubscribed_at: null,
        is_unsubscribed: false,
        status: "active",
      },
      {
        id: 3,
        email: "unsubscribed@example.com",
        county: "Bergen",
        keyword: "teacher",
        job_type: "teacher",
        priority_status: "free",
        verified_at: "2026-11-01T00:00:00.000Z",
        email_verified: true,
        is_verified: true,
        unsubscribed_at: "2026-11-01T00:00:00.000Z",
        is_unsubscribed: true,
        status: "unsubscribed",
      },
    ],
    sentJobAlerts: [
      { subscriber_email: "verified@example.com", job_slug: "math-teacher" },
    ],
  });

  const firstRun = await store.runCron();
  assert.equal(firstRun.success, true);
  assert.equal(firstRun.results.length, 1);
  assert.equal(firstRun.results[0].subscriber, "verified@example.com");
  assert.equal(store.state.sentEmails.length, 1);
  assert.equal(store.state.sentJobAlerts.length, 2);

  const secondRun = await store.runCron();
  assert.equal(secondRun.success, true);
  assert.equal(secondRun.results.length, 0);
  assert.equal(store.state.sentEmails.length, 1);
});

test("openDirectApplication opens the employer site directly and falls back when popups are blocked", () => {
  const popupCalls = [];
  const originalWindow = globalThis.window;

  Object.defineProperty(globalThis, "window", {
    value: {
      open: (url, target, features) => {
        popupCalls.push({ url, target, features });
        return { closed: false };
      },
      location: { href: "https://example.com/initial" },
    },
    configurable: true,
    writable: true,
  });

  try {
    openDirectApplication("https://school.example.org/apply");
    assert.equal(popupCalls.length, 1);
    assert.equal(popupCalls[0].url, "https://school.example.org/apply");
    assert.equal(popupCalls[0].target, "_blank");

    Object.defineProperty(globalThis, "window", {
      value: {
        open: () => null,
        location: { href: "https://example.com/initial" },
      },
      configurable: true,
      writable: true,
    });

    openDirectApplication("https://school.example.org/apply");
    assert.equal(globalThis.window.location.href, "https://school.example.org/apply");
  } finally {
    if (originalWindow === undefined) {
      delete globalThis.window;
    } else {
      Object.defineProperty(globalThis, "window", {
        value: originalWindow,
        configurable: true,
        writable: true,
      });
    }
  }
});
