"use client";

import { useRouter } from "next/navigation";

export default function DeleteJobButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    const adminSecret = prompt("Enter admin password to delete this job:");

    if (!adminSecret) return;

    const confirmed = confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    const res = await fetch("/api/admin/delete-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, adminSecret }),
    });

    if (!res.ok) {
      alert("Delete failed.");
      return;
    }

    alert("Job deleted.");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
    >
      Delete
    </button>
  );
}