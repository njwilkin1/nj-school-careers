"use client";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function JobSearchForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    const search = String(formData.get("search") || "").trim();
    const location = String(formData.get("location") || "").trim();

    window.gtag?.("event", "job_search", {
      search_term: search,
      location,
    });
  }

  return (
    <form
      action="/jobs"
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