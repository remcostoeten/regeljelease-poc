"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-canvas px-5 text-center">
      <h1 className="font-heading text-2xl font-medium text-brand-ink">
        Er is iets misgegaan
      </h1>
      <p className="text-sm text-brand-muted">
        {error.message || "Onbekende fout"}
      </p>
      <button
        className="h-12 rounded-field bg-brand-ink px-6 text-sm font-semibold text-white transition hover:bg-brand-ink-strong focus:outline-none focus:ring-2 focus:ring-brand-ink/30 focus:ring-offset-2"
        type="button"
        onClick={reset}
      >
        Opnieuw proberen
      </button>
    </main>
  );
}
