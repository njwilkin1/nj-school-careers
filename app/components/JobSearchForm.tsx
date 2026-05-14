"use client";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function JobSearchForm() {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const search = String(formData.get("search") || "").trim();
    const location = String(formData.get("location") || "").trim();

    window.gtag?.("event", "job_search", {
      search_term: search,
      location,
    });

    if (search.length > 1) {
      await fetch("/api/log-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: search }),
      });
    }

    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (location) params.set("location", location);

    window.location.href = `/jobs?${params.toString()}`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 md:grid-cols-[1.2fr_1fr_auto]"
    >
      <input
        name="search"
        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400"
        placeholder="Job title, role, or keyword"
      />

      <input
        name="location"
        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400"
        placeholder="City or county"
      />

      <button
        type="submit"
        className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
      >
        Search Jobs
      </button>
    </form>
  );
}