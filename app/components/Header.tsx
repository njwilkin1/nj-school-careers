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
          <Link href="/employers" className="hover:text-orange-600">Employers</Link>
          <Link href="/post-job" className="hover:text-orange-600">Post a Job</Link>
          <Link href="/about" className="hover:text-orange-600">About</Link>
          <Link href="/contact" className="hover:text-orange-600">Contact</Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 px-6 pb-4">
          <nav className="flex flex-col gap-4 pt-4 text-base text-slate-700">
            <Link href="/jobs" onClick={() => setOpen(false)}>Browse Jobs</Link>
            <Link href="/employers" onClick={() => setOpen(false)}>Employers</Link>
            <Link href="/post-job" onClick={() => setOpen(false)}>Post a Job</Link>
            <Link href="/about" onClick={() => setOpen(false)}>About</Link>
            <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
}