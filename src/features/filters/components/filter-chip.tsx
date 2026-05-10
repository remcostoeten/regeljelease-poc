type FilterChipProps = {
  label: string;
};

export function FilterChip({ label }: FilterChipProps) {
  return (
    <span className="inline-flex h-[22px] items-center gap-2 rounded-full bg-brand-field-selected px-2 text-sm font-normal leading-none text-brand-ink">
      {label}
      <span aria-hidden="true">x</span>
    </span>
  );
}
