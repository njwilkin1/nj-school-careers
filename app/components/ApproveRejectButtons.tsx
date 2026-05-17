"use client";

type ApproveRejectButtonsProps = {
  jobId: string;
};

export default function ApproveRejectButtons({
  jobId,
}: ApproveRejectButtonsProps) {
  const handleApprove = async () => {
    await fetch(`/api/jobs/${jobId}/approve`, {
      method: "POST",
    });

    window.location.reload();
  };

  const handleReject = async () => {
    await fetch(`/api/jobs/${jobId}/reject`, {
      method: "POST",
    });

    window.location.reload();
  };

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