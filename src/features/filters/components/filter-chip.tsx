type FilterChipProps = {
  label: string;
  onClear?: () => void;
};

export function FilterChip({ label, onClear }: FilterChipProps) {
  if (onClear) {
    return (
      <button
        className="inline-flex h-[22px] max-w-full min-w-0 items-center gap-2 rounded-full bg-brand-field-selected px-2 text-sm font-normal leading-none text-brand-ink transition hover:bg-brand-muted/25 focus:outline-none focus:ring-2 focus:ring-brand-ink/20"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClear();
        }}
      >
        <span className="min-w-0 truncate">{label}</span>
        <span className="shrink-0" aria-hidden="true">
          x
        </span>
        <span className="sr-only">Verwijder {label}</span>
      </button>
    );
  }

  return (
    <span className="inline-flex h-[22px] max-w-full min-w-0 items-center gap-2 rounded-full bg-brand-field-selected px-2 text-sm font-normal leading-none text-brand-ink">
      <span className="min-w-0 truncate">{label}</span>
      <span className="shrink-0" aria-hidden="true">
        x
      </span>
    </span>
  );
}
