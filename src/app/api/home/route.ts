import { type NextRequest, NextResponse } from "next/server";

const UPSTREAM = process.env.API_URL as string;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const upstream = new URL(UPSTREAM);
  upstream.search = searchParams.toString();

  const res = await fetch(upstream.toString(), {
    headers: { "User-Agent": "Opdracht kandidaat front-end" },
    // No caching — client-side filter requests must return fresh results.
    // Contrast with get-initial-data.ts (revalidate: 60) which caches the SSR initial load.
    next: { revalidate: 0 },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
