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
      className="grid gap-3 md:grid-cols-[2fr_1.4fr_auto]"
    >
      <input
        name="search"
        className="h-14 rounded-2xl border border-slate-300 px-5 text-base outline-none placeholder:text-slate-400 focus:border-blue-400"
        placeholder="Job title, keywords, or district"
      />

      <input
        name="location"
        className="h-14 rounded-2xl border border-slate-300 px-5 text-base outline-none placeholder:text-slate-400 focus:border-blue-400"
        placeholder="City or county"
      />

      <button
        type="submit"
        className="h-14 rounded-2xl bg-orange-500 px-8 text-base font-semibold text-white shadow-sm transition hover:bg-orange-600"
      >
        Search Jobs
      </button>
    </form>
  );
}