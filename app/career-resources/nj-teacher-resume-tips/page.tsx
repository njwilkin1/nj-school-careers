import Link from "next/link";

export default function NJTeacherResumeTipsPage() {
  return (
    <main className="bg-slate-50 py-16">
      <div className="mx-auto max-w-4xl px-6">

        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12">

          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-600">
            Career Resources
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            How to Write a Strong Teacher Resume
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-700">
            A strong teacher resume can help you stand out in a competitive job market.
            Many qualified candidates are overlooked simply because their resumes fail
            to clearly showcase their experience, strengths, and potential value to a
            school district.
          </p>

          <p className="mt-6 text-lg leading-8 text-slate-700">
            Your resume is not a curriculum vitae or a complete history of every job
            you have ever held. Instead, it should be a focused and professional
            document that highlights the experience and qualifications most relevant
            to the teaching position you are applying for.
          </p>

          <p className="mt-6 text-lg leading-8 text-slate-700">
            Whether you are a first-year teacher or an experienced educator, a
            polished resume can help you make a strong first impression with hiring
            administrators and school districts throughout New Jersey.
          </p>

          <h2 className="mt-12 text-2xl font-bold text-slate-900">
            Use a Professional and Unique Format
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-700">
            School districts review many resumes during the hiring process, so your
            resume should be clean, organized, and visually appealing. A professional
            format helps employers quickly identify your strengths and qualifications.
          </p>

          <p className="mt-6 text-lg leading-8 text-slate-700">
            Think of your resume as your professional introduction. It should clearly
            communicate your teaching experience, certifications, classroom skills,
            and accomplishments while remaining easy to read and navigate.
          </p>

          <h2 className="mt-12 text-2xl font-bold text-slate-900">
            Proofread Carefully
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-700">
            Attention to detail matters in education. Even small spelling or grammar
            mistakes can leave a negative impression on hiring administrators.
          </p>

          <p className="mt-6 text-lg leading-8 text-slate-700">
            Before submitting your resume, review it multiple times and ask trusted
            colleagues, mentors, or friends to proofread it as well. A polished,
            error-free resume demonstrates professionalism and strong communication
            skills.
          </p>

          <h2 className="mt-12 text-2xl font-bold text-slate-900">
            Make Your Resume Easy to Read
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-700">
            Hiring managers often spend only a short amount of time reviewing each
            application. Your resume should be easy to scan with clear headings,
            clean spacing, and readable fonts.
          </p>

          <p className="mt-6 text-lg leading-8 text-slate-700">
            Professional fonts such as Arial, Calibri, or Times New Roman are good
            choices. Use bold section headings and consistent formatting to help key
            information stand out.
          </p>

          <h2 className="mt-12 text-2xl font-bold text-slate-900">
            Tailor Your Resume to Each School District
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-700">
            One of the best ways to strengthen your resume is to customize it for
            each position you apply for. Research the school district and review the
            job description carefully before submitting your application.
          </p>

          <p className="mt-6 text-lg leading-8 text-slate-700">
            Highlight the skills, experiences, and qualifications that align most
            closely with the district’s needs. Tailoring your resume shows initiative
            and demonstrates genuine interest in the position.
          </p>

          <div className="mt-14 rounded-2xl bg-slate-100 p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900">
              Ready to Apply?
            </h3>

            <p className="mt-4 text-lg text-slate-700">
              Browse current New Jersey education jobs and find teaching opportunities
              across the state.
            </p>

            <Link
              href="/jobs"
              className="mt-6 inline-flex rounded-xl bg-orange-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-orange-600"
            >
              Browse Current NJ Education Jobs
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}