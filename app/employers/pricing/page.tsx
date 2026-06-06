const pricingPlans = [
  {
    title: "Standard Job Posting",
    price: "$99",
    description:
      "30-day school job listing with featured search placement and direct application links.",
    button: "Post a Job",
    link: "https://buy.stripe.com/28E00l4AmbCP6xD6GC8IU00",
  },
  {
    title: "Featured Job Visibility",
    price: "$49",
    description:
      "Highlighted placement for urgent or hard-to-fill educational positions.",
    button: "Boost a Job",
    link: "https://buy.stripe.com/14AfZj4AmfT59JPe948IU03",
  },
  {
    title: "Urgent Hiring Promotion",
    price: "$99",
    description:
      "Priority promotion for urgent hiring needs and hard-to-fill educational positions.",
    button: "Promote Opening",
    link: "https://buy.stripe.com/00w00l9UGfT5e058OK8IU04",
  },
  {
    title: "Social Media Promotion",
    price: "$49",
    description:
      "Additional promotion of school job openings through NJSchoolCareers social channels.",
    button: "Add Promotion",
    link: "https://buy.stripe.com/9B68wRgj4bCP3lrfd88IU05",
  },
  {
    title: "Monthly Unlimited Plan",
    price: "$349 / month",
    description:
      "Unlimited monthly job postings with priority placement and featured employer visibility. Annual agreement required.",
    button: "Start Monthly Plan",
    link: "https://buy.stripe.com/dRmcN73widKX8FL0ie8IU02",
    badge: "Most Popular",
  },
  {
    title: "District Unlimited Plan",
    price: "$1,999 / year",
    description:
      "Unlimited school-year job postings with featured district visibility, ongoing recruitment promotion, priority employer placement, and over 50% savings compared to monthly billing.",
    button: "Start Annual Plan",
    link: "https://buy.stripe.com/28EeVf0k65er09f8OK8IU01",
    badge: "Best Value",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="uppercase tracking-[0.3em] text-sm font-semibold text-orange-500 mb-4">
            NJ Education Recruitment
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-6">
            Employer Pricing
          </h1>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Simple recruiting plans for New Jersey school districts, private
            schools, charter schools, and education organizations.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {pricingPlans.map((plan) => (
            <div
  key={plan.title}
  className={`rounded-2xl border bg-white p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition ${
    plan.badge
      ? "border-[#ffd7b0] ring-2 ring-[#fff3e8]"
      : "border-slate-200"
  }`}
>
              <div>

               {plan.badge && (
  <div
    className={`inline-block mb-4 text-sm font-semibold px-3 py-1 rounded-full ${
      plan.badge === "Best Value"
        ? "bg-green-100 text-green-700"
        : "bg-orange-100 text-orange-700"
    }`}
  >
    {plan.badge}
  </div>
)}

                <h2 className="text-2xl font-bold text-[#0f172a] mb-4">
                  {plan.title}
                </h2>

                <div className="text-5xl font-bold text-[#0f172a] mb-5">
                  {plan.price}
                </div>

                <p className="text-slate-600 leading-relaxed text-lg">
                  {plan.description}
                </p>
              </div>

              <a
                href={plan.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex justify-center items-center rounded-xl bg-[#007c89] hover:bg-[#006b75] text-white font-semibold py-3 px-5 transition"
              >
                {plan.button}
              </a>
            </div>
          ))}
        </div>

        {/* PO Section */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-[#0f172a] mb-4">
            Purchase Orders Accepted
          </h3>

          <p className="text-slate-600 leading-relaxed">
            Public school districts and educational organizations may request
            invoices or purchase order billing arrangements by contacting us directly.
          </p>

          <div className="mt-4">
            <a
              href="mailto:info@njschoolcareers.com"
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              info@njschoolcareers.com
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-sm text-slate-500 leading-relaxed">
        </div>

        {/* Contact */}
        <div className="mt-10 text-center">
          <h4 className="text-xl font-bold text-[#0f172a] mb-3">
            Questions?
          </h4>

          <p className="text-slate-600">
            Email:{" "}
            <a
              href="mailto:info@njschoolcareers.com"
              className="text-orange-600 hover:text-orange-700"
            >
              info@njschoolcareers.com
            </a>
          </p>

          <p className="text-slate-600 mt-1">(201) 746-5250</p>
        </div>

      </div>
    </main>
  );
}