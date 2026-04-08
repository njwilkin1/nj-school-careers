import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

function escapeCsv(value: string) {
  const safe = String(value ?? "").replace(/\r?\n|\r/g, " ").trim();

  if (safe.includes(",") || safe.includes('"')) {
    return `"${safe.replace(/"/g, '""')}"`;
  }

  return safe;
}

function normalize(value: string) {
  return String(value || "").trim().toLowerCase();
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
    const type = String(body.type || "").trim();
    const posted = String(body.posted || "").trim();
    const applyUrl = String(body.applyUrl || "").trim();
    const overview = String(body.overview || "").trim();
    const responsibilities = String(body.responsibilities || "").trim();
    const requirements = String(body.requirements || "").trim();

    if (!process.env.ADMIN_SECRET) {
      return Response.json(
        { error: "ADMIN_SECRET is missing in .env.local" },
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

    if (!responsibilities) {
      return Response.json(
        { error: "Responsibilities are required." },
        { status: 400 }
      );
    }

    if (!requirements) {
      return Response.json(
        { error: "Requirements are required." },
        { status: 400 }
      );
    }

    const csvPath = path.join(process.cwd(), "imports", "jobs.csv");

    if (!fs.existsSync(csvPath)) {
      return Response.json(
        { error: "imports/jobs.csv not found." },
        { status: 500 }
      );
    }

    const csvContent = fs.readFileSync(csvPath, "utf8");

    const existingRows = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true,
      trim: true,
    });

    const duplicate = existingRows.find((row: any) => {
      return (
        normalize(row.title) === normalize(title) &&
        normalize(row.district) === normalize(district) &&
        normalize(row.applyUrl) === normalize(applyUrl)
      );
    });

    if (duplicate) {
      return Response.json(
        { error: "Duplicate job detected. This job already exists in your CSV." },
        { status: 409 }
      );
    }

    const row = [
      title,
      district,
      location,
      type,
      posted,
      applyUrl,
      overview,
      responsibilities,
      requirements,
    ]
      .map(escapeCsv)
      .join(",");

    fs.appendFileSync(csvPath, `\n${row}`, "utf8");

    return Response.json({
      success: true,
      message: "Job added to CSV successfully.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return Response.json({ error: message }, { status: 500 });
  }
}