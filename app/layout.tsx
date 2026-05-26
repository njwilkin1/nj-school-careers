import Header from "./components/Header";
import Script from "next/script";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NJ School Careers",
  description: "Find education jobs across New Jersey",

  icons: {
    icon: "/favicon-v2.png",
  },

  openGraph: {
    title: "NJ School Careers",
    description: "Find education jobs across New Jersey",
    images: ["/og-image-v2.png"],
  },

  twitter: {
    card: "summary_large_image",
    images: ["/og-image-v2.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">

  <Header />

  <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
            
            {/* Brand */}
            <div>
              <div className="text-2xl font-bold tracking-tight text-slate-900">
                NJSchoolCareers
              </div>
              <p className="mt-6 max-w-md text-lg leading-8 text-slate-600">
                Connecting educators and school professionals with opportunities
                across New Jersey.
              </p>
            </div>

            {/* Job Seekers */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Job Seekers
              </h3>
             <div className="mt-6 space-y-4 text-base text-slate-600">
  <a href="/jobs" className="block hover:text-orange-600">
    Browse Jobs
  </a>

  <a
    href="/career-resources"
    className="block hover:text-orange-600"
  >
    Career Resources
  </a>

  <a
    href="/jobs?search=Substitute"
    className="block hover:text-orange-600"
  >
    Substitute Roles
  </a>
</div>
            </div>

           {/* Employers */}
<div>
  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
    Employers
  </h3>
  <div className="mt-6 space-y-4 text-base text-slate-600">
    <a href="/post-job" className="block hover:text-orange-600">
      Post a Job
    </a>
    <a href="/employers" className="block hover:text-orange-600">
      Employer Info
    </a>
             <a href="/contact" className="block hover:text-orange-600">
  Contact Us
</a>
  </div>
</div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Company
              </h3>
              <div className="mt-6 space-y-4 text-base text-slate-600">
                <a href="/about" className="block hover:text-orange-600">
                  About NJSchoolCareers
                </a>
                <a href="/terms" className="block hover:text-orange-600">
                  Terms of Use
                </a>
                <a href="/privacy" className="block hover:text-orange-600">
                  Privacy Policy
                </a>
                <a href="/accessibility" className="hover:underline">
  Accessibility
</a>
              </div>
            </div>

          </div>

        <div className="border-t border-slate-200 px-6 py-8 text-center text-base text-slate-500">
  <div>© 2026 NJSchoolCareers. All rights reserved.</div>

  <div className="mt-4 flex justify-center gap-4">
    <a
      href="https://www.linkedin.com/company/njschoolcareers"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="NJSchoolCareers on LinkedIn"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 text-lg font-semibold hover:border-[#050B2C] hover:text-[#050B2C] transition"
    >
      <span className="font-bold">in</span>
    </a>

    <a
      href="https://www.facebook.com/NJSchoolCareers"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="NJSchoolCareers on Facebook"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 text-lg font-semibold hover:border-[#050B2C] hover:text-[#050B2C] transition"
    >
      <span className="font-bold">f</span>
    </a>
  </div>
</div>
        </footer>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6E5XTFDL3K"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6E5XTFDL3K');
          `}
        </Script>
      </body>
    </html>
  );
}