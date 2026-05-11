
/**
 * Pure SSR fnc that retrieves the inittial data for the filters
 * at build time 
 */
export async function getInitialData() {
  const url = process.env.API_URL;
  if (!url) {
    throw new Error("API_URL is not defined");
  }
  const res = await fetch(url, {
    headers: { "User-Agent": "Opdracht kandidaat front-end" },
    next: { revalidate: 60 },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch initial suggestions: ${res.status}`);
  return res.json();
}
