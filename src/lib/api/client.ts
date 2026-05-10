const BASE_URL = "/api";

// Simple helper to save us from having to manually check for errors and parse JSON on every API call.
export async function api<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${res.status}: ${url.pathname}`);

  return res.json() as Promise<T>;
}
