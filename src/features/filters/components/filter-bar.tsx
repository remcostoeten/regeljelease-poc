"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { clsx } from "clsx";
import { CheckIcon } from "@/shared/ui/icons";
import { CodeBlock } from "./code-block";
import { toOptions, formatTotal } from "../helpers/format";
import { FILTER_USPS, PRICE_OPTIONS } from "../constants";
import type { FilterRes } from "../types";
import { useFilters } from "../data/hooks/use-filters";
import { FilterField } from "./filter-field";

type Props = { initialData: FilterRes };

const easeOut = [0.32, 0.72, 0, 1] as const;
const uiTransition = { duration: 0.22, ease: easeOut };
const pressed = { scale: 0.97 };

/**
 * A smooth counter that slides digits when the number changes.
 * Provides that premium "fintech" or "dashboard" feel.
 */
function NumberCounter({ value, skipAnimation }: { value: number; skipAnimation?: boolean }) {
    const shouldReduceMotion = useReducedMotion();
    const skipMotion = skipAnimation || shouldReduceMotion;

    return (
        <motion.span
            key={value}
            initial={skipMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={skipMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={uiTransition}
            className="inline-block tabular-nums"
        >
            {formatTotal(value)}
        </motion.span>
    );
}

// Animated loading dots following Emil Kowalski principles:
// - staggered opacity (props-transform-opacity)
// - 300ms cycle max (timing-300ms-max)
// - ease-out (ease-out-default)
// - respects prefers-reduced-motion (polish-reduced-motion)
function LoadingDots() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <span
            className="inline-flex items-center gap-[3px]"
            aria-hidden="true"
            role="presentation"
        >
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0.35, scale: shouldReduceMotion ? 1 : 0.9 }}
                    animate={
                        shouldReduceMotion
                            ? { opacity: [0.35, 1, 0.35] }
                            : { opacity: [0.35, 1, 0.35], scale: [0.9, 1, 0.9] }
                    }
                    transition={{
                        duration: 0.72,
                        repeat: Infinity,
                        delay: i * 0.12,
                        ease: easeOut,
                    }}
                    className="h-[5px] w-[5px] rounded-full bg-current"
                />
            ))}
        </span>
    );
}

