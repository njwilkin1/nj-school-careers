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

        <footer className="border-t border-slate-200 bg-slate-50">
  <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3">
    <div>
      <div className="text-2xl font-bold tracking-tight text-slate-300">
        NJSchoolCareers
      </div>
      <p className="mt-6 max-w-md text-xl leading-10 text-slate-600">
        Connecting educators and school professionals with opportunities across New Jersey.
      </p>
    </div>

    <div>
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Job Seekers
      </h3>
      <div className="mt-6 space-y-4 text-lg text-slate-600">
        <a href="/jobs" className="block hover:text-slate-900">
          Browse Jobs
        </a>
        <a href="/jobs?search=Substitute" className="block hover:text-slate-900">
          Substitute Roles
        </a>
      </div>
    </div>

    <div>
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Employers
      </h3>
      <div className="mt-6 space-y-4 text-lg text-slate-600">
        <a href="/post-job" className="block hover:text-slate-900">
          Post a Job
        </a>
        <a href="/#employers" className="block hover:text-slate-900">
          Employer Info
        </a>
      </div>
    </div>
  </div>

  <div className="border-t border-slate-200 px-6 py-8 text-center text-lg text-slate-500">
    © 2026 NJSchoolCareers. All rights reserved.
  </div>
</footer>
      </body>
    </html>
  );
}