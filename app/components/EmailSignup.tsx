"use client";

const PRIORITY_ALERTS_URL =
  "https://buy.stripe.com/eVq9AVc2OgX9e055Cy8IU09";

function cleanSearchTerm(value: string) {
  return value.trim();
}

export default function EmailSignup({
  searchTerm = "",
  compact = false,
}: {
  searchTerm?: string;
  compact?: boolean;
}) {
  const cleanedSearchTerm = cleanSearchTerm(searchTerm);

  const headline = cleanedSearchTerm
    ? `Never miss a new ${cleanedSearchTerm} opening in New Jersey`
    : "Get New Jersey education job alerts";

  const subheadline = cleanedSearchTerm
    ? `Get personalized ${cleanedSearchTerm} job alerts when new matching opportunities are added.`
    : "Get personalized alerts for new teaching, administration, support staff, and school jobs across New Jersey.";

  return (
    <div
      className={
        compact
          ? "w-full"
          : "mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      }
    >
      {!compact && (
        <>
          <h2 className="text-2xl font-semibold text-slate-950">
            {headline}
          </h2>

          <p className="mt-2 text-slate-600">
            {subheadline}
          </p>

          <p className="mt-2 text-sm font-medium text-slate-700">
            Priority Job Alerts · $9.99/month · Cancel anytime
          </p>
        </>
      )}

      <a
        href={PRIORITY_ALERTS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-block rounded-xl bg-orange-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-orange-600 ${
          compact ? "" : "mt-6"
        }`}
      >
        Get Job Alerts
      </a>
    </div>
  );
}
