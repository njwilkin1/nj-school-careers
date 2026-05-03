import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminPage() {
  const { data: pendingJobs, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "pending")
    .order("posted", { ascending: false });

  if (error) {
    return <div>Error loading jobs</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pending Jobs</h1>

      {pendingJobs?.length === 0 && <p>No pending jobs</p>}

      {pendingJobs?.map((job) => (
        <div
          key={job.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <h3>{job.title}</h3>
          <p>{job.district}</p>

          <form action="/api/admin/approve-job" method="POST">
            <input type="hidden" name="id" value={job.id} />
            <button type="submit">Approve</button>
          </form>
        </div>
      ))}
    </div>
  );
}