export function FilterBar({ initialData }: Props) {
    const [showExtraFilters, setShowExtraFilters] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const shouldReduceMotion = useReducedMotion();
    const { filters, setFilter, suggestions, total, url, isPending, error } =
        useFilters(initialData);

    const isFirstRender = useRef(true);
    useEffect(() => {
        isFirstRender.current = false;
    }, []);

    const trefwoordOptions = useMemo(() => {
        const all = [
            ...suggestions.brandName,
            ...suggestions.modelName,
            ...suggestions.bodyStyle,
            ...suggestions.fuel,
            ...suggestions.transmission,
        ];

        const uniqueValues = new Set<string>();
        const uniqueSuggestions = all.filter((s) => {
            if (uniqueValues.has(s.value)) return false;
            uniqueValues.add(s.value);
            return true;
        });

        const formatted = toOptions(uniqueSuggestions);

        if (!filters.text) return formatted;

        const search = filters.text.toLowerCase();
        return formatted.filter((o) => o.label.toLowerCase().startsWith(search));
    }, [suggestions, filters.text]);

    return (
        <section className="mx-auto w-full max-w-page px-5 sm:px-8">
            <motion.form
                layout={!shouldReduceMotion}
                transition={uiTransition}
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!isPending) {
                        setShowResult(true);
                    }
                }}
                className="flex flex-col justify-end gap-4 rounded-card bg-brand-surface p-6 shadow-brand-card"
            >
                <div className="grid gap-4 md:grid-cols-4">
                    <FilterField
                        label="Merk"
                        placeholder="Voeg een merk toe"
                        options={toOptions(suggestions.brandName)}
                        value={filters.brand}
                        onChange={(v) => setFilter("brand", v)}
                    />
                    <FilterField
                        label="Model"
                        placeholder="Kies de modellen"
                        options={toOptions(suggestions.modelName)}
                        value={filters.model}
                        onChange={(v) => setFilter("model", v)}
                        disabled={!filters.brand}
                    />
                    <FilterField
                        label="Budget tot"
                        placeholder="tot..."
                        options={PRICE_OPTIONS.filter(
                            (o) =>
                                Number(o.value) <= (suggestions?.priceLease?.max ?? Infinity) &&
                                Number(o.value) >= (suggestions?.priceLease?.min ?? 0),
                        )}
                        value={filters.maxPrice}
                        onChange={(v) => setFilter("maxPrice", v)}
                    />
                    <FilterField
                        label="Trefwoord"
                        placeholder="Trefwoord... bijv. GTI of L2H2"
                        type="text"
                        options={trefwoordOptions}
                        value={filters.text}
                        onChange={(v) => setFilter("text", v)}
                    />
                </div>

                <AnimatePresence initial={false}>
                    {showExtraFilters ? (
                        <motion.div
                            key="extra-filters"
                            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                            transition={uiTransition}
                            className="mt-1 grid gap-4 md:grid-cols-4"
                        >
                            {[
                                <FilterField
                                    key="fuel"
                                    label="Brandstof"
                                    placeholder="Kies brandstof"
                                    options={toOptions(suggestions.fuel)}
                                    value={filters.fuel}
                                    onChange={(v) => setFilter("fuel", v)}
                                />,
                                <FilterField
                                    key="transmission"
                                    label="Transmissie"
                                    placeholder="Kies transmissie"
                                    options={toOptions(suggestions.transmission)}
                                    value={filters.transmission}
                                    onChange={(v) => setFilter("transmission", v)}
                                />,
                                <FilterField
                                    key="body-style"
                                    label="Carrosserie"
                                    placeholder="Kies carrosserie"
                                    options={toOptions(suggestions.bodyStyle)}
                                    value={filters.bodyStyle}
                                    onChange={(v) => setFilter("bodyStyle", v)}
                                />,
                                <FilterField
                                    key="max-mileage"
                                    label="Max. kilometerstand"
                                    placeholder="bijv. 50.000 km"
                                    type="text"
                                    value={filters.maxMileage}
                                    onChange={(v) => setFilter("maxMileage", v)}
                                />,
                            ].map((field, index) => (
                                <motion.div
                                    key={field.key}
                                    initial={
                                        shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }
                                    }
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ ...uiTransition, delay: index * 0.025 }}
                                >
                                    {field}
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                {error ? (
                    <p className="text-sm text-red-600" role="alert">
                        {error}
                    </p>
                ) : null}

                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <ul className="hidden flex-wrap items-center gap-x-2 gap-y-3 py-2 text-sm text-brand-ink md:flex">
                        {FILTER_USPS.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                                <CheckIcon />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row md:items-center">
                        <button
                            className="text-sm font-medium text-brand-muted underline underline-offset-2 transition-colors duration-200 ease-out hover:text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-ink/20"
                            type="button"
                            onClick={() => setShowExtraFilters((c) => !c)}
                            aria-expanded={showExtraFilters}
                        >
                            {showExtraFilters ? "- Minder filters" : "+ Meer filters"}
                        </button>

                        <motion.button
                            layout
                            type="submit"
                            disabled={isPending}
                            transition={uiTransition}
                            className={clsx(
                                "relative flex h-14 w-full items-center justify-center overflow-hidden rounded-field bg-brand-ink px-7 text-base font-semibold text-white md:w-auto",
                                "transition-colors duration-200 ease-out will-change-transform",
                                isPending
                                    ? "cursor-wait"
                                    : "hover:bg-brand-ink-strong focus:outline-none focus:ring-2 focus:ring-brand-ink/30 focus:ring-offset-2",
                            )}
                        >
                            {/* Shimmer effect when pending */}
                            <AnimatePresence>
                                {isPending && !shouldReduceMotion && (
                                    <motion.div
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "100%" }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.2,
                                            ease: "linear",
                                        }}
                                        className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                                    />
                                )}
                            </AnimatePresence>

                            <motion.div
                                layout
                                className="relative z-10 flex items-center justify-center gap-2"
                            >
                                <AnimatePresence mode="wait">
                                    {isPending ? (
                                        <motion.div
                                            key="loading"
                                            initial={
                                                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }
                                            }
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={
                                                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }
                                            }
                                            transition={uiTransition}
                                            className="flex items-center gap-3"
                                        >
                                            <span className="text-sm font-medium uppercase tracking-wider opacity-80">
                                                Zoeken
                                            </span>
                                            <LoadingDots />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="label"
                                            initial={
                                                isFirstRender.current
                                                    ? false
                                                    : shouldReduceMotion
                                                        ? { opacity: 0 }
                                                        : { opacity: 0, scale: 0.95 }
                                            }
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={
                                                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }
                                            }
                                            transition={uiTransition}
                                            className="flex items-center gap-1.5"
                                        >
                                            <span className="whitespace-nowrap">Aanbod bekijken</span>
                                            <div className="flex items-center text-white">
                                                <span>(</span>
                                                <NumberCounter value={total} skipAnimation={isFirstRender.current} />
                                                <span>)</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.button>

                    </div>
                </div>
            </motion.form>

            <AnimatePresence>
                {showResult && (
                    <motion.div
                        key="result"
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                        transition={uiTransition}
                        className="mt-8"
                    >
                        <CodeBlock
                            language="json"
                            fileName="poc-result.json"
                            code={JSON.stringify(
                                {
                                    summary: {
                                        total_results: total,
                                        generated_url: `https://www.regeljelease.nl${url}`,
                                        message:
                                            "POC: In a real app, clicking 'Aanbod bekijken' would navigate to the URL below.",
                                    },
                                    activeFilters: Object.fromEntries(
                                        Object.entries(filters).filter(([_, v]) => v !== ""),
                                    ),
                                    api_response: { total, suggestions },
                                },
                                null,
                                2,
                            )}
                            badges={[]}
                            showLineNumbers={true}
                            enableLineHighlight={true}
                            showIcon={true}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
