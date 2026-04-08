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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      adminSecret,
      title,
      district,
      location,
      type,
      posted,
      applyUrl,
      overview,
      responsibilities,
      requirements,
    } = body;

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

    if (!title || !district || !location || !type || !applyUrl || !overview) {
      return Response.json(
        {
          error:
            "Missing required fields. Required: title, district, location, type, applyUrl, overview.",
        },
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
      type || "Full Time",
      posted || new Date().toISOString().slice(0, 10),
      applyUrl,
      overview,
      String(responsibilities || ""),
      String(requirements || ""),
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