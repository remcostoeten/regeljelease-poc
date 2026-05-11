type Props = {
  label: string;
  onClear?: (e: React.MouseEvent) => void;
};

export function FilterChip({ label, onClear }: Props) {
  if (onClear) {
    return (
      <button
        className="inline-flex h-[22px] max-w-full min-w-0 items-center gap-2 rounded-full bg-brand-field-selected px-2 text-sm font-normal leading-none text-brand-ink transition hover:bg-brand-muted/25 focus:outline-none focus:ring-2 focus:ring-brand-ink/20"
        type="button"
        onClick={onClear}
        data-filter-chip
      >
        <span className="min-w-0 truncate">{label}</span>
        <span className="shrink-0" aria-hidden="true">
          ×
        </span>
        <span className="sr-only">Verwijder {label}</span>
      </button>
    );
  }

  return (
    <span className="inline-flex h-[22px] max-w-full min-w-0 items-center rounded-full bg-brand-field-selected px-2 text-sm font-normal leading-none text-brand-ink">
      <span className="min-w-0 truncate">{label}</span>
    </span>
  );
}
