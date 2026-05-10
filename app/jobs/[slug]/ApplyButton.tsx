"use client";

type ApplyButtonProps = {
  href: string;
  district?: string | null;
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
  jobTitle,
  label,
  className,
}: ApplyButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={() => {
        window.gtag?.("event", "apply_click", {
          district,
          job_title: jobTitle,
        });
      }}
    >
      {label}
    </a>
  );
}