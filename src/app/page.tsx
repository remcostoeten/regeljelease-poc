import type { Metadata } from "next";
import { LandingView } from "@/views/landing-view";

export const metadata: Metadata = {
  title: "Lease je voertuig binnen 15 minuten | Regeljelease.nl",
  description:
    "Vergelijk en regel de lease van je voertuig snel online. Binnen 15 minuten een helder voorstel en direct verder met aanvragen.",
};

export default function Home() {
  return <LandingView />;
}
