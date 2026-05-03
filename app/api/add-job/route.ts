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

    const title = String(body.jobTitle || "").trim();
    const district = String(body.district || "").trim();
    const city = String(body.city || "").trim();
    const county = String(body.county || "").trim();
    const location = String(body.location || "").trim();
    const type = String(body.jobType || "").trim();
    const salaryRange = String(body.salaryRange || "").trim();
    const benefitsRaw = String(body.benefits || "").trim();
    const jobDescription = String(body.jobDescription || "").trim();
    const applyUrl = String(body.applicationLink || "").trim();
    const contactName = String(body.contactName || "").trim();
    const contactTitle = String(body.contactTitle || "").trim();
    const contactEmail = String(body.contactEmail || "").trim();

    if (!title) return Response.json({ error: "Job title is required." }, { status: 400 });
    if (!district) return Response.json({ error: "School / district name is required." }, { status: 400 });
    if (!city) return Response.json({ error: "City is required." }, { status: 400 });
    if (!county) return Response.json({ error: "County is required." }, { status: 400 });
    if (!type) return Response.json({ error: "Job type is required." }, { status: 400 });

    if (!salaryRange || !hasSalaryRange(salaryRange)) {
      return Response.json(
        { error: "Please enter a good-faith salary range, such as $60,000 - $75,000 or $25/hr - $30/hr." },
        { status: 400 }
      );
    }

    if (!benefitsRaw) return Response.json({ error: "Benefits are required." }, { status: 400 });
    if (!jobDescription) return Response.json({ error: "Job description is required." }, { status: 400 });

    if (!applyUrl || !isValidUrlOrEmail(applyUrl)) {
      return Response.json(
        { error: "Application link or hiring email is required." },
        { status: 400 }
      );
    }

    if (!contactName) return Response.json({ error: "Contact name is required." }, { status: 400 });
    if (!contactTitle) return Response.json({ error: "Contact title is required." }, { status: 400 });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return Response.json({ error: "Valid contact email is required." }, { status: 400 });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return Response.json(
        { error: "Supabase environment variables are missing." },
        { status: 500 }
      );
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
      posted: new Date().toISOString().slice(0, 10),
      salary_range: salaryRange,
      benefits: toLineArray(benefitsRaw),
      job_description: jobDescription,
      applyUrl,
      contact_name: contactName,
      contact_title: contactTitle,
      contact_email: contactEmail,
      slug,
      status: "pending",
      overview: null,
      responsibilities: [],
      requirements: [],
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: "Job submitted for review.",
    });
  } catch {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}