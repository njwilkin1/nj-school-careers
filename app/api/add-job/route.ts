import { createClient } from "@supabase/supabase-js";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hasSalaryRange(value: string) {
  const v = value.trim().toLowerCase();
  const hasNumber = /\d/.test(v);
  const hasRange = /\s(-|–|—|to)\s/i.test(v);
  const badOpenEnded = /\+|and up|starting at|competitive|commensurate/.test(v);

  return hasNumber && hasRange && !badOpenEnded;
}

function isValidUrlOrEmail(value: string) {
  const trimmed = value.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return true;
  try {
    const url = new URL(trimmed);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function toLineArray(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim().replace(/^[-•]\s*/, ""))
    .filter(Boolean);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const title = String(body.title || "").trim();
    const district = String(body.district || "").trim();
    const location = String(body.location || "").trim();
    const city = String(body.city || "").trim();
    const county = String(body.county || "").trim();
    const type = String(body.type || "").trim();
    const description = String(body.description || "").trim();
    const applyUrl = String(body.applyUrl || "").trim();

    // Posting date and deadline
    const postingDate = body.postingDate ? new Date(body.postingDate) : new Date();
    const applicationDeadline = body.applicationDeadline
      ? new Date(body.applicationDeadline)
      : new Date(postingDate.getTime() + 45 * 24 * 60 * 60 * 1000); // 45 days default

    // Validations
    if (!title) return Response.json({ error: "Job title is required." }, { status: 400 });
    if (!district) return Response.json({ error: "School / district name is required." }, { status: 400 });
    if (!city) return Response.json({ error: "City is required." }, { status: 400 });
    if (!county) return Response.json({ error: "County is required." }, { status: 400 });
    if (!type) return Response.json({ error: "Job type is required." }, { status: 400 });
    if (!description) return Response.json({ error: "Job description is required." }, { status: 400 });
    if (!applyUrl || !isValidUrlOrEmail(applyUrl)) {
      return Response.json({ error: "Application link or hiring email is required." }, { status: 400 });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return Response.json({ error: "Supabase environment variables are missing." }, { status: 500 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const slug = slugify(`${title}-${district}-${city}-${Date.now()}`);

    const { error } = await supabase.from("jobs").insert({
      title,
      district,
      city,
      county,
      location: location || null,
      type,
      posted: postingDate.toISOString().slice(0, 10),
      application_deadline: applicationDeadline.toISOString().slice(0, 10),
      job_description: description,
      applyUrl,
      slug,
      status: "pending", // pending for admin review
      overview: null,
      responsibilities: [],
      requirements: [],
    });

    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json({
      success: true,
      message: "Job submitted and pending admin review.",
    });
  } catch (err: any) {
    console.error(err);
    return Response.json({ error: err.message || "Something went wrong." }, { status: 500 });
  }
}