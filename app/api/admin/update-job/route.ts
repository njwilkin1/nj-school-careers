import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const adminSecret = String(body.adminSecret || "").trim();

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = body.id;

    if (!id) {
      return NextResponse.json({ error: "Missing job ID" }, { status: 400 });
    }

    const { error } = await supabase
      .from("jobs")
      .update({
        title: body.title,
        district: body.district,
        city: body.city,
        county: body.county,
        location: body.location || null,
        type: body.type,
        salary_range: body.salary_range,
        benefits: body.benefits
          .split("\n")
          .map((item: string) => item.trim())
          .filter(Boolean),
        job_description: body.job_description,
        applyUrl: body.applyUrl,
        contact_name: body.contact_name,
        contact_title: body.contact_title,
        contact_email: body.contact_email,
        status: body.status || "published",
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}