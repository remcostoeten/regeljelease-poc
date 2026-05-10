import { useId, useState } from "react";
import { ChevronDownIcon } from "@/shared/ui/icons";
import { FilterChip } from "./filter-chip";

type Props = {
  label: string;
  placeholder: string;
  selected?: string;
  type?: "select" | "text";
  options?: readonly string[];
};

export function FilterField({
  label,
  placeholder,
  selected,
  type = "select",
  options = [],
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(selected ?? "");
  const listboxId = useId();

  if (type !== "select") {
    return (
      <label className="block">
        <span className="mb-1 hidden pl-4 text-sm font-normal leading-5 text-brand-ink md:block">
          {label}
        </span>
        <input
          className="h-filter-field w-full rounded-field border-0 bg-brand-field px-4 text-sm leading-5 text-brand-ink outline-none transition placeholder:text-brand-ink hover:bg-brand-field-hover focus:ring-2 focus:ring-brand-ink/15"
          value={inputValue}
          placeholder={placeholder}
          onChange={(event) => setInputValue(event.target.value)}
        />
      </label>
    );
  }

  return (
    <div className="relative">
      <span className="mb-1 hidden pl-4 text-sm font-normal leading-5 text-brand-ink md:block">
        {label}
      </span>
      <div className="flex h-filter-field w-full items-center gap-2 rounded-field border-0 bg-brand-field px-4 text-sm leading-5 text-brand-ink transition hover:bg-brand-field-hover focus-within:ring-2 focus-within:ring-brand-ink/15">
        <button
          className="flex min-w-0 flex-1 self-stretch text-left outline-none"
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="flex min-w-0 flex-1 items-center">
            <span className="min-w-0 truncate">{placeholder}</span>
          </span>
        </button>

        {selectedValue ? (
          <span className="min-w-0 max-w-[52%] shrink-0">
            <FilterChip
              label={selectedValue}
              onClear={() => setSelectedValue("")}
            />
          </span>
        ) : null}

        <button
          className="-mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full outline-none transition hover:bg-white/50 focus:ring-2 focus:ring-brand-ink/15"
          type="button"
          aria-label={`${isOpen ? "Sluit" : "Open"} ${label}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          onClick={() => setIsOpen((current) => !current)}
        >
          <ChevronDownIcon
            className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isOpen ? (
        <div
          className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-full overflow-hidden rounded-3xl border border-brand-border bg-background p-2 text-sm text-brand-ink shadow-brand-card"
          id={listboxId}
          role="listbox"
          aria-label={label}
        >
          {options.map((option) => (
            <button
              key={option}
              className="flex min-h-11 w-full items-center rounded-2xl px-4 text-left transition hover:bg-brand-field focus:bg-brand-field focus:outline-none"
              type="button"
              role="option"
              aria-selected={option === selectedValue}
              onClick={() => {
                setSelectedValue(option);
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
