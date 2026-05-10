import { Logo } from "@/shared/ui/brand";
import {
  ChevronDownIcon,
  ClockIcon,
  MenuIcon,
  PhoneIcon,
} from "@/shared/ui/icons";
import { contactConfig } from "@/config/contact";
import { TOP_NAV_ITEMS } from "../navigation";

export function Navbar() {
  return (
    <header className="relative z-10 h-14 text-brand-surface md:h-header">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto flex w-full max-w-page justify-end px-5 sm:px-8">
        <button className="pointer-events-auto hidden h-menu-item w-contact-menu min-w-contact-menu max-w-contact-menu items-center justify-between rounded-b-contact-menu bg-brand-canvas px-6 py-4 text-sm font-medium text-brand-ink shadow-brand-small transition-colors hover:bg-brand-field md:flex">
          <span className="flex items-center gap-1.5">
            <ClockIcon />
            {contactConfig.openingLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full animate-pulse bg-brand-accent" />
            {contactConfig.openingTime}
          </span>
          <a
            href={`tel:${contactConfig.phoneNumber.replace(/\s+/g, "")}`}
            className="flex items-center gap-1.5 font-bold"
          >
            <PhoneIcon />
            {contactConfig.phoneNumber}
          </a>
          <span className="text-brand-primary">
            <ChevronDownIcon />
          </span>
        </button>
      </div>
      <div className="mx-auto flex h-14 w-full max-w-page items-center px-5 sm:px-8 md:h-header md:flex-col md:items-end md:justify-end md:pt-header-content-offset">
        <nav className="flex h-menu-item w-full items-center justify-between gap-4">
          <Logo className="flex shrink-0 items-center" />
          <ul className="hidden h-menu-item items-center gap-4 text-base font-medium leading-none md:flex">
            {TOP_NAV_ITEMS.map((item) => (
              <li key={item}>
                <a href="#" className="flex h-menu-item items-center justify-center gap-1 rounded-field px-1 py-4 transition-opacity hover:opacity-75">
                  {item}
                  <ChevronDownIcon />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 md:hidden">
            <a
              href={`tel:${contactConfig.phoneNumber.replace(/\s+/g, "")}`}
              aria-label="Bel ons"
              className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-75"
            >
              <PhoneIcon />
            </a>
            <button
              aria-label="Open navigatiemenu"
              className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-75"
            >
              <MenuIcon />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
