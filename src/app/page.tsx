import type { Metadata } from "next";
import { getInitialData } from "@/lib/api/get-initial-data";
import { LandingView } from "@/views/landing-view";

export const metadata: Metadata = {
  title: "Lease je voertuig binnen 15 minuten | Regeljelease.nl",
  description:
    "Vergelijk en regel de lease van je voertuig snel online. Binnen 15 minuten een helder voorstel en direct verder met aanvragen.",
};

export default async function Home() {
  const initialData = await getInitialData();
  return <LandingView initialData={initialData} />;
}
