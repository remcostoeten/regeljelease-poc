import { api } from "@/shared/api/client";
import type { FilterParams, HomeApiResponse } from "../../types";

/**
 * Fetch filter suggestions. Only non-empty params are forwarded.
 * @example
 * fetchSuggestions({})
 * fetchSuggestions({ brand: "Audi" })
 */
export function fetchSuggestions(
  params: FilterParams,
): Promise<HomeApiResponse> {
  return api<HomeApiResponse>("/home", params as Record<string, string>);
}
