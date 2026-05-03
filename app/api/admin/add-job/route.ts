import { createClient } from "@supabase/supabase-js";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidUrlOrEmail(value: string) {
  const trimmed = value.trim();

  if (trimmed.startsWith("mailto:")) return true;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return true;

  try {
    const url = new URL(trimmed);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function hasSalaryRange(value: string) {
  const v = value.trim().toLowerCase();
  const hasNumber = /\d/.test(v);
  const hasRange = /\s(-|–|—|to)\s/i.test(v);
  const badOpenEnded = /\+|and up|starting at|competitive|commensurate/.test(v);

  return hasNumber && hasRange && !badOpenEnded;
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

const adminSecret = String(body.adminSecret || "").trim();

if (adminSecret !== process.env.ADMIN_SECRET) {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

    const title = String(body.title || "").trim();
    const district = String(body.district || "").trim();
    const city = String(body.city || "").trim();
    const county = String(body.county || "").trim();
    const location = String(body.location || "").trim();
    const type = String(body.type || "").trim();
    const posted = String(body.posted || "").trim();
    const closingDate = String(body.closing_date || "").trim();
    const salaryRange = String(body.salary_range || "").trim();
    const benefitsRaw = String(body.benefits || "").trim();
    const jobDescription = String(body.job_description || "").trim();
    const applyUrl = String(body.applyUrl || "").trim();
    const contactName = String(body.contact_name || "").trim();
    const contactTitle = String(body.contact_title || "").trim();
    const contactEmail = String(body.contact_email || "").trim();

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
      return Response.json({ error: "Invalid admin password." }, { status: 401 });
    }

    if (!title) return Response.json({ error: "Job title is required." }, { status: 400 });
    if (!district) return Response.json({ error: "District is required." }, { status: 400 });
    if (!city) return Response.json({ error: "City is required." }, { status: 400 });
    if (!county) return Response.json({ error: "County is required." }, { status: 400 });
    if (!type) return Response.json({ error: "Job type is required." }, { status: 400 });
    if (!posted) return Response.json({ error: "Posted date is required." }, { status: 400 });

    if (!salaryRange) {
      return Response.json({ error: "Salary range is required." }, { status: 400 });
    }

    if (!hasSalaryRange(salaryRange)) {
      return Response.json(
        {
          error:
            "Salary range must include a good-faith range, such as $60,000 - $75,000 or $25/hr - $30/hr.",
        },
        { status: 400 }
      );
    }

    if (!benefitsRaw) {
      return Response.json({ error: "Benefits are required." }, { status: 400 });
    }

    if (!jobDescription) {
      return Response.json({ error: "Job description is required." }, { status: 400 });
    }

    if (!applyUrl) {
      return Response.json(
        { error: "Application link or email is required." },
        { status: 400 }
      );
    }

    if (!isValidUrlOrEmail(applyUrl)) {
      return Response.json(
        { error: "Application must be a valid URL or email address." },
        { status: 400 }
      );
    }

    if (!contactName) {
      return Response.json({ error: "Contact name is required." }, { status: 400 });
    }

    if (!contactTitle) {
      return Response.json({ error: "Contact title is required." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return Response.json({ error: "Valid contact email is required." }, { status: 400 });
    }

    const slug = slugify(`${title}-${district}-${city}`);
    const benefits = toLineArray(benefitsRaw);

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: existingJob, error: checkError } = await supabase
      .from("jobs")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (checkError) {
      return Response.json({ error: checkError.message }, { status: 500 });
    }

    if (existingJob) {
      return Response.json(
        { error: "This job already exists in the database." },
        { status: 409 }
      );
    }

    const { error: insertError } = await supabase.from("jobs").insert({
      title,
      district,
      city,
      location: location || null,
      county,
      type,
      posted,
      closing_date: closingDate || null,
      salary_range: salaryRange,
      benefits,
      job_description: jobDescription,
      applyUrl,
      overview: null,
      responsibilities: [],
      requirements: [],
      contact_name: contactName,
      contact_title: contactTitle,
      contact_email: contactEmail,
      slug,
      status: "published",
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
    const message = error instanceof Error ? error.message : "Unknown server error";
    return Response.json({ error: message }, { status: 500 });
  }
}