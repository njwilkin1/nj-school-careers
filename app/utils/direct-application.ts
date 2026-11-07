export function openDirectApplication(url: string) {
  const target = url.trim();

  if (!target) {
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  const opened = window.open(target, "_blank", "noopener,noreferrer");

  if (!opened) {
    window.location.href = target;
  }
}
