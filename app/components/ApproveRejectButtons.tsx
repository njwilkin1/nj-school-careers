"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApproveRejectButtons({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(action: "approve" | "reject") {
    setLoading(true);

    try {
      const res = await fetch(`/api/jobs/${id}/${action}`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || `${action} failed`);
        setLoading(false);
        return;
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      alert(`Something went wrong trying to ${action} this job.`);
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        disabled={loading}
        onClick={() => updateStatus("approve")}
        className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-200 disabled:opacity-60"
      >
        Approve
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={() => updateStatus("reject")}
        className="rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:opacity-60"
      >
        Reject
      </button>
    </>
  );
}