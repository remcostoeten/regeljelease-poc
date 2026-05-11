import type { FilterRes } from "../../types";

/**
 * Pure SSR function that retrieves the initial data for the filters
 * at build or request time.
 */
export async function getInitialData(): Promise<FilterRes> {
  const url = process.env.API_URL;
  const userAgent = process.env.API_USER_AGENT;

  if (!url) {
    console.error("[getInitialData] API_URL is not defined in environment variables");
    throw new Error("Configuration error: API_URL is missing");
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": userAgent || "Opdracht kandidaat front-end" },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const errorMsg = `Failed to fetch initial suggestions (Status: ${res.status})`;
      console.error(`[getInitialData] ${errorMsg}`);
      throw new Error(errorMsg);
    }

    return await res.json() as FilterRes;
  } catch (error) {
    console.error("[getInitialData] Unexpected error:", error);
    throw error instanceof Error ? error : new Error("An unexpected error occurred while fetching initial data");
  }
}
