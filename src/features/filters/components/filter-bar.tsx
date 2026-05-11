"use client";

import { useState } from "react";
import { CheckIcon } from "@/shared/ui/icons";
import { toOptions, formatTotal } from "../helpers/format";
import { FILTER_USPS, PRICE_OPTIONS } from "../constants";
import type { HomeApiResponse } from "../types";
import { useFilters } from "../data/hooks/use-filters";
import { FilterField } from "./filter-field";

type Props = { initialData: HomeApiResponse };

export function FilterBar({ initialData }: Props) {
  const [showExtraFilters, setShowExtraFilters] = useState(false);
  const { filters, setFilter, suggestions, total, isPending, error } =
    useFilters(initialData);

  return (
    <section className="mx-auto w-full max-w-page px-5 sm:px-8">
      <div className="flex flex-col justify-end gap-4 rounded-card bg-brand-surface p-6 shadow-brand-card">
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
              (o) => Number(o.value) <= (suggestions?.priceLease?.max ?? Infinity),
            )}
            value={filters.maxPrice}
            onChange={(v) => setFilter("maxPrice", v)}
          />
          <FilterField
            label="Trefwoord"
            placeholder="Trefwoord... bijv. GTI of L2H2"
            type="text"
            value={filters.text}
            onChange={(v) => setFilter("text", v)}
          />
        </div>

        {/* Extra filters */}
        {showExtraFilters ? (
          <div className="mt-1 grid gap-4 md:grid-cols-4">
            <FilterField
              label="Brandstof"
              placeholder="Kies brandstof"
              options={toOptions(suggestions.fuel)}
              value={filters.fuel}
              onChange={(v) => setFilter("fuel", v)}
            />
            <FilterField
              label="Transmissie"
              placeholder="Kies transmissie"
              options={toOptions(suggestions.transmission)}
              value={filters.transmission}
              onChange={(v) => setFilter("transmission", v)}
            />
            <FilterField
              label="Carrosserie"
              placeholder="Kies carrosserie"
              options={toOptions(suggestions.bodyStyle)}
              value={filters.bodyStyle}
              onChange={(v) => setFilter("bodyStyle", v)}
            />
            <FilterField
              label="Max. kilometerstand"
              placeholder="bijv. 50.000 km"
              type="text"
              value={filters.maxMileage}
              onChange={(v) => setFilter("maxMileage", v)}
            />
          </div>
        ) : null}

        {/* Error message */}
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        {/* Footer row */}
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
              className="text-sm font-medium text-brand-muted underline underline-offset-2 transition hover:text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-ink/20"
              type="button"
              onClick={() => setShowExtraFilters((c) => !c)}
              aria-expanded={showExtraFilters}
            >
              {showExtraFilters ? "- Minder filters" : "+ Meer filters"}
            </button>
            <button
              className="h-14 w-full rounded-field bg-brand-ink px-7 text-base font-semibold text-white transition hover:bg-brand-ink-strong focus:outline-none focus:ring-2 focus:ring-brand-ink/30 focus:ring-offset-2 disabled:opacity-60 md:w-auto"
              type="button"
              disabled={isPending}
            >
              {isPending
                ? "Laden..."
                : `Aanbod bekijken (${formatTotal(total)})`}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

