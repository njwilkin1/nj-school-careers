import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      jobTitle,
      district,
      location,
      jobType,
      description,
      applicationLink,
    } = body;

    if (
      !jobTitle ||
      !district ||
      !location ||
      !jobType ||
      !description ||
      !applicationLink
    ) {
      return Response.json(
        { error: "Please fill in all fields." },
        { status: 400 }
      );
    }

    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS ||
      !process.env.EMAIL_TO
    ) {
      return Response.json(
        { error: "Email settings are missing in .env.local" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `New Job Submission: ${jobTitle}`,
      html: `
        <h2>New Job Submission</h2>
        <p><strong>Job Title:</strong> ${jobTitle}</p>
        <p><strong>School / District:</strong> ${district}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Job Type:</strong> ${jobType}</p>
        <p><strong>Application Email or URL:</strong> ${applicationLink}</p>
        <p><strong>Description:</strong></p>
        <p>${description.replace(/\n/g, "<br>")}</p>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Email submission error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return Response.json(
      { error: `Email failed: ${message}` },
      { status: 500 }
    );
  }
}