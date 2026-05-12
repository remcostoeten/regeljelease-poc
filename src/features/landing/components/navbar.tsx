"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Logo } from "@/shared/ui/brand/logo";
import {
  ChevronDownIcon,
  ClockIcon,
  MenuIcon,
  PhoneIcon,
  MailIcon,
} from "@/shared/ui/icons";
import { DesktopNav } from "./desktop-nav";
import { clsx } from "clsx";
import { contactConfig } from "@/config/contact";

const drawerEase = [0.32, 0.72, 0, 1] as const;
const drawerTransition = { duration: 0.28, ease: drawerEase };
const tapFeedback = { scale: 0.97 };

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <header className="relative z-50 h-16 text-brand-surface md:h-header">
      <div className="absolute inset-x-0 top-0 mx-auto flex w-full max-w-page justify-end px-5 sm:px-8">
        <div className="relative pointer-events-none">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={clsx(
              "group pointer-events-auto hidden h-menu-item w-contact-menu min-w-contact-menu max-w-contact-menu items-center justify-between rounded-b-contact-menu bg-brand-canvas px-6 py-4 text-sm font-medium text-brand-ink shadow-brand-small transition-all hover:bg-brand-field md:flex",
              isOpen && "bg-brand-field shadow-md"
            )}
          >
            <span className="flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4" />
              {contactConfig.openingLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
              </span>
              {contactConfig.openingTime}
            </span>
            <span className="flex items-center gap-1.5 font-bold">
              <PhoneIcon className="h-4 w-4" />
              {contactConfig.phoneNumber}
            </span>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-brand-primary"
            >
              <ChevronDownIcon className="h-3.5 w-3.5" />
            </motion.span>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="pointer-events-auto z-100 absolute right-0 top-[calc(100%+0.5rem)] w-72 overflow-hidden rounded-3xl bg-brand-canvas p-1 shadow-brand-float"
              >
                <div className="bg-white p-5 rounded-[1.25rem]">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-muted/60">
                    Openingstijden
                  </h3>
                  <div className="space-y-2.5">
                    {contactConfig.schedule.map((item) => (
                      <div
                        key={item.day}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-brand-muted">{item.day}</span>
                        <span className="font-semibold text-brand-ink">
                          {item.hours}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="my-5 h-px bg-brand-border" />

                  <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-muted/60">
                    Direct contact
                  </h3>
                  <div className="space-y-3">
                    <a
                      href={`tel:${contactConfig.phoneNumber.replace(/\s+/g, "")}`}
                      className="flex items-center gap-3 rounded-2xl bg-brand-field p-3 text-sm font-bold text-brand-ink transition hover:bg-brand-field-hover"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                        <PhoneIcon className="h-4 w-4 text-brand-primary" />
                      </div>
                      {contactConfig.phoneNumber}
                    </a>
                    <a
                      href={`mailto:${contactConfig.email}`}
                      className="flex items-center gap-3 rounded-2xl bg-brand-field p-3 text-sm font-bold text-brand-ink transition hover:bg-brand-field-hover"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                        <MailIcon className="h-4 w-4 text-brand-primary" />
                      </div>
                      {contactConfig.email}
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mx-auto flex h-16 w-full max-w-page items-center px-5 sm:px-8 md:h-header md:flex-col md:items-end md:justify-end md:pt-header-content-offset">
        <nav className="flex h-12 w-full items-center justify-between gap-4 md:h-menu-item">
          <Logo className="flex shrink-0 items-center" />
          <DesktopNav />
          <div className="flex items-center gap-3 md:hidden">
            <a
              href={`tel:${contactConfig.phoneNumber.replace(/\s+/g, "")}`}
              aria-label="Bel ons"
              className="flex h-10 w-10 items-center justify-center transition-all duration-200 hover:opacity-75 active:scale-90"
            >
              <PhoneIcon />
            </a>
            <motion.button
              aria-label="Open navigatiemenu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu-drawer"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              whileTap={shouldReduceMotion ? undefined : tapFeedback}
              className="flex h-10 w-10 items-center justify-center transition-all duration-200 hover:opacity-75 active:scale-90"
            >
              <MenuIcon />
            </motion.button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            className="fixed inset-0 z-[80] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: drawerEase }}
          >
            <button
              type="button"
              aria-label="Sluit navigatiemenu"
              className="absolute inset-0 bg-brand-ink/35 backdrop-blur-[2px]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              id="mobile-menu-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobiel navigatiemenu"
              initial={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
              animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
              transition={drawerTransition}
              className="absolute right-0 top-0 flex h-full w-[min(21rem,86vw)] flex-col bg-brand-surface p-5 text-brand-ink shadow-brand-float will-change-transform"
            >
              <div className="flex items-center justify-between">
                <Logo className="flex shrink-0 items-center text-brand-ink" />
                <motion.button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileTap={shouldReduceMotion ? undefined : tapFeedback}
                  className="flex h-10 min-w-10 items-center justify-center rounded-full bg-brand-field px-4 text-sm font-semibold transition-colors hover:bg-brand-field-hover focus:outline-none focus:ring-2 focus:ring-brand-ink/20"
                >
                  Sluit
                </motion.button>
              </div>

              <div className="mt-8 space-y-3">
                {["Lease aanbod", "Zo werkt het", "Zakelijk leasen"].map((item, index) => (
                  <motion.button
                    key={item}
                    type="button"
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...drawerTransition, delay: index * 0.035 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileTap={shouldReduceMotion ? undefined : tapFeedback}
                    className="flex h-14 w-full items-center justify-between rounded-2xl bg-brand-field px-4 text-left text-base font-semibold text-brand-ink transition-colors hover:bg-brand-field-hover focus:outline-none focus:ring-2 focus:ring-brand-ink/15"
                  >
                    {item}
                    <ChevronDownIcon className="h-5 w-5 rotate-90 text-brand-primary" />
                  </motion.button>
                ))}
              </div>

              <div className="mt-auto rounded-3xl bg-brand-field p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-muted/70">
                  Direct contact
                </p>
                <a
                  href={`tel:${contactConfig.phoneNumber.replace(/\s+/g, "")}`}
                  className="mt-3 flex h-12 items-center gap-3 rounded-2xl bg-white px-4 text-sm font-bold text-brand-ink shadow-sm"
                >
                  <PhoneIcon className="h-4 w-4 text-brand-primary" />
                  {contactConfig.phoneNumber}
                </a>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
