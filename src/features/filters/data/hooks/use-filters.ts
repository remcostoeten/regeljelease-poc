"use client";

import { useRef, useState, useTransition } from "react";
import { useDebounceCallback } from "@/shared/hooks/use-debounce";
import { fetchSuggestions } from "../queries/fetch-suggestions";
import type { FilterParams, HomeApiResponse } from "../../types";

const TEXT_KEYS = new Set<keyof FilterParams>(["text", "maxMileage"]);
const DEBOUNCE_MS = 400;

const EMPTY_FILTERS: Required<FilterParams> = {
  brand: "",
  model: "",
  maxPrice: "",
  fuel: "",
  transmission: "",
  bodyStyle: "",
  maxMileage: "",
  text: "",
};

export function useFilters(initialData: HomeApiResponse) {
  const [filters, setFilters] = useState<Required<FilterParams>>(EMPTY_FILTERS);
  const [suggestions, setSuggestions] = useState(initialData.suggestions);
  const [total, setTotal] = useState(initialData.total);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  function runFetch(params: Required<FilterParams>) {
    startTransition(async () => {
      try {
        const result = await fetchSuggestions(params);
        setSuggestions(result.suggestions);
        setTotal(result.total);
        setError(null);
      } catch (err) {
        console.error("[useFilters]", err);
        setError("Kon het aanbod niet laden. Probeer het opnieuw.");
      }
    });
  }

  const debouncedFetch = useDebounceCallback(runFetch, DEBOUNCE_MS);

  function setFilter(key: keyof FilterParams, value: string) {
    const next: Required<FilterParams> = {
      ...filtersRef.current,
      [key]: value,
    };
    if (key === "brand") next.model = "";
    setFilters(next);

    debouncedFetch.cancel();

    if (TEXT_KEYS.has(key)) {
      debouncedFetch(next);
    } else {
      runFetch(next);
    }
  }

  return { filters, setFilter, suggestions, total, isPending, error } as const;
}


