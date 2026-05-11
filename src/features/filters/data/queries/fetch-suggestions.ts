import { api } from "@/shared/api/client";
import type { FilterParams, FilterRes } from "../../types";

/**
 * Fetch filter suggestions. Only non-empty params are forwarded.
 * @example
 * fetchSuggestions({})
 * fetchSuggestions({ brand: "Audi" })
 */
export function fetchSuggestions(
  params: FilterParams,
): Promise<FilterRes> {
  return api<FilterRes>("/home", params as Record<string, string>);
}
