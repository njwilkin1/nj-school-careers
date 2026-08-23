import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const JOBS_PER_PAGE = 15;

export async function GET(request: NextRequest) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { searchParams } = new URL(request.url);

  const search = (searchParams.get("search") || "").trim();
  const county = (searchParams.get("county") || "").trim();
  const category = (searchParams.get("category") || "").trim();
  const type = (searchParams.get("type") || "").trim();
  const dateFilter = (searchParams.get("date") || "").trim();

  const requestedPage = Number(searchParams.get("page") || "1");
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.floor(requestedPage)
      : 1;

  const from = (page - 1) * JOBS_PER_PAGE;
  const to = from + JOBS_PER_PAGE - 1;

  let query = supabase
    .from("jobs_browse")
    .select("*", { count: "exact" });

  if (search) {
    const safeSearch = search.replace(/[,%()]/g, " ").trim();

    if (safeSearch) {
      query = query.or(
        `title.ilike.%${safeSearch}%,district.ilike.%${safeSearch}%,county.ilike.%${safeSearch}%,location.ilike.%${safeSearch}%,type.ilike.%${safeSearch}%`
      );
    }
  }

  if (county) {
    query = query.ilike("county", county);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (type) {
    query = query.ilike("type", type);
  }

  if (dateFilter === "7") {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);

    query = query.gte(
      "posted",
      cutoff.toISOString().slice(0, 10)
    );
  }

  const { data, error, count } = await query
    .order("is_urgent", { ascending: false })
    .order("is_featured", { ascending: false })
    .order("posted", { ascending: false, nullsFirst: false })
    .range(from, to);

  if (error) {
    console.error("jobs-browse API error:", error);

    return NextResponse.json(
      { error: "Unable to load jobs." },
      { status: 500 }
    );
  }

  const jobs = (data || []).map((job) => ({
    id: job.job_key,
    slug: job.job_key,
    title: job.title,
    district: job.district,
    location: job.location || "",
    county: job.county || "",
    type: job.type || "",
    category: job.category || "",
    posted: job.posted || "",
    applyUrl: job.apply_url || "",
    is_featured: Boolean(job.is_featured),
    is_urgent: Boolean(job.is_urgent),
  }));

  return NextResponse.json({
    jobs,
    total: count || 0,
    page,
    perPage: JOBS_PER_PAGE,
    totalPages: Math.ceil((count || 0) / JOBS_PER_PAGE),
  });
}
