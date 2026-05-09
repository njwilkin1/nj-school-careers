export const metadata = {
  title: "Accessibility Statement | NJSchoolCareers.com",
  description:
    "Accessibility statement for NJSchoolCareers.com, including our commitment to website accessibility and user support.",
};

export default function AccessibilityPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold">Accessibility Statement</h1>

      <div className="space-y-5 text-base leading-7 text-gray-700">
        <p>
          NJSchoolCareers.com is committed to making our website accessible and
          user-friendly for all visitors, including individuals with
          disabilities.
        </p>

        <p>
          We are continually working to improve the accessibility and usability
          of our website and strive to follow relevant accessibility standards,
          including the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA,
          where reasonably applicable.
        </p>

        <p>
          NJSchoolCareers.com helps connect job seekers with employment
          opportunities posted by schools, districts, organizations, and other
          employers. In many cases, job seekers may be directed to third-party
          employer websites, email addresses, or application systems. These
          third-party websites and systems are not controlled by
          NJSchoolCareers.com and may have their own accessibility practices,
          policies, or limitations.
        </p>

        <p>
          If you experience difficulty accessing any part of
          NJSchoolCareers.com, please contact us and let us know the specific
          page, feature, or content that caused the issue. We will make
          reasonable efforts to address accessibility concerns and provide
          assistance where possible.
        </p>

        <p>
          <strong>Contact:</strong>{" "}
          <a
            href="mailto:njwilkin@hotmail.com"
            className="underline"
          >
            info@njschoolcareers.com
          </a>
        </p>

        <p>
          NJSchoolCareers.com welcomes feedback as we continue improving the
          accessibility, usability, and overall experience of our website.
        </p>
      </div>
    </main>
  );
}