import Link from "next/link";

export default function EmployerSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
          ✅
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Thank you for your order.
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-600">
          Your employer submission and payment were received successfully.
        </p>

        <p className="mt-4 text-lg leading-8 text-slate-600">
          NJSchoolCareers will review and process your posting shortly.
        </p>

        <p className="mt-2 text-base text-slate-500">
          Most submissions are reviewed within 1 business day.
        </p>

        <div className="mt-8 rounded-2xl bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            What happens next?
          </h2>

          <ul className="mt-4 space-y-3 text-slate-600">
            <li>• Your payment has been successfully received</li>
            <li>• We will review your submission</li>
            <li>• Your posting will be activated after approval</li>
            <li>• You may be contacted if additional information is needed</li>
          </ul>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Questions?
          </h2>

          <p className="mt-3 text-slate-600">
            Contact:
          </p>

          <a
            href="mailto:info@njschoolcareers.com"
            className="mt-2 inline-block font-medium text-blue-600 hover:text-blue-700"
          >
            info@njschoolcareers.com
          </a>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Return Home
          </Link>

          <Link
            href="/employers"
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Employer Information
          </Link>
        </div>
      </div>
    </main>
  );
}