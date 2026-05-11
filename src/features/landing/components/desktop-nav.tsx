"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@/shared/ui/icons";
import { TOP_NAV_ITEMS } from "../constants/navigation";

export function DesktopNav() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [viewportStyle, setViewportStyle] = useState({ width: 0, height: 0, x: 0 });
  const [triggerRects, setTriggerRects] = useState<DOMRect[]>([]);

  const navRef = useRef<HTMLElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Calculate trigger positions on mount and resize
  useEffect(() => {
    const updateRects = () => {
      if (!navRef.current) return;
      const navRect = navRef.current.getBoundingClientRect();
      const rects = triggerRefs.current.map((el) => {
        if (!el) return new DOMRect();
        const rect = el.getBoundingClientRect();
        return new DOMRect(rect.left - navRect.left, rect.top - navRect.top, rect.width, rect.height);
      });
      setTriggerRects(rects);
    };
    
    updateRects();
    window.addEventListener("resize", updateRects);
    return () => window.removeEventListener("resize", updateRects);
  }, []);

  // Update viewport style when activeIndex changes
  useEffect(() => {
    if (activeIndex !== null && contentRefs.current[activeIndex] && triggerRects[activeIndex]) {
      const contentEl = contentRefs.current[activeIndex];
      const triggerRect = triggerRects[activeIndex];
      
      const width = contentEl!.offsetWidth;
      const height = contentEl!.offsetHeight;
      
      // Center the viewport relative to the trigger
      const x = triggerRect.left + triggerRect.width / 2 - width / 2;
      
      setViewportStyle({ width, height, x });
    }
  }, [activeIndex, triggerRects]);

  let timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (index: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveIndex(index);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveIndex(null);
      setIsHovering(false);
    }, 150); // slight delay to allow diagonal movement
  };

  return (
    <nav 
      ref={navRef} 
      className="relative hidden h-menu-item items-center md:flex"
      onMouseLeave={handleMouseLeave}
    >
      <ul className="flex items-center gap-4 text-base font-medium leading-none">
        {TOP_NAV_ITEMS.map((item, i) => (
          <li 
            key={item} 
            ref={(el) => { triggerRefs.current[i] = el; }}
            className="relative"
            onMouseEnter={() => handleMouseEnter(i)}
          >
            <a 
              href="#" 
              className={`group flex h-menu-item items-center justify-center gap-1 rounded-field px-1 py-4 transition-opacity ${activeIndex === i ? 'opacity-75' : 'hover:opacity-75'}`}
            >
              {item}
              <ChevronDownIcon 
                className={`h-3.5 w-3.5 transition-transform duration-300 ease-out ${activeIndex === i ? 'rotate-180' : ''}`} 
              />
            </a>
          </li>
        ))}
      </ul>

      {/* Viewport Background */}
      <div 
        className={`absolute top-full left-0 z-[60] overflow-hidden rounded-2xl border border-brand-border bg-white shadow-xl ring-1 ring-black/5 transition-all duration-300 ease-out origin-top-center ${
          isHovering ? "opacity-100 visible translate-y-2 scale-100" : "opacity-0 invisible translate-y-0 scale-95"
        }`}
        style={{
          width: viewportStyle.width || 250,
          height: viewportStyle.height || 100,
          transform: `translate(${viewportStyle.x}px, 8px) ${isHovering ? 'scale(1)' : 'scale(0.95)'}`,
        }}
      >
        {/* Absolute contents that fade in/out based on activeIndex */}
        <div className="relative w-full h-full">
          {TOP_NAV_ITEMS.map((item, i) => (
            <div
              key={item}
              ref={(el) => { contentRefs.current[i] = el; }}
              className={`absolute left-0 top-0 w-64 p-2 transition-opacity duration-300 ${activeIndex === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
            >
              <div className="flex flex-col">
                <a href="#" className="block rounded-lg px-4 py-3 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-field">
                  Bekijk alle {item.toLowerCase()}
                </a>
                <a href="#" className="block rounded-lg px-4 py-3 text-sm font-medium text-brand-muted transition-colors hover:bg-brand-field hover:text-brand-ink">
                  Populaire keuzes
                </a>
                <a href="#" className="block rounded-lg px-4 py-3 text-sm font-medium text-brand-muted transition-colors hover:bg-brand-field hover:text-brand-ink">
                  Meer informatie
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
