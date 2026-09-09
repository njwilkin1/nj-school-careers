"use client";

import { useEffect, useState } from "react";

const PRIORITY_ALERTS_URL =
  "https://buy.stripe.com/eVq9AVc2OgX9e055Cy8IU09";

export default function PriorityAlertsPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem(
      "priority-alerts-popup-shown"
    );

    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    if (
      !lastShown ||
      Date.now() - Number(lastShown) > sevenDays
    ) {
      const timer = setTimeout(() => {
        setOpen(true);

        localStorage.setItem(
          "priority-alerts-popup-shown",
          String(Date.now())
        );
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold shadow"
        >
          ×
        </button>

        <img
          src="/priority-alerts-flyer.png"
          alt="NJSchoolCareers Priority Job Alerts"
          className="w-full"
        />

        <div className="p-4">
          <a
            href={PRIORITY_ALERTS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-xl bg-orange-500 px-5 py-4 text-center text-lg font-bold text-white transition hover:bg-orange-600"
          >
            Get Priority Job Alerts — $9.99/month
          </a>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 w-full text-center text-sm text-slate-500"
          >
            Continue browsing jobs for free
          </button>
        </div>
      </div>
    </div>
  );
}
