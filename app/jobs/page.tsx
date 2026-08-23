import FastJobFilters from "@/app/components/FastJobFilters";

export const dynamic = "force-dynamic";

export default function JobsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Browse Jobs
        </h1>

        <FastJobFilters />
      </div>
    </main>
  );
}
