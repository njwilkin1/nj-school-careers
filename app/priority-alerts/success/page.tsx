"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function PriorityAlertsSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [county, setCounty] = useState("");
  const [keyword, setKeyword] = useState("");
  const [jobType, setJobType] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [purchaseVerified, setPurchaseVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("We could not verify your Priority Job Alerts purchase.");
      return;
    }

    let cancelled = false;

    async function verifyPurchase() {
      try {
        const response = await fetch("/api/priority-alerts/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (!response.ok || !data.verified) {
          throw new Error(data.error || "Unable to verify purchase.");
        }

        if (cancelled) return;

        setPurchaseVerified(true);

        const storageKey = `priority-alert-purchase-${sessionId}`;

        if (!localStorage.getItem(storageKey)) {
          if (typeof window.gtag === "function") {
            window.gtag("event", "priority_alert_purchase", {
              value: 9.99,
              currency: "USD",
            });
          }

          localStorage.setItem(storageKey, "1");
        }
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to verify purchase."
        );
      }
    }

    verifyPurchase();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  async function savePreferences(e: React.FormEvent) {
    e.preventDefault();

    if (!sessionId || !purchaseVerified) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/priority-alerts/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          county,
          keyword,
          job_type: jobType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save preferences.");
      }

      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save preferences."
      );
    } finally {
      setLoading(false);
    }
  }

  if (saved) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-3 text-sm font-bold uppercase tracking-widest text-orange-500">
            Priority Job Alerts
          </div>

          <h1 className="text-3xl font-bold text-slate-950">
            Your alerts are ready.
          </h1>

          <p className="mt-4 text-slate-600">
            Your job alert preferences have been saved. We'll send you
            matching New Jersey education opportunities as they become
            available.
          </p>

          <a
            href="/jobs"
            className="mt-7 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Browse NJ Jobs
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-3 text-sm font-bold uppercase tracking-widest text-orange-500">
          Priority Job Alerts
        </div>

        <h1 className="text-3xl font-bold text-slate-950">
          Payment successful
        </h1>

        <p className="mt-3 text-slate-600">
          Choose the types of New Jersey education jobs you'd like us
          to send you.
        </p>

        <form onSubmit={savePreferences} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block font-semibold text-slate-800">
              County
            </label>
            <input
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              placeholder="Example: Bergen County"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
            <p className="mt-1 text-sm text-slate-500">
              Leave blank for jobs throughout New Jersey.
            </p>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-800">
              Job keyword
            </label>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Example: Spanish Teacher"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
            <p className="mt-1 text-sm text-slate-500">
              Leave blank to receive all education job categories.
            </p>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-800">
              Job type
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">All job types</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
            </select>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !sessionId || !purchaseVerified}
            className="w-full rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Start My Priority Job Alerts"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function PriorityAlertsSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-2xl px-6 py-20">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-slate-600">Loading your Priority Job Alerts...</p>
          </div>
        </main>
      }
    >
      <PriorityAlertsSuccessContent />
    </Suspense>
  );
}
