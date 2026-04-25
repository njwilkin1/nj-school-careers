export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
          Legal
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
          Privacy Policy
        </h1>

        <p className="mt-4 text-sm text-slate-500">
          Last updated: April 25, 2026
        </p>

        <p className="mt-6 leading-8 text-slate-700">
          NJSchoolCareers.com respects your privacy. This Privacy Policy explains
          what information we collect, how we use it, and the choices you have
          when using our website.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">
          1. Information We Collect
        </h2>

        <p className="mt-3 leading-8 text-slate-700">
          We may collect information that you voluntarily provide through the
          website, including:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
          <li>Email addresses submitted for job alerts or email subscriptions.</li>
          <li>
            Job alert preferences, such as county, keyword, and job type.
          </li>
          <li>
            Employer or school contact information submitted through job posting
            forms, such as contact name, contact email, job title, district or
            organization name, location, job type, application link, and job
            description details.
          </li>
          <li>
            Messages or other information you send to us by email or through
            forms.
          </li>
        </ul>

        <p className="mt-4 leading-8 text-slate-700">
          We may also collect limited technical information automatically, such as
          browser type, device information, pages visited, referral source, and
          general usage data through analytics tools.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">
          2. How We Use Information
        </h2>

        <p className="mt-3 leading-8 text-slate-700">
          We use the information we collect to:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
          <li>Send job alerts and subscription emails.</li>
          <li>Process and review job posting submissions.</li>
          <li>Display and organize job listings on NJSchoolCareers.com.</li>
          <li>Communicate with job seekers, employers, and school representatives.</li>
          <li>Improve website performance, usability, content, and search experience.</li>
          <li>Research how users interact with the website and improve our services.</li>
          <li>Protect the website from misuse, spam, fraud, or unauthorized activity.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">
          3. Email Subscriptions and Job Alerts
        </h2>

        <p className="mt-3 leading-8 text-slate-700">
          If you subscribe to job alerts, we may use your email address and alert
          preferences to send relevant job opportunities. Subscriber information
          may be stored in Supabase and used with Resend to deliver emails.
        </p>

        <p className="mt-3 leading-8 text-slate-700">
          You may request removal from our email list at any time by contacting
          us at{" "}
          <a
            href="mailto:info@njschoolcareers.com"
            className="font-medium text-orange-600 hover:text-orange-700"
          >
            info@njschoolcareers.com
          </a>
          .
        </p>

        <h2 className="mt-8 text-2xl font-semibold">
          4. Job Posting Submissions
        </h2>

        <p className="mt-3 leading-8 text-slate-700">
          When an employer, school, district, or representative submits a job
          through our website, the submitted information may be sent through
          Formspree and delivered to us by email. We may use that information to
          review, edit, publish, or follow up about the job posting.
        </p>

        <p className="mt-3 leading-8 text-slate-700">
          Job posting information that is intended for publication, such as job
          title, employer name, location, job type, overview, responsibilities,
          requirements, and application link, may be displayed publicly on the
          website.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">
          5. Third-Party Services We Use
        </h2>

        <p className="mt-3 leading-8 text-slate-700">
          We use third-party services to operate and improve NJSchoolCareers.com.
          These may include:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
          <li>
            <strong>Supabase</strong> for database storage and website backend
            functionality.
          </li>
          <li>
            <strong>Resend</strong> for sending subscription and job alert emails.
          </li>
          <li>
            <strong>Formspree</strong> for receiving and processing website form
            submissions.
          </li>
          <li>
            <strong>Google Analytics</strong> for analytics, research, and
            website improvement.
          </li>
          <li>
            <strong>Vercel</strong> for website hosting and deployment.
          </li>
        </ul>

        <p className="mt-4 leading-8 text-slate-700">
          These providers may process information according to their own privacy
          policies and security practices. Supabase, Resend, Formspree, and
          Google each publish information about their privacy and data handling
          practices. Google requires websites using Google Analytics to disclose
          the use of Google Analytics and how it collects and processes data.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">
          6. Cookies and Analytics
        </h2>

        <p className="mt-3 leading-8 text-slate-700">
          We use Google Analytics to understand how visitors use the website and
          to improve the experience for job seekers and employers. Google
          Analytics may use cookies or similar technologies to collect usage
          information, such as pages visited, browser type, device type, and
          general location information.
        </p>

        <p className="mt-3 leading-8 text-slate-700">
          You can control cookies through your browser settings. You can also
          learn more about how Google uses information from sites and apps that
          use its services by visiting Google’s privacy resources.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">
          7. Payments and Future Employer Accounts
        </h2>

        <p className="mt-3 leading-8 text-slate-700">
          NJSchoolCareers.com is currently offering free job posting during the
          launch period. In the future, we may offer paid job postings, featured
          listings, invoicing for school districts, or employer accounts.
        </p>

        <p className="mt-3 leading-8 text-slate-700">
          If we begin collecting payments, payment information may be processed
          by a third-party payment provider, such as Stripe, and/or through
          invoicing systems. We do not intend to store full payment card details
          directly on NJSchoolCareers.com.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">
          8. How We Share Information
        </h2>

        <p className="mt-3 leading-8 text-slate-700">
          We do not sell personal information. We may share information when
          necessary to operate the website, provide services, communicate with
          users, comply with legal obligations, protect our rights, or work with
          service providers that help us run NJSchoolCareers.com.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">
          9. Data Security
        </h2>

        <p className="mt-3 leading-8 text-slate-700">
          We take reasonable steps to protect the information we collect.
          However, no website, database, email system, or internet transmission
          is completely secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">
          10. Data Retention
        </h2>

        <p className="mt-3 leading-8 text-slate-700">
          We keep information for as long as needed to provide our services,
          maintain records, improve the website, comply with legal obligations,
          resolve disputes, or enforce our agreements. You may contact us to
          request deletion of your email subscription information.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">
          11. Children’s Privacy
        </h2>

        <p className="mt-3 leading-8 text-slate-700">
          NJSchoolCareers.com is intended for job seekers, employers, schools,
          districts, and adult users. We do not knowingly collect personal
          information from children under 13. If you believe a child has provided
          personal information to us, please contact us so we can take appropriate
          action.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">
          12. Your Choices
        </h2>

        <p className="mt-3 leading-8 text-slate-700">
          You may contact us to request access, correction, or deletion of
          personal information you have provided to us. You may also request to
          be removed from job alerts or email communications.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">
          13. Changes to This Policy
        </h2>

        <p className="mt-3 leading-8 text-slate-700">
          We may update this Privacy Policy from time to time. The updated
          version will be posted on this page with a revised “Last updated” date.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">
          14. Contact Us
        </h2>

        <p className="mt-3 leading-8 text-slate-700">
          If you have questions about this Privacy Policy or how your information
          is handled, contact us at{" "}
          <a
            href="mailto:info@njschoolcareers.com"
            className="font-medium text-orange-600 hover:text-orange-700"
          >
            info@njschoolcareers.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}