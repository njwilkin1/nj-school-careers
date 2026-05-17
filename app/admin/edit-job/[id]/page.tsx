import { createClient } from "@supabase/supabase-js";
import EditJobForm from "./EditJobForm";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !job) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
        <div className="text-center text-slate-700">
          <h1 className="text-2xl font-bold text-slate-900">Job Not Found</h1>
          <p className="mt-2">The requested job could not be found in the database.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 bg-slate-50">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Edit Job Posting</h1>
        <EditJobForm job={job} />
      </div>
    </main>
  );
}