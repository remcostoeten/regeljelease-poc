"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

type Bp = {
    key: string;
    label: string;
    width: number | null;
    shortcut: string;
    device: "free" | "phone" | "phablet" | "tablet" | "laptop" | "desktop" | "wide";
};

const BREAKPOINTS: Bp[] = [
    { key: "free", label: "Free", width: null, shortcut: "1", device: "free" },
    { key: "xs", label: "XS", width: 375, shortcut: "2", device: "phone" },
    { key: "sm", label: "SM", width: 640, shortcut: "3", device: "phablet" },
    { key: "md", label: "MD", width: 768, shortcut: "4", device: "tablet" },
    { key: "lg", label: "LG", width: 1024, shortcut: "5", device: "laptop" },
    { key: "xl", label: "XL", width: 1280, shortcut: "6", device: "desktop" },
    { key: "2xl", label: "2XL", width: 1536, shortcut: "7", device: "wide" },
];

const SPRING = { type: "spring", stiffness: 320, damping: 28, mass: 0.75 } as const;
const PILL_SPRING = { type: "spring", stiffness: 420, damping: 32 } as const;

const RULER_SIZE = 20; // px — thickness of both ruler bars

function IconFree({ lit }: { lit: boolean }) {
    const c = lit ? "#e5e5e5" : "#404040";
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M1.5 6V2h4M10 2h4v4M14.5 10v4h-4M6 14H2v-4"
                stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function IconPhone({ lit }: { lit: boolean }) {
    const c = lit ? "#e5e5e5" : "#404040";
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <rect x="4" y="1.5" width="8" height="13" rx="1.5" stroke={c} strokeWidth="1.5" />
            <circle cx="8" cy="12.5" r="0.75" fill={c} />
            <path d="M6.5 3.5h3" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}
function IconPhablet({ lit }: { lit: boolean }) {
    const c = lit ? "#e5e5e5" : "#404040";
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <rect x="3" y="1" width="10" height="14" rx="1.5" stroke={c} strokeWidth="1.5" />
            <circle cx="8" cy="12.5" r="0.85" fill={c} />
        </svg>
    );
}
function IconTablet({ lit }: { lit: boolean }) {
    const c = lit ? "#e5e5e5" : "#404040";
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <rect x="1.5" y="2" width="13" height="12" rx="1.5" stroke={c} strokeWidth="1.5" />
            <circle cx="13" cy="8" r="0.75" fill={c} />
        </svg>
    );
}
function IconLaptop({ lit }: { lit: boolean }) {
    const c = lit ? "#e5e5e5" : "#404040";
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <rect x="2" y="2.5" width="12" height="8.5" rx="1" stroke={c} strokeWidth="1.5" />
            <path d="M0.5 11h15" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5.5 13h5" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}
function IconDesktop({ lit }: { lit: boolean }) {
    const c = lit ? "#e5e5e5" : "#404040";
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <rect x="1" y="2" width="14" height="9" rx="1" stroke={c} strokeWidth="1.5" />
            <path d="M6 15h4M8 11v4" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}
function IconWide({ lit }: { lit: boolean }) {
    const c = lit ? "#e5e5e5" : "#404040";
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <rect x="0.5" y="3" width="15" height="8" rx="1" stroke={c} strokeWidth="1.5" />
            <path d="M5.5 15h5M8 11v4" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}
function deviceIcon(device: Bp["device"], lit: boolean): React.ReactNode {
    if (device === "free") return <IconFree lit={lit} />;
    if (device === "phone") return <IconPhone lit={lit} />;
    if (device === "phablet") return <IconPhablet lit={lit} />;
    if (device === "tablet") return <IconTablet lit={lit} />;
    if (device === "laptop") return <IconLaptop lit={lit} />;
    if (device === "desktop") return <IconDesktop lit={lit} />;
    return <IconWide lit={lit} />;
}

// ─── Ruler ───────────────────────────────────────────────────────────────────

type RulerProps = {
    orientation: "horizontal" | "vertical";
    length: number;       // canvas dimension in px
    offset: number;       // scroll offset (scrollX or scrollY) of the content
    contentStart: number; // left/top edge of the content area in viewport coords
};

function Ruler({ orientation, length, offset, contentStart }: RulerProps) {
    const isH = orientation === "horizontal";
    const step = 50;
    const ticks: { pos: number; label: string; major: boolean }[] = [];

    // We draw ticks that cover the visible ruler length
    const first = Math.floor(offset / step) * step;
    for (let v = first; v < offset + length; v += step) {
        const pos = v - offset + (isH ? contentStart : 0);
        ticks.push({ pos, label: String(v), major: v % 100 === 0 });
    }

    const style: React.CSSProperties = isH
        ? { position: "fixed", top: 0, left: 0, width: "100%", height: RULER_SIZE, zIndex: 9998 }
        : { position: "fixed", top: RULER_SIZE, left: 0, width: RULER_SIZE, bottom: 0, zIndex: 9998 };

    return (
        <div
            style={{
                ...style,
                background: "#0d0d0d",
                borderBottom: isH ? "1px solid #222" : undefined,
                borderRight: !isH ? "1px solid #222" : undefined,
                overflow: "hidden",
                userSelect: "none",
                pointerEvents: "none",
            }}
        >
            {/* corner square fill for vertical ruler's top area */}
            {!isH && (
                <div style={{ position: "absolute", top: 0, left: 0, width: RULER_SIZE, height: RULER_SIZE, background: "#0d0d0d" }} />
            )}
            {ticks.map(({ pos, label, major }) => (
                <div
                    key={label + pos}
                    style={{
                        position: "absolute",
                        ...(isH
                            ? { left: pos, top: 0, width: 1, height: major ? 10 : 5 }
                            : { top: pos, left: 0, width: major ? 10 : 5, height: 1 }),
                        background: major ? "#444" : "#2a2a2a",
                    }}
                >
                    {major && (
                        <span
                            style={{
                                position: "absolute",
                                fontFamily: "ui-monospace, monospace",
                                fontSize: 8,
                                color: "#3a3a3a",
                                lineHeight: 1,
                                whiteSpace: "nowrap",
                                ...(isH
                                    ? { top: 11, left: 2 }
                                    : { left: 11, top: 1, writingMode: "vertical-lr" }),
                            }}
                        >
                            {label}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}

// ─── Crosshair cursor indicator ───────────────────────────────────────────────

function RulerCrosshair({ contentStart, contentWidth }: { contentStart: number; contentWidth: number }) {
    const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
        const onLeave = () => setPos(null);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseleave", onLeave);
        return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseleave", onLeave); };
    }, []);

    if (!pos) return null;

    const xInContent = pos.x - contentStart;
    const xLabel = xInContent >= 0 && xInContent <= contentWidth ? String(Math.round(xInContent)) : null;
    const yLabel = String(Math.round(pos.y - RULER_SIZE));

    return (
        <>
            {/* H line on vertical ruler */}
            <div style={{ position: "fixed", top: pos.y, left: 0, width: RULER_SIZE, height: 1, background: "#4a9eff55", zIndex: 9999, pointerEvents: "none" }} />
            {/* V line on horizontal ruler */}
            <div style={{ position: "fixed", left: pos.x, top: 0, width: 1, height: RULER_SIZE, background: "#4a9eff55", zIndex: 9999, pointerEvents: "none" }} />
            {/* X coord badge */}
            {xLabel && (
                <div style={{
                    position: "fixed", left: pos.x + 4, top: 2, zIndex: 10000, pointerEvents: "none",
                    fontFamily: "ui-monospace, monospace", fontSize: 8, color: "#4a9eff",
                    background: "#0d0d0d", padding: "1px 3px", borderRadius: 2,
                }}>
                    {xLabel}
                </div>
            )}
            {/* Y coord badge */}
            <div style={{
                position: "fixed", left: 2, top: pos.y + 2, zIndex: 10000, pointerEvents: "none",
                fontFamily: "ui-monospace, monospace", fontSize: 8, color: "#4a9eff",
                background: "#0d0d0d", padding: "1px 3px", borderRadius: 2,
            }}>
                {yLabel}
            </div>
        </>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Props = { children: React.ReactNode };

export function BreakpointMenu({ children }: Props) {
    const [active, setActive] = useState<string>("free");
    const [scroll, setScroll] = useState({ x: 0, y: 0 });

    const current = BREAKPOINTS.find((b) => b.key === active) ?? BREAKPOINTS[0];

    useEffect(function bindKeys() {
        function onKey(e: KeyboardEvent): void {
            if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
            const bp = BREAKPOINTS.find((b) => b.shortcut === e.key);
            if (bp) setActive(bp.key);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(function trackScroll() {
        function onScroll() { setScroll({ x: window.scrollX, y: window.scrollY }); }
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const [viewportWidth, setViewportWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1920
    );
    const [viewportHeight, setViewportHeight] = useState(
        typeof window !== "undefined" ? window.innerHeight : 1080
    );

    useEffect(function trackViewport() {
        function onResize() {
            setViewportWidth(window.innerWidth);
            setViewportHeight(window.innerHeight);
        }
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const contentWidth = current.width ?? viewportWidth;
    const gutterWidth = current.width
        ? Math.max(0, (viewportWidth - current.width) / 2)
        : 0;
    const contentStart = gutterWidth; // left edge of content in viewport

    // device-specific chrome colors
    const isConstrained = !!current.width;

    return (
        <>
            {/* ── Ruler bars ── */}
            <Ruler
                orientation="horizontal"
                length={viewportWidth}
                offset={scroll.x}
                contentStart={contentStart}
            />
            <Ruler
                orientation="vertical"
                length={viewportHeight}
                offset={scroll.y}
                contentStart={0}
            />
            <RulerCrosshair contentStart={contentStart} contentWidth={contentWidth} />

            {/* Corner square that covers intersection */}
            <div style={{
                position: "fixed", top: 0, left: 0,
                width: RULER_SIZE, height: RULER_SIZE,
                background: "#0d0d0d",
                borderRight: "1px solid #222",
                borderBottom: "1px solid #222",
                zIndex: 9999,
            }} />

            {/* ── Content shifted right+down to clear rulers ── */}
            <div style={{ paddingTop: RULER_SIZE + 12, paddingLeft: RULER_SIZE + 12, paddingRight: 12, paddingBottom: 12 }}>
                <motion.div
                    animate={{ maxWidth: current.width ?? 99999 }}
                    transition={SPRING}
                    style={{ margin: "0 auto", position: "relative" }}
                >
                    {/* Device edge lines */}
                    {isConstrained && (
                        <>
                            <motion.div
                                key="edge-left"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: "absolute",
                                    top: 0, left: 0, bottom: 0,
                                    width: 1,
                                    background: "linear-gradient(to bottom, transparent, #333 8%, #333 92%, transparent)",
                                    pointerEvents: "none",
                                    zIndex: 50,
                                }}
                            />
                            <motion.div
                                key="edge-right"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: "absolute",
                                    top: 0, right: 0, bottom: 0,
                                    width: 1,
                                    background: "linear-gradient(to bottom, transparent, #333 8%, #333 92%, transparent)",
                                    pointerEvents: "none",
                                    zIndex: 50,
                                }}
                            />

                            {/* Shadow that bleeds outward from the content frame */}
                            <div style={{
                                position: "absolute",
                                inset: 0,
                                pointerEvents: "none",
                                zIndex: 45,
                                boxShadow: "0 0 60px 0 rgba(0,0,0,0.7)",
                            }} />
                        </>
                    )}

                    {children}
                </motion.div>
            </div>

            {/* ── Gutter overlays ── */}
            <AnimatePresence>
                {isConstrained && gutterWidth > 0 && (
                    <>
                        {/* Left gutter */}
                        <motion.div
                            key="gutter-left"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, width: gutterWidth }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={SPRING}
                            style={{
                                position: "fixed",
                                top: RULER_SIZE, bottom: 0,
                                left: RULER_SIZE + 12,
                                width: gutterWidth,
                                background: "#060606",
                                pointerEvents: "none",
                                zIndex: 40,
                                borderRight: "1px solid #1a1a1a",
                                // subtle dot grid
                                backgroundImage: "radial-gradient(circle, #1c1c1c 1px, transparent 1px)",
                                backgroundSize: "20px 20px",
                            }}
                        />
                        {/* Right gutter */}
                        <motion.div
                            key="gutter-right"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, width: gutterWidth }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={SPRING}
                            style={{
                                position: "fixed",
                                top: RULER_SIZE, bottom: 0,
                                right: 0,
                                width: gutterWidth,
                                background: "#060606",
                                pointerEvents: "none",
                                zIndex: 40,
                                borderLeft: "1px solid #1a1a1a",
                                backgroundImage: "radial-gradient(circle, #1c1c1c 1px, transparent 1px)",
                                backgroundSize: "20px 20px",
                            }}
                        />

                        {/* Width label floating in the left gutter */}
                        <AnimatePresence>
                            {gutterWidth > 48 && (
                                <motion.div
                                    key="width-label"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        position: "fixed",
                                        top: RULER_SIZE + 16,
                                        left: RULER_SIZE + gutterWidth / 2,
                                        transform: "translateX(-50%)",
                                        zIndex: 41,
                                        pointerEvents: "none",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <span style={{
                                        fontFamily: "ui-monospace, monospace",
                                        fontSize: 9,
                                        color: "#2a2a2a",
                                        letterSpacing: "0.08em",
                                    }}>
                                        {Math.round(gutterWidth)}px
                                    </span>
                                    {/* Arrow line */}
                                    <div style={{ width: 1, height: 20, background: "#1e1e1e" }} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </AnimatePresence>

            {/* ── Toolbar ── */}
            <div
                role="toolbar"
                aria-label="Responsive breakpoint switcher"
                style={{
                    position: "fixed",
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    gap: 0,
                    background: "#0a0a0a",
                    border: "1px solid #1c1c1c",
                    borderRadius: 12,
                    padding: "5px 5px",
                    boxShadow:
                        "0 0 0 1px rgba(255,255,255,0.03) inset, 0 12px 40px rgba(0,0,0,0.85), 0 4px 12px rgba(0,0,0,0.5)",
                }}
            >
                {BREAKPOINTS.map((bp) => {
                    const isActive = bp.key === active;
                    return (
                        <button
                            key={bp.key}
                            onClick={() => setActive(bp.key)}
                            aria-pressed={isActive}
                            aria-label={`${bp.label}${bp.width ? ` — ${bp.width}px` : " — free"} (shortcut: ${bp.shortcut})`}
                            style={{
                                position: "relative",
                                padding: "6px 10px 5px",
                                borderRadius: 8,
                                border: "none",
                                cursor: "pointer",
                                background: "transparent",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 4,
                                minWidth: 46,
                                outline: "none",
                            }}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="pill"
                                    transition={PILL_SPRING}
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        borderRadius: 8,
                                        background: "#161616",
                                        border: "1px solid #2a2a2a",
                                        boxShadow: "0 1px 6px rgba(0,0,0,0.6)",
                                    }}
                                />
                            )}
                            <span style={{ position: "relative", zIndex: 1, display: "flex", transition: "opacity 0.15s", opacity: isActive ? 1 : 0.45 }}>
                                {deviceIcon(bp.device, isActive)}
                            </span>
                            <span style={{
                                position: "relative",
                                zIndex: 1,
                                fontFamily: "ui-monospace, 'Cascadia Code', monospace",
                                fontSize: 9.5,
                                fontWeight: isActive ? 600 : 400,
                                letterSpacing: "0.06em",
                                color: isActive ? "#c8c8c8" : "#333",
                                transition: "color 0.15s",
                            }}>
                                {bp.label}
                            </span>
                        </button>
                    );
                })}

                <div aria-hidden style={{ width: 1, height: 28, background: "#1c1c1c", marginLeft: 4, marginRight: 2, flexShrink: 0 }} />

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", paddingLeft: 10, paddingRight: 8, gap: 1, minWidth: 54 }}>
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={current.key}
                            initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -5, filter: "blur(4px)" }}
                            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{
                                fontFamily: "ui-monospace, 'Cascadia Code', monospace",
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#d0d0d0",
                                lineHeight: 1,
                            }}
                        >
                            {current.width ?? "∞"}
                        </motion.span>
                    </AnimatePresence>
                    <span style={{
                        fontFamily: "ui-monospace, 'Cascadia Code', monospace",
                        fontSize: 9,
                        letterSpacing: "0.1em",
                        color: "#2e2e2e",
                    }}>
                        {current.width ? "px" : "FREE"}
                    </span>
                </div>
            </div>
        </>
    );
}
