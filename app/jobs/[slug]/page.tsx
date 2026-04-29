import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type PageProps = {
  params: Promise<{ slug: string }>;
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

function cleanJobDetailText(text: string) {
  return text
    .replace(/�/g, "-")
    .replace(/\s+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1. $2")
    .replace(/(Position Description)/gi, "\n\n$1\n")
    .replace(/(Qualifications)/gi, "\n\n$1\n")
    .replace(/(Skills, Knowledge, and Personal Qualities)/gi, "\n\n$1\n")
    .replace(/(Responsibilities)/gi, "\n\n$1\n")
    .replace(/(Requirements)/gi, "\n\n$1\n")
    .replace(/(Salary Range)/gi, "\n\n$1\n")
    .replace(/(Salary)/gi, "\n\n$1\n")
    .replace(/(Benefits)/gi, "\n\n$1\n")
    .replace(/(Hours)/gi, "\n\n$1\n")
    .replace(/(Reports directly to)/gi, "\n\n$1")
    .replace(/(Holds a New Jersey)/gi, "\n• $1")
    .replace(/(Demonstrated ability)/gi, "\n• $1")
    .replace(/(Ability to communicate)/gi, "\n• $1")
    .trim();
}

function normalizeHeading(title: string) {
  return title
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

function formatAdditionalInfo(text: string) {
  if (!text) return [];

  const cleaned = cleanJobDetailText(text);

  const headings = [
    "Position Description",
    "Qualifications",
    "Skills, Knowledge, and Personal Qualities",
    "Responsibilities",
    "Requirements",
    "Salary Range",
    "Salary",
    "Benefits",
    "Hours",
  ];

  const pattern = new RegExp(`(${headings.join("|")})`, "gi");
  const parts = cleaned
    .split(pattern)
    .map((p) => p.trim())
    .filter(Boolean);

  const formatted: { title: string | null; content: string[] }[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    const isHeading = headings.some(
      (h) => h.toLowerCase() === part.toLowerCase()
    );

    const rawContent = isHeading ? parts[i + 1] || "" : part;

    const lines = rawContent
      .split(/•|\n|\.(?=\s+[A-Z])/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) continue;

    formatted.push({
      title: isHeading ? normalizeHeading(part) : null,
      content: lines,
    });

    if (isHeading) i++;
  }

  const seen = new Set<string>();

  return formatted.filter((section) => {
    if (!section.title) return true;

    const key = section.title.toLowerCase();
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
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
  const jobDetails = job.additional_information
    ? formatAdditionalInfo(job.additional_information)
    : [];

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
                {job.city || job.location || job.district}
                {job.county ? ` · ${job.county}` : ""}
              </p>
            </div>

            {job.applyUrl && (
              <a
                href={job.applyUrl}
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

            {(job.city || job.location) && (
              <p>
                <span className="font-semibold text-slate-950">Location:</span>{" "}
                {job.location && job.location !== "District"
                  ? job.location
                  : job.city}
              </p>
            )}

            {job.closing_date && (
              <p>
                <span className="font-semibold text-slate-950">
                  Closing Date:
                </span>{" "}
                {formatDate(job.closing_date)}
              </p>
            )}
          </div>

          {jobDetails.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-slate-950">
                Job Details
              </h2>

              <div className="mt-4 space-y-6 rounded-2xl border border-slate-200 bg-white p-5">
                {jobDetails.map((section, index) => (
                  <div key={`detail-${index}`}>
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

          {job.applyUrl && (
            <div className="mt-10 border-t border-slate-200 pt-6">
              <a
                href={job.applyUrl}
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