import { createClient } from "@supabase/supabase-js";

function normalize(value: string) {
  return String(value || "").trim().toLowerCase();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const adminSecret = String(body.adminSecret || "").trim();
    const title = String(body.title || "").trim();
    const district = String(body.district || "").trim();
    const location = String(body.location || "").trim();
    const county = String(body.county || "").trim();
    const type = String(body.type || "").trim();
    const posted = String(body.posted || "").trim();
    const applyUrl = String(body.applyUrl || "").trim();
    const overview = String(body.overview || "").trim();
    const responsibilitiesRaw = String(body.responsibilities || "").trim();
    const requirementsRaw = String(body.requirements || "").trim();

    if (!process.env.ADMIN_SECRET) {
      return Response.json(
        { error: "ADMIN_SECRET is missing from environment variables." },
        { status: 500 }
      );
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return Response.json(
        { error: "Supabase environment variables are missing." },
        { status: 500 }
      );
    }

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return Response.json(
        { error: "Invalid admin password." },
        { status: 401 }
      );
    }

    if (!title) {
      return Response.json({ error: "Job title is required." }, { status: 400 });
    }

    if (!district) {
      return Response.json({ error: "District is required." }, { status: 400 });
    }

    if (!location) {
      return Response.json({ error: "Location is required." }, { status: 400 });
    }

    if (!county) {
      return Response.json({ error: "County is required." }, { status: 400 });
    }

    if (!type) {
      return Response.json({ error: "Job type is required." }, { status: 400 });
    }

    if (!posted) {
      return Response.json({ error: "Posted date is required." }, { status: 400 });
    }

    if (!applyUrl) {
      return Response.json({ error: "Apply URL is required." }, { status: 400 });
    }

    if (!isValidUrl(applyUrl)) {
      return Response.json({ error: "Apply URL must be valid." }, { status: 400 });
    }

    if (!overview) {
      return Response.json({ error: "Overview is required." }, { status: 400 });
    }

    if (!responsibilitiesRaw) {
      return Response.json(
        { error: "Responsibilities are required." },
        { status: 400 }
      );
    }

    if (!requirementsRaw) {
      return Response.json(
        { error: "Requirements are required." },
        { status: 400 }
      );
    }

    const responsibilities = responsibilitiesRaw
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const requirements = requirementsRaw
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const slug = slugify(`${title}-${district}-${location}`);

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: existing, error: checkError } = await supabase
      .from("jobs")
      .select("id, title, district, applyUrl")
      .or(
        `slug.eq.${slug},and(title.ilike.${title},district.ilike.${district},applyUrl.ilike.${applyUrl})`
      );

    if (checkError) {
      return Response.json({ error: checkError.message }, { status: 500 });
    }

    const duplicate = (existing || []).find((row: any) => {
      return (
        normalize(row.title) === normalize(title) &&
        normalize(row.district) === normalize(district) &&
        normalize(row.applyUrl) === normalize(applyUrl)
      );
    });

    if (duplicate) {
      return Response.json(
        { error: "Duplicate job detected. This job already exists." },
        { status: 409 }
      );
    }

    const { error: insertError } = await supabase.from("jobs").insert({
      title,
      district,
      location,
      county,
      type,
      posted,
      applyUrl,
      overview,
      responsibilities,
      requirements,
      slug,
    });

    if (insertError) {
      return Response.json({ error: insertError.message }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: "Job added successfully.",
      slug,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return Response.json({ error: message }, { status: 500 });
  }
}