import { useCallback, useEffect, useId, useRef, useState, useMemo } from "react";
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
    const [searchQuery, setSearchQuery] = useState("");
    const listboxId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const listboxRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const searchStringRef = useRef("");

    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;
        const lowerQuery = searchQuery.toLowerCase();
        return options.filter((o) => o.label.toLowerCase().includes(lowerQuery));
    }, [options, searchQuery]);

    const allSuggestions = useMemo(() => {
        if (type !== "text" || !value || !options.length) return [];
        const search = value.toLowerCase();
        return options
            .filter((o) => o.label.toLowerCase().startsWith(search))
            .filter((o) => o.label.toLowerCase() !== search)
            .slice(0, 5);
    }, [type, value, options]);

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
                setSearchQuery("");
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        if (type === "select") {
            const selectedIdx = filteredOptions.findIndex((o) => o.value === value);
            if (selectedIdx >= 0) {
                setActiveIndex(selectedIdx);
            } else {
                setActiveIndex(filteredOptions.length > 0 ? 0 : -1);
            }
        }
    }, [filteredOptions, value, type]);

    useEffect(() => {
        if (activeIndex >= 0 && listboxRef.current) {
            const activeElement = document.getElementById(`${listboxId}-option-${activeIndex}`);
            if (activeElement) {
                const container = listboxRef.current;
                const elementTop = activeElement.offsetTop;
                const elementBottom = elementTop + activeElement.offsetHeight;
                const containerTop = container.scrollTop;
                const containerBottom = containerTop + container.clientHeight;

                const stickyHeader = container.querySelector(".sticky") as HTMLElement | null;
                const stickyOffset = stickyHeader ? stickyHeader.offsetHeight : 0;

                if (elementTop < containerTop + stickyOffset) {
                    container.scrollTop = elementTop - stickyOffset;
                } else if (elementBottom > containerBottom) {
                    container.scrollTop = elementBottom - container.clientHeight;
                }
            }
        }
    }, [activeIndex, listboxId]);

    const $ = useShortcut();

    const isFocused = useCallback(() => {
        if (typeof document === "undefined") return false;
        return containerRef.current?.contains(document.activeElement) ?? false;
    }, []);

    const openDropdown = useCallback(
        (keyboard: boolean = false) => {
            setIsOpen(true);
            setSearchQuery("");
            const idx = filteredOptions.findIndex((o) => o.value === value);
            if (idx >= 0) {
                setActiveIndex(idx);
            } else {
                setActiveIndex(filteredOptions.length > 0 ? 0 : -1);
            }
            setTimeout(() => searchInputRef.current?.focus(), 10);
        },
        [filteredOptions, value]
    );

    const closeDropdown = useCallback(() => {
        setIsOpen(false);
        setActiveIndex(-1);
        setSearchQuery("");
    }, []);

    const toggleDropdown = useCallback(() => {
        if (isOpen) closeDropdown();
        else openDropdown();
    }, [isOpen, closeDropdown, openDropdown]);

    const goToNextFilter = useCallback(() => {
        setTimeout(() => {
            if (!containerRef.current) return;
            const interactables = Array.from(
                document.querySelectorAll("[data-filter-field-interactable]:not(:disabled)")
            );
            const currentInteractable = containerRef.current.querySelector(
                "[data-filter-field-interactable]"
            );
            if (currentInteractable) {
                const idx = interactables.indexOf(currentInteractable);
                if (idx >= 0 && idx < interactables.length - 1) {
                    const nextEl = interactables[idx + 1] as HTMLElement;
                    nextEl.click();
                }
            }
        }, 10);
    }, []);

    useEffect(() => {
        const esc = $.key("escape").on((e) => {
            if (isOpen) {
                e.preventDefault();
                closeDropdown();
            } else if (isFocused() && value) {
                e.preventDefault();
                onChange?.("");
            }
        });

        const down = $.key("arrowdown").on((e) => {
            if (type === "text") return;
            if (isOpen) {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
            } else if (isFocused()) {
                e.preventDefault();
                openDropdown(true);
            }
        });

        const up = $.key("arrowup").on((e) => {
            if (type === "text") return;
            if (isOpen) {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
            }
        });

        const backspace = $.key("backspace").on((e) => {
            if (!isOpen && isFocused() && value) {
                e.preventDefault();
                onChange?.("");
            }
        });

        const handleSelection = (e: KeyboardEvent) => {
            if (type === "text") return;
            const target = e.target as HTMLElement;
            if (target?.closest("[data-filter-chip]")) {
                return;
            }

            if (isOpen) {
                if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
                    e.preventDefault();
                    onChange?.(filteredOptions[activeIndex].value);
                    closeDropdown();

                    goToNextFilter();
                }
            } else if (isFocused()) {
                e.preventDefault();
                openDropdown(true);
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
            backspace.unbind();
        };
    }, [isOpen, activeIndex, filteredOptions.length, isFocused, onChange, $, openDropdown, closeDropdown]);

    // Type-ahead
    useEffect(() => {
        if (!isOpen) return;

        const handleTypeahead = (e: KeyboardEvent) => {
            if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
            if (document.activeElement?.tagName === "INPUT") return;

            searchStringRef.current += e.key.toLowerCase();

            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(() => {
                searchStringRef.current = "";
            }, 500);

            const matchIndex = filteredOptions.findIndex((o) =>
                o.label.toLowerCase().startsWith(searchStringRef.current)
            );
            if (matchIndex >= 0) {
                setActiveIndex(matchIndex);
            }
        };

        window.addEventListener("keydown", handleTypeahead);
        return () => window.removeEventListener("keydown", handleTypeahead);
    }, [isOpen, filteredOptions]);

    const renderDropdown = () => {
        if (!isOpen) return null;
        return (
            <div
                ref={listboxRef}
                className={`absolute left-0 top-[calc(100%+0.5rem)] z-30 max-h-72 w-full overflow-y-scroll scrollbar-visible rounded-3xl border border-brand-border bg-background p-2 text-sm text-brand-ink shadow-brand-card flex flex-col ${options.length > 8 ? "pt-0" : ""}`}
                id={listboxId}
                role="listbox"
                aria-label={label}
                aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
            >
                {options.length > 8 && (
                    <div className="p-2 sticky top-0 bg-background z-10 -mx-2 mb-2 border-b border-brand-border">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Zoeken..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-brand-field rounded-field px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-ink/15"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
                                        onChange?.(filteredOptions[activeIndex].value);
                                        closeDropdown();
                                        goToNextFilter();
                                    }
                                } else if (e.key === "ArrowDown") {
                                    e.preventDefault();
                                    setActiveIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
                                } else if (e.key === "ArrowUp") {
                                    e.preventDefault();
                                    setActiveIndex((i) => Math.max(i - 1, 0));
                                } else if (e.key === "Escape") {
                                    e.preventDefault();
                                    closeDropdown();
                                }
                            }}
                        />
                    </div>
                )}

                {filteredOptions.length === 0 ? (
                    <div className="py-4 text-center text-brand-muted">Geen resultaten gevonden</div>
                ) : (
                    filteredOptions.map((option, index) => (
                        <button
                            key={option.value}
                            id={`${listboxId}-option-${index}`}
                            className={`flex min-h-11 w-full shrink-0 items-center rounded-2xl px-4 text-left transition hover:bg-brand-field-selected focus:bg-brand-field-selected focus:outline-none aria-selected:font-medium ${index === activeIndex ? "bg-brand-field-selected" : ""}`}
                            type="button"
                            role="option"
                            aria-selected={option.value === value}
                            onClick={() => {
                                onChange?.(option.value);
                                closeDropdown();
                                goToNextFilter();
                            }}
                            tabIndex={-1}
                        >
                            {option.label}
                        </button>
                    ))
                )}
            </div>
        );
    };

    if (type !== "select") {
        // Reset activeIndex when value changes to always start at the first suggestion
        useEffect(() => {
            setActiveIndex(0);
        }, [value]);

        const currentSuggestion =
            allSuggestions.length > 0 ? allSuggestions[activeIndex % allSuggestions.length].label : "";
        const showSuggestion = Boolean(currentSuggestion && currentSuggestion.toLowerCase() !== value.toLowerCase());

        return (
            <div className="relative" ref={containerRef}>
                <span className="mb-1 hidden pl-4 text-sm font-normal leading-5 text-brand-ink md:block">
                    {label}
                </span>
                <div
                    className={`relative flex h-filter-field w-full items-center rounded-field border-0 bg-brand-field text-sm leading-5 text-brand-ink transition hover:bg-brand-field-hover focus-within:ring-2 focus-within:ring-brand-ink/15 ${disabled ? "pointer-events-none opacity-50" : ""
                        }`}
                >
                    {showSuggestion && (
                        <div className="pointer-events-none absolute inset-0 flex items-center px-4">
                            <span className="opacity-0">{value}</span>
                            <span className="text-brand-ink/40">{currentSuggestion.slice(value.length)}</span>
                            {allSuggestions.length > 1 && (
                                <span className="ml-1.5 text-[10px] font-medium text-brand-muted/60 animate-in fade-in">
                                    ({(activeIndex % allSuggestions.length) + 1}/{allSuggestions.length})
                                </span>
                            )}
                            <span className="hidden md:inline-flex ml-2 items-center rounded border border-brand-ink/10 bg-white/60 px-1.5 py-0.5 text-[10px] font-bold text-brand-ink/40 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
                                TAB
                            </span>
                            {allSuggestions.length > 1 && (
                                <span className="ml-1 text-[10px] text-brand-muted/40 animate-in fade-in">or ↓</span>
                            )}
                        </div>
                    )}
                    <input
                        data-filter-field-interactable
                        className="h-full w-full appearance-none bg-transparent px-4 py-0 leading-[theme(spacing.filter-field)] outline-none placeholder:text-brand-ink"
                        value={value}
                        placeholder={placeholder}
                        disabled={disabled}
                        onChange={(e) => onChange?.(e.target.value)}
                        onKeyDown={(e) => {
                            if ((e.key === "Tab" || e.key === "Enter") && showSuggestion) {
                                e.preventDefault();
                                onChange?.(currentSuggestion);
                                goToNextFilter();
                            } else if (e.key === "Escape" && value) {
                                e.preventDefault();
                                onChange?.("");
                            } else if (e.key === "ArrowDown" && allSuggestions.length > 1) {
                                e.preventDefault();
                                setActiveIndex((i) => (i + 1) % allSuggestions.length);
                            } else if (e.key === "ArrowUp" && allSuggestions.length > 1) {
                                e.preventDefault();
                                setActiveIndex((i) => (i - 1 + allSuggestions.length) % allSuggestions.length);
                            }
                        }}
                    />
                </div>
            </div>
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
                    data-filter-field-interactable
                    className="flex min-w-0 flex-1 appearance-none items-center self-stretch p-0 text-left leading-none outline-none"
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-controls={listboxId}
                    disabled={disabled}
                    onClick={toggleDropdown}
                >
                    <span className="flex h-full min-w-0 flex-1 items-center">
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

                                // After the pill is removed, move focus back to this filter's trigger
                                setTimeout(() => {
                                    const el = containerRef.current?.querySelector(
                                        "[data-filter-field-interactable]"
                                    ) as HTMLElement | null;
                                    el?.focus();
                                }, 10);
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
                    onClick={toggleDropdown}
                >
                    <ChevronDownIcon
                        className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                </button>
            </div>

            {renderDropdown()}
        </div>
    );
}
