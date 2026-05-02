import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type DetailSection = {
  title: string | null;
  content: string[];
};

function getDisplayType(title: string, positionType?: string | null) {
  const t = title.toLowerCase();

  if (t.includes("bus driver")) return "Transportation";
  if (t.includes("custodian")) return "Facilities";
  if (t.includes("secretary") || t.includes("administrative")) {
    return "Administrative";
  }

  if (
    !positionType ||
    positionType.toLowerCase().includes("athletics") ||
    positionType.toLowerCase().includes("other")
  ) {
    return null;
  }

  return positionType;
}

function formatDate(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function applyHref(value?: string | null) {
  if (!value) return "";

  const trimmed = value.trim();

  if (trimmed.startsWith("mailto:")) return trimmed;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return `mailto:${trimmed}`;
  }

  return trimmed;
}

function cleanLine(line: string) {
  return line
    .replace(/�/g, "-")
    .replace(/^[-•]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeHeading(title: string) {
  return title
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

function parseStructuredText(text?: string | null): DetailSection[] {
  if (!text) return [];

  const cleaned = text
    .replace(/�/g, "-")
    .replace(/\r/g, "")
    .replace(/([a-z])([A-Z])/g, "$1. $2")
    .replace(/(Position Description)/gi, "\n$1\n")
    .replace(/(Job Description)/gi, "\n$1\n")
    .replace(/(Responsibilities)/gi, "\n$1\n")
    .replace(/(Qualifications)/gi, "\n$1\n")
    .replace(/(Requirements)/gi, "\n$1\n")
    .replace(/(Skills, Knowledge, and Personal Qualities)/gi, "\n$1\n")
    .replace(/(Benefits)/gi, "\n$1\n")
    .replace(/(Hours)/gi, "\n$1\n")
    .replace(/(Salary Range)/gi, "\n$1\n")
    .replace(/(Salary)/gi, "\n$1\n")
    .trim();

  const headings = [
    "Job Description",
    "Position Description",
    "Responsibilities",
    "Qualifications",
    "Requirements",
    "Skills, Knowledge, and Personal Qualities",
    "Benefits",
    "Salary Range",
    "Salary",
    "Hours",
  ];

  const headingRegex = new RegExp(`^(${headings.join("|")}):?$`, "i");
  const sections: DetailSection[] = [];
  let current: DetailSection = { title: null, content: [] };

  const rawLines = cleaned
    .split(/\n|•|\.(?=\s+[A-Z])/)
    .map(cleanLine)
    .filter((line) => {
      if (!line) return false;
      if (line === "." || line === ":" || line === "-") return false;
      if (/^(n\/a|none|null|undefined)$/i.test(line)) return false;
      return true;
    });

  for (const line of rawLines) {
    const headingMatch = line.match(headingRegex);

    if (headingMatch) {
      if (current.content.length > 0 || current.title) {
        sections.push(current);
      }

      current = {
        title: normalizeHeading(headingMatch[1]),
        content: [],
      };
    } else {
      current.content.push(line);
    }
  }

  if (current.content.length > 0 || current.title) {
    sections.push(current);
  }

  return sections.filter((section) => section.content.length > 0);
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split("\n")
      .map(cleanLine)
      .filter(Boolean);
  }

  return [];
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const isImportedJob = /^\d+$/.test(slug);

  const { data, error } = isImportedJob
    ? await supabase
        .from("job_imports")
        .select("*")
        .eq("id", Number(slug))
        .maybeSingle()
    : await supabase.from("jobs").select("*").eq("slug", slug).maybeSingle();

  if (error || !data) {
    console.error("Job detail fetch error:", error, "slug/id:", slug);
    notFound();
  }

  const job = data;
  const postedDate = job.date_posted || job.posted;
  const displayType = getDisplayType(job.title, job.position_type || job.type);
  const locationLabel = job.city || job.location || job.district;
  const href = applyHref(job.applyUrl);

  const importedDetails = isImportedJob
    ? parseStructuredText(job.additional_information)
    : [];

  const manualDescriptionSections = !isImportedJob
    ? parseStructuredText(job.job_description || job.overview)
    : [];

  const benefits = !isImportedJob ? toArray(job.benefits) : [];

  const legacyResponsibilities = !isImportedJob
    ? toArray(job.responsibilities)
    : [];

  const legacyRequirements = !isImportedJob ? toArray(job.requirements) : [];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/jobs"
          className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm transition hover:border-orange-500 hover:text-orange-600"
        >
          ← Back to Jobs
        </Link>

        <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-950">
                {job.title}
              </h1>

              <p className="mt-3 text-lg font-medium text-slate-700">
                {job.district}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {locationLabel}
                {job.county ? ` · ${job.county}` : ""}
              </p>

              {!isImportedJob && job.salary_range && (
                <p className="mt-4 text-xl font-semibold text-slate-950">
                  {job.salary_range}
                  {displayType ? ` · ${displayType}` : ""}
                </p>
              )}
            </div>

            {href && (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
              >
                Apply Now
              </a>
            )}
          </div>

          <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700 md:grid-cols-2">
            {displayType && (
              <p>
                <span className="font-semibold text-slate-950">
                  Position Type:
                </span>{" "}
                {displayType}
              </p>
            )}

            {postedDate && (
              <p>
                <span className="font-semibold text-slate-950">
                  Date Posted:
                </span>{" "}
                {formatDate(postedDate)}
              </p>
            )}

            {locationLabel && (
              <p>
                <span className="font-semibold text-slate-950">Location:</span>{" "}
                {job.location && job.location !== "District"
                  ? job.location
                  : locationLabel}
              </p>
            )}

            {(job.closing_date || job.closingDate) && (
              <p>
                <span className="font-semibold text-slate-950">
                  Closing Date:
                </span>{" "}
                {formatDate(job.closing_date || job.closingDate)}
              </p>
            )}

            {!isImportedJob && job.salary_range && (
              <p>
                <span className="font-semibold text-slate-950">
                  Salary Range:
                </span>{" "}
                {job.salary_range}
              </p>
            )}
          </div>

          {!isImportedJob && benefits.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-slate-950">
                Benefits
              </h2>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                <ul className="space-y-2 text-sm leading-7 text-slate-700">
                  {benefits.map((item, index) => (
                    <li key={`benefit-${index}`} className="ml-5 list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {!isImportedJob && manualDescriptionSections.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-slate-950">
                Job Description
              </h2>

              <div className="mt-4 space-y-6 rounded-2xl border border-slate-200 bg-white p-5">
                {manualDescriptionSections.map((section, index) => (
                  <div key={`manual-detail-${index}`}>
                    {section.title && (
                      <h3 className="mb-2 text-lg font-semibold text-slate-950">
                        {section.title}
                      </h3>
                    )}

                    <ul className="space-y-2 text-sm leading-7 text-slate-700">
                      {section.content.map((line, i) => (
                        <li key={i} className="ml-5 list-disc">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!isImportedJob && legacyResponsibilities.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-slate-950">
                Responsibilities
              </h2>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                <ul className="space-y-2 text-sm leading-7 text-slate-700">
                  {legacyResponsibilities.map((item, index) => (
                    <li key={`resp-${index}`} className="ml-5 list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {!isImportedJob && legacyRequirements.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-slate-950">
                Requirements
              </h2>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                <ul className="space-y-2 text-sm leading-7 text-slate-700">
                  {legacyRequirements.map((item, index) => (
                    <li key={`req-${index}`} className="ml-5 list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {isImportedJob && importedDetails.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-slate-950">
                Job Details
              </h2>

              <div className="mt-4 space-y-6 rounded-2xl border border-slate-200 bg-white p-5">
                {importedDetails.map((section, index) => (
                  <div key={`imported-detail-${index}`}>
                    {section.title && (
                      <h3 className="mb-2 text-lg font-semibold text-slate-950">
                        {section.title}
                      </h3>
                    )}

                    <ul className="space-y-2 text-sm leading-7 text-slate-700">
                      {section.content.map((line, i) => (
                        <li key={i} className="ml-5 list-disc">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {href && (
            <div className="mt-10 border-t border-slate-200 pt-6">
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
              >
                Apply for This Job
              </a>
            </div>
          )}
        </article>
      </div>
    </main>
  );
}