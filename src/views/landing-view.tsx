import { HeroSection } from "@/features/landing/components/hero-section";
import { Navbar } from "@/features/landing/components/navbar";
import type { FilterRes } from "@/features/filters/types";
import { FilterBar } from "@/features/filters/components/filter-bar";
import { HeroBackdropShape } from "@/shared/ui/brand/hero-backdrop-shape";
import { ErrorBoundary } from "@/shared/ui/error-boundary";

type Props = { initialData: FilterRes };

export function LandingView({ initialData }: Props) {
  return (
    <main className="min-h-screen bg-brand-canvas">
      <div className="hero-background pb-16 md:pb-14">
        <HeroBackdropShape />
        <Navbar />
        <HeroSection />
      </div>
      <div className="relative z-10 -mt-5 pb-8 sm:-mt-6 md:-mt-8 lg:mt-0 lg:pt-0">
        <ErrorBoundary>
          <FilterBar initialData={initialData} />
        </ErrorBoundary>
      </div>
    </main>
  );
}
