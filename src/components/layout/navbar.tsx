import { Logo } from "@/components/core/logo";
import { contactConfig } from "@/config/contact";

function ChevronDownIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg
            className="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
        >
            <circle
                cx="8"
                cy="8"
                r="5.5"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M8 4.8V8L10.1 9.2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg
            className="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M5.2 2.8L6.3 5.4L4.9 6.4C5.7 8.1 7.1 9.5 8.8 10.3L9.8 8.9L12.4 10C12.8 10.2 13 10.6 12.9 11L12.5 13C12.4 13.5 12 13.8 11.5 13.8C6.4 13.8 2.2 9.6 2.2 4.5C2.2 4 2.5 3.6 3 3.5L5 3.1C5.1 3.1 5.2 3.1 5.2 2.8Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

const navItems = ["Aanbod", "Keuzehulp", "Voor wie", "Zakelijk Leasen"];

export function Navbar() {
    return (
        <header className="relative z-10 h-header text-brand-surface">
            <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto flex w-full max-w-page justify-end px-5 sm:px-8">
        <button className="pointer-events-auto hidden h-menu-item w-contact-menu min-w-contact-menu max-w-contact-menu items-center justify-between rounded-b-contact-menu bg-brand-canvas px-6 py-4 text-sm font-medium text-brand-ink shadow-brand-small md:flex">
                    <span className="flex items-center gap-1.5">
            <ClockIcon />
            {contactConfig.openingLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand-accent" />
            {contactConfig.openingTime}
          </span>
          <span className="flex items-center gap-1.5 font-bold">
            <PhoneIcon />
            {contactConfig.phoneNumber}
          </span>
                    <span className="text-brand-primary">
                        <ChevronDownIcon />
                    </span>
                </button>
            </div>
            <div className="mx-auto flex h-header w-full max-w-page flex-col items-end px-5 pt-header-content-offset sm:px-8 justify-end">
                <nav className="flex h-menu-item w-full items-center justify-between gap-4">
                    <Logo className="flex shrink-0 items-center" />
                    <ul className="hidden h-menu-item items-center gap-4 text-base font-medium leading-none md:flex">
            {navItems.map((item) => (
              <li key={item}>
                <button className="flex h-menu-item items-center justify-center gap-1 rounded-field px-1 py-4">
                  {item}
                  <ChevronDownIcon />
                </button>
              </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
