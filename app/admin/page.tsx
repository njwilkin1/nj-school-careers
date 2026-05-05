import ToggleFeaturedButton from "../components/ToggleFeaturedButton";
import DeleteJobButton from "../components/DeleteJobButton";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export default async function AdminPage() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, district, status, created_at, is_featured")
    .order("created_at", { ascending: false })
    .limit(25);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>

          <Link
            href="/admin/add-job"
            className="rounded-xl bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600"
          >
            + Add Job
          </Link>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Manage your latest job postings.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">District</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {(jobs ?? []).map((job) => (
                <tr key={job.id} className="border-t">
                  <td className="p-4 font-medium text-slate-900">
                    {job.title}
                  </td>

                  <td className="p-4 text-slate-600">
                    {job.district}
                  </td>

                  <td className="p-4">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      {job.status || "published"}
                    </span>
                  </td>

                  <td className="p-4 text-slate-500">
                    {job.created_at
                      ? new Date(job.created_at).toLocaleDateString()
                      : ""}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <a
                        href={`/admin/edit-job/${job.id}`}
                        className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                      >
                        Edit
                      </a>

                      <DeleteJobButton id={job.id} />
                    </div>
                  </td>
                  <td className="p-4">
  <div className="flex gap-2">
    <a
      href={`/admin/edit-job/${job.id}`}
      className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
    >
      Edit
    </a>

    <DeleteJobButton id={job.id} />

    <ToggleFeaturedButton
      id={job.id}
      isFeatured={job.is_featured}
    />
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!jobs || jobs.length === 0) && (
            <p className="p-6 text-slate-500">No jobs found.</p>
          )}
        </div>
      </div>
    </main>
  );
}