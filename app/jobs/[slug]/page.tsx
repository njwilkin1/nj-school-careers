import Link from "next/link";

import { notFound } from "next/navigation";
import { Metadata } from "next";
import ApplyButton from "./ApplyButton";
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

function slugify(value: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getCategoryLinks(title: string) {
  const value = title.toLowerCase();

  const links = [];

  if (value.includes("special education")) {
    links.push({
      href: "/jobs/special-education-teacher",
      label: "Special Education",
    });
  }

  if (value.includes("spanish")) {
    links.push({
      href: "/jobs/spanish-teacher",
      label: "Spanish Teacher",
    });
  }

  if (value.includes("substitute")) {
    links.push({
      href: "/jobs/substitute-teacher",
      label: "Substitute Teacher",
    });
  }

  if (value.includes("paraprofessional")) {
    links.push({
      href: "/jobs/paraprofessional",
      label: "Paraprofessional",
    });
  }

  if (value.includes("counselor")) {
    links.push({
      href: "/jobs/school-counselor",
      label: "School Counselor",
    });
  }

  if (value.includes("math")) {
    links.push({
      href: "/jobs/math-teacher",
      label: "Math Teacher",
    });
  }

  if (value.includes("science")) {
    links.push({
      href: "/jobs/science-teacher",
      label: "Science Teacher",
    });
  }

  if (value.includes("elementary")) {
    links.push({
      href: "/jobs/elementary-teacher",
      label: "Elementary Teacher",
    });
  }

  return links;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const isImportedJob = /^\d+$/.test(slug);

  const { data } = isImportedJob
    ? await supabase
        .from("job_imports")
        .select("*")
        .eq("id", Number(slug))
        .maybeSingle()
    : await supabase.from("jobs").select("*").eq("slug", slug).maybeSingle();

  if (!data) {
    return {
      title: "Job Not Found | NJSchoolCareers",
    };
  }

  const title = `${data.title} Jobs in New Jersey | NJSchoolCareers`;

  const description = `${data.title} position available at ${
    data.district
  } in ${
    data.city || data.location || "New Jersey"
  }. View qualifications, responsibilities, and apply online through NJSchoolCareers.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.njschoolcareers.com/jobs/${slug}`,
      siteName: "NJSchoolCareers",
      type: "article",
    },
  };
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
        .or("status.eq.published,status.is.null")
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
  const href = applyHref(job.applyUrl || job.apply_url);
  const categoryLinks = getCategoryLinks(job.title || "");

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: job.title,
            description: job.description || job.title,
            datePosted: job.created_at,
            hiringOrganization: {
              "@type": "Organization",
              name: job.district || "NJSchoolCareers",
              sameAs: "https://www.njschoolcareers.com",
            },
            jobLocation: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                addressLocality: job.city || "New Jersey",
                addressRegion: "NJ",
                addressCountry: "US",
              },
            },
            employmentType: "FULL_TIME",
            url: `https://www.njschoolcareers.com/jobs/${job.slug || job.id}`,
          }),
        }}
      />

        <main className="min-h-screen bg-slate-50 px-6 pb-28 pt-12 text-slate-900 md:pb-12">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
  <Link
    href="/"
    className="hover:text-orange-600 hover:underline"
  >
    Home
  </Link>

  <span>/</span>

  <Link
    href="/jobs"
    className="hover:text-orange-600 hover:underline"
  >
    Jobs
  </Link>

  {job.county && (
    <>
      <span>/</span>

      <Link
        href={`/counties/${slugify(job.county)}`}
        className="hover:text-orange-600 hover:underline"
      >
        {job.county}
      </Link>
    </>
  )}

  {job.district && (
    <>
      <span>/</span>

      <Link
        href={`/districts/${slugify(job.district)}`}
        className="hover:text-orange-600 hover:underline"
      >
        {job.district}
      </Link>
    </>
  )}

  <span>/</span>

  <span className="font-medium text-slate-700">
    {job.title}
  </span>
</nav>

          <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-950">
                  {job.title}
                </h1>

                <p className="mt-3 text-lg font-medium text-slate-700">
                  <Link
                    href={`/districts/${slugify(job.district || "")}`}
                    className="hover:text-orange-600 hover:underline"
                  >
                    {job.district}
                  </Link>
                </p>

                {categoryLinks.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {categoryLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700 hover:bg-orange-100"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}

                {locationLabel && locationLabel !== job.district && (
                  <p className="mt-2 text-sm text-slate-500">
                    {locationLabel}

                    {job.county && (
                      <>
                        {" · "}

                        <Link
                          href={`/counties/${slugify(job.county)}`}
                          className="hover:text-orange-600 hover:underline"
                        >
                          {job.county}
                        </Link>
                      </>
                    )}
                  </p>
                )}

                {!isImportedJob && job.salary_range && (
                  <p className="mt-4 text-xl font-semibold text-slate-950">
                    {job.salary_range}
                    {displayType ? ` · ${displayType}` : ""}
                  </p>
                )}
              </div>

              {href && (
                <ApplyButton
                  href={href}
                  district={job.district}
                  county={job.county}
                  jobTitle={job.title}
                  label="Apply Now"
                  className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
                />
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
                  <span className="font-semibold text-slate-950">
                    Location:
                  </span>{" "}
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

            <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-2xl font-semibold text-slate-950">
                Explore More New Jersey School Jobs
              </h2>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/jobs"
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-orange-50"
                >
                  Browse All Jobs
                </Link>

                {job.district && (
                  <Link
                    href={`/districts/${slugify(job.district)}`}
                    className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-orange-50"
                  >
                    More jobs from {job.district}
                  </Link>
                )}

                {job.county && (
                  <Link
                    href={`/counties/${slugify(job.county)}`}
                    className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-orange-50"
                  >
                    More jobs in {job.county}
                  </Link>
                )}

                {categoryLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-orange-50"
                  >
                    {item.label} Jobs
                  </Link>
                ))}
              </div>
            </div>

            {href && (
              <div className="mt-10 border-t border-slate-200 pt-6">
                <ApplyButton
                  href={href}
                  district={job.district}
                  county={job.county}
                  jobTitle={job.title}
                  label="Apply for This Job"
                  className="inline-block rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
                />
              </div>
            )}
          </article>
        </div>
        {href && (
  <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white p-4 shadow-lg md:hidden">
    <ApplyButton
      href={href}
      district={job.district}
      county={job.county}
      jobTitle={job.title}
      label="Apply Now"
      className="block w-full rounded-2xl bg-orange-500 px-6 py-4 text-center text-lg font-semibold text-white shadow-sm transition hover:bg-orange-600"
    />
  </div>
)}
      </main>
    </>
  );
}