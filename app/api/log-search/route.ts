import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || String(query).trim().length < 2) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from("search_queries").insert({
      query: String(query).trim().toLowerCase(),
    });

    if (error) {
      console.error("Search log insert error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Search log route error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}