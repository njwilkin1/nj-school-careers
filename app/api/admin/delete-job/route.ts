    import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { id, adminSecret } = await req.json();

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing job ID" }, { status: 400 });
    }

    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}