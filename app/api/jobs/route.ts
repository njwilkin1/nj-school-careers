import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

function addDays(dateString: string, days: number) {
  const date = dateString ? new Date(dateString) : new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const title = String(body.title || "").trim();
    const district = String(body.district || "").trim();
    const city = String(body.city || "").trim();
    const county = String(body.county || "").trim();
    const location = String(body.location || "").trim();
    const type = String(body.type || "").trim();
    const postingDate =
      String(body.postingDate || "").trim() ||
      new Date().toISOString().slice(0, 10);
    const applicationDeadline =
      String(body.applicationDeadline || "").trim() || addDays(postingDate, 45);
    const salary = String(body.salary || "").trim();
    const benefits = String(body.benefits || "").trim();
    const description = String(body.description || "").trim();
    const applyUrl = String(body.applyUrl || "").trim();
    const contactName = String(body.contactName || "").trim();
    const contactTitle = String(body.contactTitle || "").trim();
    const contactEmail = String(body.contactEmail || "").trim();

    if (!title) return NextResponse.json({ error: "Job title is required." }, { status: 400 });
    if (!district) return NextResponse.json({ error: "School / district name is required." }, { status: 400 });
    if (!city) return NextResponse.json({ error: "City is required." }, { status: 400 });
    if (!county) return NextResponse.json({ error: "County is required." }, { status: 400 });
    if (!type) return NextResponse.json({ error: "Job type is required." }, { status: 400 });
    if (!description) return NextResponse.json({ error: "Job description is required." }, { status: 400 });

    if (!applyUrl || !isValidUrlOrEmail(applyUrl)) {
      return NextResponse.json(
        { error: "Valid application URL or email is required." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const slug = slugify(`${title}-${district}-${city}-${Date.now()}`);

    const { error } = await supabase.from("jobs").insert({
      title,
      district,
      city,
      county,
      location,
      type,
      posted: postingDate,
      closing_date: applicationDeadline,
      salary_range: salary,
      benefits,
      job_description: description,
      applyUrl,
      contact_name: contactName,
      contact_title: contactTitle,
      contact_email: contactEmail,
      slug,
      status: "pending",
    });

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from:
          process.env.ALERTS_FROM_EMAIL ||
          "alerts@mail.njschoolcareers.com",
        to: process.env.ADMIN_ALERT_EMAIL || "njwilkin@hotmail.com",
        subject: `New job submitted: ${title}`,
        html: `
          <h2>New Job Submitted for Review</h2>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>District:</strong> ${district}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>County:</strong> ${county}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Posting Date:</strong> ${new Date(postingDate).toLocaleDateString("en-US")}</p>
          <p><strong>Application Deadline:</strong> ${new Date(applicationDeadline).toLocaleDateString("en-US")}</p>
          <p><strong>Salary:</strong> ${salary || "Not provided"}</p>
          <p><strong>Contact:</strong> ${contactName || "Not provided"}</p>
          <p><strong>Contact Title:</strong> ${contactTitle || "Not provided"}</p>
          <p><strong>Contact Email:</strong> ${contactEmail || "Not provided"}</p>
          <p><strong>Apply URL/Email:</strong> ${applyUrl}</p>
          <p>
            <a href="https://www.njschoolcareers.com/admin">
              Review in Admin Dashboard
            </a>
          </p>
        `,
      });
    } catch (emailError) {
      console.error("EMAIL ALERT ERROR:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Job submitted successfully.",
      job: {
        title,
        district,
        posted: postingDate,
        application_deadline: applicationDeadline,
      },
    });
  } catch (err: any) {
    console.error("API ERROR:", err);

    return NextResponse.json(
      { error: err.message || "Something went wrong." },
      { status: 500 }
    );
  }
}