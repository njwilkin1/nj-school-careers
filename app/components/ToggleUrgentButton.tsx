"use client";

import { useTransition } from "react";

type Props = {
  id: number;
  isUrgent?: boolean;
};

export default function ToggleUrgentButton({
  id,
  isUrgent,
}: Props) {
  const [isPending, startTransition] = useTransition();

  async function toggleUrgent() {
    await fetch("/api/admin/toggle-urgent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        isUrgent: !isUrgent,
      }),
    });

    window.location.reload();
  }

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await toggleUrgent();
        })
      }
      disabled={isPending}
      className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
        isUrgent
          ? "bg-red-100 text-red-700 hover:bg-red-200"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {isUrgent ? "Urgent" : "Make Urgent"}
    </button>
  );
}