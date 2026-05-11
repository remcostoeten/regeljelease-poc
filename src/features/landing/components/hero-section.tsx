import { TrustpilotLogo } from "@/shared/ui/brand/trustpilot-logo";
import { TRUSTPILOT_RATING } from "../constants/trustpilot";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="mx-auto mt-4 flex w-full max-w-page flex-col gap-5 px-5 pt-4 pb-0 text-brand-surface sm:px-8 lg:mt-header-hero-gap lg:h-hero-frame lg:flex-row lg:items-start lg:justify-between lg:gap-hero-gap lg:px-hero-frame-padding-x lg:py-0">
      <div className="flex max-w-hero-copy-column grow flex-col items-center gap-hero-copy-gap justify-center lg:h-hero-copy-stack lg:items-start">
        <h1 className="w-full font-heading text-[1.75rem] leading-[1.15] font-medium text-center lg:max-w-hero-copy lg:text-left lg:text-heading-h1 lg:leading-heading-h1--line-height">
          <span className="block">De lease van je</span>
          <span className="block">
            voertuig <span className="text-brand-ink">binnen 15</span>
          </span>
          <span className="block text-brand-ink">minuten geregeld</span>
        </h1>
        <Link href="#" className="flex flex-col items-center text-brand-ink transition-opacity lg:items-start">
          <TrustpilotLogo />
          <p className="mt-1 text-review-copy font-medium">
            {TRUSTPILOT_RATING.label}{" "}
            <strong>{TRUSTPILOT_RATING.rating}</strong> op basis van{" "}
            {TRUSTPILOT_RATING.reviewCount} reviews
          </p>
        </Link>
      </div>

      <div className="relative w-full lg:min-h-hero-photo-height lg:w-hero-media lg:shrink-0">
        <div
          className="relative ml-auto h-[300px] w-[85%] overflow-hidden rounded-photo bg-brand-field shadow-brand-photo lg:absolute lg:right-0 lg:top-0 lg:ml-0 lg:h-hero-photo-height lg:w-hero-photo-width"
        >
          <div
            className="h-full w-full bg-cover lg:[background-position:54%_center]"
            style={{ backgroundImage: "url('/hero-worker.webp')" }}
            role="img"
            aria-label="Bouwvakker bij zijn bedrijfswagen"
          />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 left-0 flex w-[220px] items-center rounded-testimonial bg-white/92 px-4 py-4 text-brand-ink shadow-brand-float lg:translate-y-0 lg:left-hero-testimonial-left lg:top-hero-testimonial-top lg:h-hero-testimonial-height lg:w-hero-testimonial lg:px-9 lg:py-0">
          <p className="text-sm leading-snug lg:text-testimonial">
            <span className="font-hand text-[1.5rem] text-brand-accent lg:text-testimonial-name">
              Martijn:
            </span>{" "}
            Ongelooflijk hoe snel en makkelijk dit is verlopen.{" "}
            <strong>Mika</strong> hield de vaart er goed in en heeft in 1 dag
            alles geregeld. Geweldig!
          </p>
        </div>
      </div>
    </section>
  );
}
