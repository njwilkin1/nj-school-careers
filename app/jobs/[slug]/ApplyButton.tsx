"use client";

import { openDirectApplication } from "@/app/utils/direct-application";

type ApplyButtonProps = {
  href: string;
  district?: string | null;
  county?: string | null;
  jobTitle?: string | null;
  label: string;
  className?: string;
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function ApplyButton({
  href,
  district,
  county,
  jobTitle,
  label,
  className,
}: ApplyButtonProps) {
  function handleApplyClick() {
    window.gtag?.("event", "apply_click", {
      district,
      county,
      job_title: jobTitle,
    });

    openDirectApplication(href);
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleApplyClick}
    >
      {label}
    </button>
  );
}
