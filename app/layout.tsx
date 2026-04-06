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
        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-10">
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <div className="text-lg font-bold">NJSchoolCareers</div>
                <p className="mt-3 text-sm text-slate-600">
                  Connecting educators and school professionals with
                  opportunities across New Jersey.
                </p>
              </div>

              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Job Seekers
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>
                    <a href="/jobs" className="hover:text-slate-900">
                      Browse Jobs
                    </a>
                  </li>
                  <li>
                    <a
                      href="/jobs/substitute-teacher"
                      className="hover:text-slate-900"
                    >
                      Substitute Roles
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Employers
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>
                    <a href="#" className="hover:text-slate-900">
                      Post a Job
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-slate-900">
                      Employer Info
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
              © {new Date().getFullYear()} NJSchoolCareers. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}