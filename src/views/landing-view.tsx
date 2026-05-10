import { FilterBar } from "@/features/filters";
import { HeroSection } from "@/features/landing/components/hero-section";
import { Navbar } from "@/features/landing/components/navbar";
import { HeroBackdropShape } from "@/shared/ui/brand";

export function LandingView() {
  return (
    <main className="min-h-screen bg-brand-canvas">
      <div className="hero-background pb-14">
        <HeroBackdropShape />
        <Navbar />
        <HeroSection />
      </div>
      <div className="relative z-10 -mt-8 pb-8 lg:mt-0 lg:pt-0">
        <FilterBar />
      </div>
    </main>
  );
}
