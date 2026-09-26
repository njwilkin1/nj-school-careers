"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center">
            <img
              src="/NJSchoolCareers-logo-header.png"
              alt="NJSchoolCareers"
              width={450}
              height={92}
              className="h-16 w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-700 md:flex">
            <Link href="/jobs" className="hover:text-orange-600">
              Browse Jobs
            </Link>

            <Link href="/career-resources" className="hover:text-orange-600">
              Career Resources
            </Link>

            <Link href="/about" className="hover:text-orange-600">
              About
            </Link>
          </nav>
        </div>

        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 md:flex">
          <Link href="/employers" className="hover:text-orange-600">
            Employers / Post Job
          </Link>

        </nav>

        <button
          className="text-3xl text-[#050B2C] hover:text-orange-600 md:hidden"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-6 pb-6 md:hidden">
          <nav className="flex flex-col gap-5 pt-5 text-base font-medium text-slate-700">
            <Link href="/jobs" onClick={() => setOpen(false)}>
              Browse Jobs
            </Link>

            <Link href="/career-resources" onClick={() => setOpen(false)}>
              Career Resources
            </Link>

            <Link href="/about" onClick={() => setOpen(false)}>
              About
            </Link>

            <div className="border-t border-slate-200 pt-5" />

            <Link href="/employers" onClick={() => setOpen(false)}>
              Employers / Post Job
            </Link>

          </nav>
        </div>
      )}
    </header>
  );
}