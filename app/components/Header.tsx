"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-slate-900">
          NJSchoolCareers
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 text-sm text-slate-700">
          <Link href="/jobs" className="hover:text-orange-600">Browse Jobs</Link>
          <Link href="/post-job" className="hover:text-orange-600">Post a Job</Link>
          <Link href="/about" className="hover:text-orange-600">About</Link>
          <Link href="/contact" className="hover:text-orange-600">Contact</Link>
        </nav>

        {/* Mobile Hamburger (UPDATED) */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden flex h-12 w-12 items-center justify-center rounded-xl text-3xl font-bold text-slate-900 hover:bg-slate-100"
          aria-label="Open menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 px-6 pb-4">
          <nav className="flex flex-col gap-4 pt-4 text-base font-medium text-slate-800">
            <Link href="/jobs" onClick={() => setOpen(false)} className="hover:text-orange-600">
              Browse Jobs
            </Link>
            <Link href="/post-job" onClick={() => setOpen(false)} className="hover:text-orange-600">
              Post a Job
            </Link>
            <Link href="/about" onClick={() => setOpen(false)} className="hover:text-orange-600">
              About
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="hover:text-orange-600">
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}