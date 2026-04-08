import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const csvPath = path.join(process.cwd(), "imports", "jobs.csv");
const outputPath = path.join(process.cwd(), "data", "jobs.ts");

const EXPIRATION_DAYS = 45;

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function splitList(value) {
  if (!value) return [];
  return String(value)
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function safe(value) {
  return String(value || "").trim();
}

function isExpired(postedDate) {
  if (!postedDate) return false;

  const posted = new Date(postedDate);
  if (Number.isNaN(posted.getTime())) return false;

  const now = new Date();
  const diffMs = now.getTime() - posted.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays > EXPIRATION_DAYS;
}

try {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found: ${csvPath}`);
  }

  const csvContent = fs.readFileSync(csvPath, "utf8");

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  const seenSlugs = new Set();
  const skippedExpired = [];
  const jobs = [];

  records.forEach((row, index) => {
    const title = safe(row.title);
    const district = safe(row.district);
    const location = safe(row.location);
    const county = safe(row.county);
    const type = safe(row.type);
    const posted = safe(row.posted) || new Date().toISOString().slice(0, 10);
    const applyUrl = safe(row.applyUrl);
    const overview = safe(row.overview);
    const responsibilities = splitList(row.responsibilities);
    const requirements = splitList(row.requirements);

    if (
      !title ||
      !district ||
      !location ||
      !county ||
      !type ||
      !applyUrl ||
      !overview
    ) {
      return;
    }

    if (isExpired(posted)) {
      skippedExpired.push({
        row: index + 2,
        title,
        district,
        posted,
      });
      return;
    }

    let baseSlug = slugify(`${title}-${district}-${location}`);
    let slug = baseSlug;
    let counter = 2;

    while (seenSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    seenSlugs.add(slug);

    jobs.push({
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
  });

  const fileContent = `export const jobs = ${JSON.stringify(jobs, null, 2)};\n`;

  fs.writeFileSync(outputPath, fileContent, "utf8");

  console.log(`Imported ${jobs.length} active jobs successfully.`);
  console.log(`Skipped ${skippedExpired.length} expired jobs.`);
  console.log(`Updated: ${outputPath}`);

  if (skippedExpired.length > 0) {
    console.log("\nExpired jobs skipped:");
    skippedExpired.forEach((job) => {
      console.log(
        `- Row ${job.row}: ${job.title} | ${job.district} | Posted ${job.posted}`
      );
    });
  }
} catch (error) {
  console.error("Import failed.");
  console.error(error.message);
  process.exit(1);
}