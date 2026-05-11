import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useShortcut } from "@remcostoeten/use-shortcut/react";
import { ChevronDownIcon } from "@/shared/ui/icons";
import type { FieldOption } from "../types";
import { FilterChip } from "./filter-chip";

export type { FieldOption } from "../types";

type Props = {
  label: string;
  placeholder: string;
  type?: "select" | "text";
  options?: FieldOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

export function FilterField({
  label,
  placeholder,
  type = "select",
  options = [],
  value = "",
  onChange,
  disabled = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value) ?? null;

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [options]);

  useEffect(() => {
    if (activeIndex >= 0 && listboxRef.current) {
      const activeElement = listboxRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        const container = listboxRef.current;
        const elementTop = activeElement.offsetTop;
        const elementBottom = elementTop + activeElement.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;

        if (elementTop < containerTop) {
          container.scrollTop = elementTop;
        } else if (elementBottom > containerBottom) {
          container.scrollTop = elementBottom - container.clientHeight;
        }
      }
    }
  }, [activeIndex]);

  const $ = useShortcut();

  const isFocused = useCallback(() => {
    if (typeof document === "undefined") return false;
    return containerRef.current?.contains(document.activeElement) ?? false;
  }, []);

  useEffect(() => {
    const esc = $.key("escape").on((e) => {
      if (isOpen) {
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
      }
    });

    const down = $.key("arrowdown").on((e) => {
      if (isOpen) {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
      } else if (isFocused()) {
        e.preventDefault();
        setIsOpen(true);
        setActiveIndex(0);
      }
    });

    const up = $.key("arrowup").on((e) => {
      if (isOpen) {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
    });

    const handleSelection = (e: KeyboardEvent) => {
      if (isOpen) {
        if (activeIndex >= 0 && activeIndex < options.length) {
          e.preventDefault();
          onChange?.(options[activeIndex].value);
          setIsOpen(false);
          setActiveIndex(-1);
        }
      } else if (isFocused()) {
        e.preventDefault();
        setIsOpen(true);
        setActiveIndex(0);
      }
    };

    const enter = $.key("enter").on(handleSelection);
    const space = $.key("space").on(handleSelection);

    return () => {
      esc.unbind();
      down.unbind();
      up.unbind();
      enter.unbind();
      space.unbind();
    };
  }, [isOpen, activeIndex, options.length, isFocused, onChange, $]);

  if (type !== "select") {
    return (
      <label className="block">
        <span className="mb-1 hidden pl-4 text-sm font-normal leading-5 text-brand-ink md:block">
          {label}
        </span>
        <input
          className="h-filter-field w-full rounded-field border-0 bg-brand-field px-4 text-sm leading-5 text-brand-ink outline-none transition placeholder:text-brand-ink hover:bg-brand-field-hover focus:ring-2 focus:ring-brand-ink/15 disabled:opacity-50"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </label>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <span className="mb-1 hidden pl-4 text-sm font-normal leading-5 text-brand-ink md:block">
        {label}
      </span>
      <div
        className={`flex h-filter-field w-full items-center gap-2 rounded-field border-0 bg-brand-field px-4 text-sm leading-5 text-brand-ink transition hover:bg-brand-field-hover focus-within:ring-2 focus-within:ring-brand-ink/15 ${disabled ? "pointer-events-none opacity-50" : ""}`}
      >
        <button
          className="flex min-w-0 flex-1 self-stretch text-left outline-none"
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          disabled={disabled}
          onClick={() => setIsOpen((o) => !o)}
        >
          <span className="flex min-w-0 flex-1 items-center">
            <span className="min-w-0 truncate text-brand-muted">
              {placeholder}
            </span>
          </span>
        </button>

        {selectedOption ? (
          <span className="min-w-0 max-w-[52%] shrink-0">
            <FilterChip
              label={selectedOption.label}
              onClear={() => {
                onChange?.("");
                setIsOpen(false);
              }}
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
          disabled={disabled}
          onClick={() => setIsOpen((o) => !o)}
        >
          <ChevronDownIcon
            className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isOpen && options.length > 0 ? (
        <div
          ref={listboxRef}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-30 max-h-72 w-full overflow-y-auto rounded-3xl border border-brand-border bg-background p-2 text-sm text-brand-ink shadow-brand-card"
          id={listboxId}
          role="listbox"
          aria-label={label}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              className={`flex min-h-11 w-full items-center rounded-2xl px-4 text-left transition hover:bg-brand-field-selected focus:bg-brand-field-selected focus:outline-none aria-selected:font-medium ${index === activeIndex ? "bg-brand-field-selected" : ""}`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange?.(option.value);
                setIsOpen(false);
                setActiveIndex(-1);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

