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

    const employerEmail = String(body.employerEmail || "").trim().toLowerCase();
    const employerOrderId = String(body.employerOrderId || "").trim();

    if (!employerEmail || !employerOrderId) {
      return NextResponse.json(
        { error: "Employer access verification is required." },
        { status: 403 }
      );
    }

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
    if (!salary) return NextResponse.json({ error: "Salary range is required." }, { status: 400 });
    if (!benefits) return NextResponse.json({ error: "Benefits summary is required." }, { status: 400 });
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

    const { data: order, error: orderError } = await supabase
      .from("employer_orders")
      .select("id, employer_email, plan_type, remaining_posts, unlimited_until, has_featured, has_urgent, status")
      .eq("id", employerOrderId)
      .eq("employer_email", employerEmail)
      .eq("status", "active")
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "No active employer plan found." },
        { status: 403 }
      );
    }

    const now = new Date();

    const hasRemainingPosts =
      typeof order.remaining_posts === "number" && order.remaining_posts > 0;

    const hasUnlimitedAccess =
      order.unlimited_until && new Date(order.unlimited_until) > now;

    if (!hasRemainingPosts && !hasUnlimitedAccess) {
      return NextResponse.json(
        { error: "This employer plan does not have any active posting access." },
        { status: 403 }
      );
    }

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
      employer_email: employerEmail,
      employer_order_id: employerOrderId,
      is_featured: !!order.has_featured,
      is_urgent: !!order.has_urgent,
      slug,
      status: "pending",
    });

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (typeof order.remaining_posts === "number" && order.remaining_posts > 0) {
      const newRemainingPosts = order.remaining_posts - 1;

      const { error: updateOrderError } = await supabase
        .from("employer_orders")
        .update({
          remaining_posts: newRemainingPosts,
          status: newRemainingPosts <= 0 ? "used" : "active",
        })
        .eq("id", employerOrderId);

      if (updateOrderError) {
        console.error("ORDER UPDATE ERROR:", updateOrderError);
      }
    }

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from:
          process.env.ALERTS_FROM_EMAIL ||
          "alerts@mail.njschoolcareers.com",
        to: process.env.ADMIN_ALERT_EMAIL || "info@njschoolcareers.com",
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
          <p><strong>Salary:</strong> ${salary}</p>
          <p><strong>Benefits:</strong> ${benefits}</p>
          <p><strong>Featured:</strong> ${order.has_featured ? "Yes" : "No"}</p>
          <p><strong>Urgent:</strong> ${order.has_urgent ? "Yes" : "No"}</p>
          <p><strong>Employer Email:</strong> ${employerEmail}</p>
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