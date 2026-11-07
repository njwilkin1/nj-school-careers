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
          Your employer payment is being processed securely by Stripe.
        </p>

        <p className="mt-4 text-lg leading-8 text-slate-600">
          Once payment and access are confirmed, you can continue with your job
          posting.
        </p>

        <p className="mt-4 text-base leading-7 text-slate-600">
          Please use the same email address you entered during checkout when you
          continue to the posting form. Access may take a short time to become
          available while payment processing completes.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/post-job"
            className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Continue to Job Posting
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Return Home
          </Link>
        </div>

        <div className="mt-8 rounded-2xl bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            What happens next?
          </h2>

          <ul className="mt-4 space-y-3 text-slate-600">
            <li>• Your payment is being verified securely</li>
            <li>• We confirm employer access after processing completes</li>
            <li>• You can submit your job once your access is active</li>
            <li>• We may contact you if additional information is needed</li>
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
            href="/post-job"
            className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Continue to Job Posting
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