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
    return <main className="p-8">Job not found.</main>;
  }

  return <EditJobForm job={job} />;
}