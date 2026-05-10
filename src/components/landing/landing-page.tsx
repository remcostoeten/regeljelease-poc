import { FilterWrapper } from "@/components/landing/filter-wrapper";
import { HeroSection } from "@/components/landing/hero-section";
import { Navbar } from "@/components/layout/navbar";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-brand-canvas">
      <div className="hero-background pb-6 md:pb-14">
        <svg
          className="hero-background-shape"
          viewBox="0 0 1281 600"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 0V399.177C0 545.248 151.096 642.343 283.812 581.605L1281 125V0H1004H0Z"
            fill="url(#hero-gradient)"
          />
          <defs>
            <linearGradient
              id="hero-gradient"
              x1="-298.233"
              y1="975.319"
              x2="1096.75"
              y2="340.541"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.42" stopColor="#EA7520" />
              <stop offset="1" stopColor="#E7371C" />
            </linearGradient>
          </defs>
        </svg>
        <Navbar />
        <HeroSection />
      </div>
      <div className="relative z-10 pt-4 pb-20 md:pt-0">
        <FilterWrapper />
      </div>
    </main>
  );
}
