"use client";

import { useState } from "react";
import { CheckIcon } from "@/shared/ui/icons";
import { EXTRA_FILTERS, FILTER_USPS, PRIMARY_FILTERS } from "../lib/constants";
import { FilterField } from "./filter-field";

export function FilterBar() {
  const [showExtraFilters, setShowExtraFilters] = useState(false);

  return (
    <section className="mx-auto w-full max-w-page px-5 sm:px-8">
      <div className="flex flex-col justify-end gap-4 rounded-card bg-brand-surface p-6 shadow-brand-card">
        <div className="grid gap-4 md:grid-cols-4">
          {PRIMARY_FILTERS.map((field) => (
            <FilterField
              key={field.label}
              label={field.label}
              placeholder={field.placeholder}
              selected={"selected" in field ? field.selected : undefined}
              type={field.type}
              options={"options" in field ? field.options : undefined}
            />
          ))}
        </div>

        {showExtraFilters ? (
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {EXTRA_FILTERS.map((field) => (
              <FilterField
                key={field.label}
                label={field.label}
                placeholder={field.placeholder}
                type={field.type}
                options={"options" in field ? field.options : undefined}
              />
            ))}
          </div>
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
              className="text-sm font-medium text-brand-muted underline underline-offset-2 transition hover:text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-ink/20"
              type="button"
              onClick={() => setShowExtraFilters((current) => !current)}
              aria-expanded={showExtraFilters}
            >
              {showExtraFilters ? "- Minder filters" : "+ Meer filters"}
            </button>
            <button
              className="h-14 w-full rounded-field bg-brand-ink px-7 text-base font-semibold text-white transition hover:bg-brand-ink-strong focus:outline-none focus:ring-2 focus:ring-brand-ink/30 focus:ring-offset-2 md:w-auto"
              type="button"
            >
              Aanbod bekijken (20.334)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
