import ApproveRejectButtons from "../components/ApproveRejectButtons";
import ToggleFeaturedButton from "../components/ToggleFeaturedButton";
import DeleteJobButton from "../components/DeleteJobButton";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, district, status, created_at, is_featured");

  const sortedJobs = [...(jobs ?? [])].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;

    return (
      new Date(b.created_at || 0).getTime() -
      new Date(a.created_at || 0).getTime()
    );
  });

  const getStatusClass = (status: string | null) => {
    if (status === "pending") {
      return "bg-yellow-50 text-yellow-700";
    }

    if (status === "rejected") {
      return "bg-red-50 text-red-700";
    }

    return "bg-green-50 text-green-700";
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">
            Admin Dashboard
          </h1>

          <Link
            href="/admin/add-job"
            className="rounded-xl bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600"
          >
            + Add Job
          </Link>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Pending jobs appear first, followed by the newest postings.
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
              {sortedJobs.map((job) => (
                <tr key={job.id} className="border-t">
                  <td className="p-4 font-medium text-slate-900">
                    {job.title}
                  </td>

                  <td className="p-4 text-slate-600">
                    {job.district}
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                        job.status
                      )}`}
                    >
                      {job.status || "published"}
                    </span>
                  </td>

                  <td className="p-4 text-slate-500">
                    {job.created_at
                      ? new Date(job.created_at).toLocaleDateString("en-US")
                      : ""}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
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

                      {job.status === "pending" && (
                        <ApproveRejectButtons id={job.id} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedJobs.length === 0 && (
            <p className="p-6 text-slate-500">No jobs found.</p>
          )}
        </div>
      </div>
    </main>
  );
}