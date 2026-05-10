import { HeroSection } from "@/features/landing/components/hero-section";
import { Navbar } from "@/features/landing/components/navbar";
import type { HomeApiResponse } from "@/features/filters/lib/types";
import { FilterBar } from "@/features/filters";
import { HeroBackdropShape } from "@/shared/ui/brand/hero-backdrop-shape";
import { ErrorBoundary } from "@/shared/ui/error-boundary";

type Props = { initialData: HomeApiResponse };

export function LandingView({ initialData }: Props) {
  return (
    <main className="min-h-screen bg-brand-canvas">
      <div className="hero-background pb-14">
        <HeroBackdropShape />
        <Navbar />
        <HeroSection />
      </div>
      <div className="relative z-10 -mt-8 pb-8 lg:mt-0 lg:pt-0">
        <ErrorBoundary>
          <FilterBar initialData={initialData} />
        </ErrorBoundary>
      </div>
    </main>
  );
}
