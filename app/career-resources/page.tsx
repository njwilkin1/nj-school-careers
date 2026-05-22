import Link from "next/link";

const resources = [
  {
    title: "NJ Teacher Resume Tips",
    description:
      "Practical resume tips for New Jersey teachers applying to school districts.",
    href: "/career-resources/nj-teacher-resume-tips",
  },
  {
    title: "Education Interview Tips",
    description:
      "Common teacher interview questions and advice for answering with confidence.",
    href: "/career-resources/nj-teacher-interview-questions",
  },
  {
    title: "Cover Letter Advice",
    description:
      "Simple guidance for writing a strong education cover letter.",
    href: "/career-resources/cover-letter-advice",
  },
  {
    title: "Classroom Management Tips",
    description:
      "Helpful strategies for building routines, expectations, and student trust.",
    href: "/career-resources/classroom-management-tips",
  },
{
  title: "Teacher Demo Lesson Tips",
  description:
    "How to prepare, present, and succeed during a teaching demo lesson interview.",
  href: "/career-resources/teacher-demo-lesson-tips",
},
  {
    title: "School Leadership Careers",
    description:
      "Resources for aspiring assistant principals, principals, and school leaders.",
    href: "/career-resources/becoming-a-principal-in-new-jersey",
  },
  {
    title: "NJ Certification Resources",
    description:
      "Understand common New Jersey certification pathways and requirements.",
    href: "/career-resources/ce-vs-ceas-new-jersey",
  },
  {
    title: "Networking & Job Search Tips",
    description:
      "Ideas for finding more education opportunities and standing out professionally.",
    href: "/career-resources/networking-job-search-tips",
  },
];

export default function CareerResourcesPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            NJ Education Career Help
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Career Resources
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Evergreen job search, resume, interview, certification, and school
            leadership resources for New Jersey educators.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Link
              key={resource.href}
              href={resource.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
            >
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-orange-600">
                {resource.title}
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                {resource.description}
              </p>

              <span className="mt-5 inline-block font-semibold text-orange-500">
                Read resource →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}