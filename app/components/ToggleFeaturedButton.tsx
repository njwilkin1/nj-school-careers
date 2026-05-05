"use client";

import { useState } from "react";

export default function ToggleFeaturedButton({
  id,
  isFeatured,
}: {
  id: string;
  isFeatured: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    await fetch("/api/admin/toggle-featured", {
      method: "POST",
      body: JSON.stringify({
        id,
        is_featured: isFeatured,
      }),
    });

    window.location.reload(); // simple refresh
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`rounded-lg px-3 py-1 text-xs font-semibold ${
        isFeatured
          ? "bg-yellow-100 text-yellow-800"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {loading ? "..." : isFeatured ? "Unfeature" : "Feature"}
    </button>
  );
}