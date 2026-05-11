"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative z-50 h-14 text-brand-surface md:h-header">
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

      <div className="mx-auto flex h-14 w-full max-w-page items-center px-5 sm:px-8 md:h-header md:flex-col md:items-end md:justify-end md:pt-header-content-offset">
        <nav className="flex h-menu-item w-full items-center justify-between gap-4">
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
            <button
              aria-label="Open navigatiemenu"
              className="flex h-10 w-10 items-center justify-center transition-all duration-200 hover:opacity-75 active:scale-90"
            >
              <MenuIcon />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
