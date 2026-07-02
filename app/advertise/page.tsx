import Link from "next/link";

export const metadata = {
  title: "Advertise with NJSchoolCareers | Reach New Jersey Educators",
  description:
    "Advertise your education program, service, or organization to New Jersey educators and school professionals through NJSchoolCareers.",
};

const audienceStats = [
  ["6,000+", "Education Jobs Listed"],
  ["150+", "School Districts Represented"],
  ["327+", "Job Alert Subscribers"],
  ["Updated", "Daily"],
  ["NJ-Focused", "Education Audience"],
];

const advertiserTypes = [
  "Colleges & Universities",
  "Graduate Education Programs",
  "Teacher Certification Programs",
  "Professional Development Providers",
  "Summer Camps",
  "Education Staffing Agencies",
  "EdTech Companies",
  "Tutoring & Test Prep Companies",
  "Education Consultants",
  "Organizations Serving Educators",
];

const adPlacements = [
  {
    title: "Homepage Banner Ad",
    description: "Large rectangular placement near the top of the homepage.",
    size: "Suggested size: 970x90 or responsive equivalent.",
    price: "Contact for pricing",
  },
  {
    title: "Sidebar Square Ad",
    description: "Square ad placement near featured jobs or career resources.",
    size: "Suggested size: 300x250.",
    price: "Contact for pricing",
  },
  {
    title: "Career Resource Sponsorship",
    description:
      "Sponsor high-intent pages read by educators preparing resumes, interviews, certification, and career moves.",
    size: "Premium content placement.",
    price: "Contact for pricing",
  },
  {
    title: "Sponsored Partner Feature",
    description:
      "Feature your organization with a short description, logo, link, and call-to-action.",
    size: "Partner spotlight placement.",
    price: "Contact for pricing",
  },
  {
    title: "Social Media Promotion",
    description:
      "Additional promotion through NJSchoolCareers social media channels.",
    size: "Social post promotion.",
    price: "Contact for pricing",
  },
  {
    title: "Custom Campaign",
    description:
      "Website placement, social promotion, and featured visibility combined.",
    size: "Customized campaign.",
    price: "Contact for pricing",
  },
];

const whyAdvertise = [
  "Reach a highly targeted New Jersey education audience",
  "Advertise alongside 6,000+ education job opportunities",
  "Connect with educators actively searching for career advancement",
  "A focused, cost-effective alternative to broad online advertising",
];

const goodFit = [
  "Graduate degrees",
  "Supervisor certification",
  "Principal certification",
  "Alternate route programs",
  "Teacher certification support",
  "Professional learning",
  "Education products and services",
  "Summer employment",
  "Education conferences",
  "Staffing and recruiting services",
];

const advertisingEmail =
  "mailto:advertising@njschoolcareers.com?subject=Advertising%20Inquiry%20-%20NJSchoolCareers";

export default function AdvertisePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-r from-sky-50 via-blue-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.12),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(249,115,22,0.08),_transparent_30%)]" />

        <div className="relative mx-auto max-w-[1200px] px-6 py-16 text-center md:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
            Advertise With Us
          </p>

          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Reach New Jersey Educators and School Professionals
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Promote your programs, services, products, or opportunities to
            educators actively searching for New Jersey education jobs.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={advertisingEmail}
              className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Request Advertising Information
            </a>

            <Link
              href="/employers/pricing"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-500 hover:text-blue-700"
            >
              View Employer Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* AUDIENCE STATS */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1200px] gap-4 px-6 py-8 text-center sm:grid-cols-2 lg:grid-cols-5">
          {audienceStats.map(([number, label]) => (
            <div key={label} className="rounded-2xl bg-slate-50 p-5">
              <div className="text-2xl font-bold text-slate-950">
                {number}
              </div>
              <p className="mt-1 text-sm font-medium text-slate-600">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY ADVERTISE */}
      <section className="mx-auto max-w-[1200px] px-6 py-14">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Why Advertise With Us?
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              A focused way to reach New Jersey educators
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              NJSchoolCareers connects education-focused organizations with
              teachers, administrators, school staff, and education
              professionals across New Jersey.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {whyAdvertise.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="font-semibold text-slate-900">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO SHOULD ADVERTISE */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-14">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Who Should Advertise?
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              Built for organizations serving educators
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-slate-600">
              NJSchoolCareers is a strong fit for education-related
              organizations that want to reach New Jersey educators and school
              professionals.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {advertiserTypes.map((type) => (
              <div
                key={type}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center font-semibold text-slate-800"
              >
                {type}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AD PLACEMENTS */}
      <section className="mx-auto max-w-[1200px] px-6 py-14">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Advertising Opportunities
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Premium placements for education-focused advertisers
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-slate-600">
            Ads are clearly labeled, education-relevant, and designed to keep
            NJSchoolCareers clean, trustworthy, and useful for job seekers.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {adPlacements.map((placement) => (
            <div
              key={placement.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="text-xl font-bold text-slate-950">
                {placement.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {placement.description}
              </p>

              <p className="mt-4 text-sm font-medium text-slate-500">
                {placement.size}
              </p>

              <div className="mt-6 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">
                {placement.price}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GOOD FIT */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                Good Fit For
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Promote programs and services educators care about
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                NJSchoolCareers is especially useful for organizations that want
                to connect with educators considering career growth,
                certification, professional learning, employment, or education
                services.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {goodFit.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="mx-auto max-w-[1200px] px-6 py-14">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Rate Information
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Contact the Sales Department
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-700">
                PLEASE CONTACT THE SALES DEPARTMENT
                <br />
                AT{" "}
                <a
                  href="tel:2017465250"
                  className="font-semibold text-blue-700 hover:text-blue-800"
                >
                  (201) 746-5250
                </a>{" "}
                FOR RATE INFORMATION
              </p>

              <p className="mt-4">
                <a
                  href="mailto:advertising@njschoolcareers.com"
                  className="font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-800"
                >
                  advertising@njschoolcareers.com
                </a>
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-6">
              <h3 className="text-2xl font-bold text-slate-950">
                Sales Staff
              </h3>

              <p className="mt-3 text-slate-700">
                Reach your target market, call us at{" "}
                <a
                  href="tel:2017465250"
                  className="font-semibold text-blue-700 hover:text-blue-800"
                >
                  (201) 746-5250
                </a>
              </p>

              <div className="mt-6 border-t border-slate-200 pt-6">
                <p className="font-bold text-slate-950">Wilkin Santana</p>
                <p className="mt-1 text-slate-700">
                  Advertising/Sales Director
                </p>
                <a
                  href="mailto:wsantana@njschoolcareers.com"
                  className="mt-2 inline-block font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-800"
                >
                  wsantana@njschoolcareers.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">
            Want to reach New Jersey educators?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Tell us what you would like to promote and we will recommend the
            best advertising option.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={advertisingEmail}
              className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Request Advertising Information
            </a>

            <Link
              href="/employers/pricing"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-500 hover:text-blue-700"
            >
              View Employer Pricing
            </Link>
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-xs leading-6 text-slate-500">
            NJSchoolCareers accepts advertising from organizations serving
            educators. Advertising does not constitute an endorsement or
            recommendation by NJSchoolCareers.
          </p>
        </div>
      </section>
    </main>
  );
}