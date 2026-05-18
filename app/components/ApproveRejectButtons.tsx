"use client";

export default function ApproveRejectButtons({
  id,
}: {
  id: string;
}) {
  async function handleApprove() {
    try {
      const res = await fetch(`/api/jobs/${id}/approve`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Approve failed");
        return;
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Something went wrong approving the job.");
    }
  }

  async function handleReject() {
    try {
      const res = await fetch(`/api/jobs/${id}/reject`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Reject failed");
        return;
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Something went wrong rejecting the job.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleApprove}
        className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-200"
      >
        Approve
      </button>

      <button
        type="button"
        onClick={handleReject}
        className="rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
      >
        Reject
      </button>
    </>
  );
}