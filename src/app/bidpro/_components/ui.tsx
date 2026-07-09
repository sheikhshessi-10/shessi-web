"use client";

import { type ReactNode } from "react";
import { Reveal } from "../_lib/motion";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
      <span className="h-px w-6 bg-primary/60" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div
      className={`flex flex-col gap-4 ${center ? "items-center text-center mx-auto max-w-3xl" : "max-w-3xl"} ${className}`}
    >
      {eyebrow && (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-text sm:text-4xl md:text-[2.75rem] text-balance">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p className="text-base text-muted sm:text-lg text-balance">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}

export function PrimaryButton({
  children,
  href = "#demo",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`group relative inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-primary to-[#e08905] px-5 py-3 text-sm font-semibold text-[#1a1205] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_24px_-8px_rgba(245,158,11,0.6)] transition-all duration-200 hover:from-primary-bright hover:to-primary hover:shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_10px_32px_-8px_rgba(251,146,60,0.7)] active:scale-[0.98] ${className}`}
    >
      {children}
    </a>
  );
}

export function GhostButton({
  children,
  href = "#demo",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong bg-white/[0.02] px-5 py-3 text-sm font-semibold text-text transition-all duration-200 hover:border-white/25 hover:bg-white/[0.05] active:scale-[0.98] ${className}`}
    >
      {children}
    </a>
  );
}

/** Faint topographic contour lines — flood-map reference, used behind hero + cta. */
export function ContourBg({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="1" fill="none">
        {Array.from({ length: 11 }).map((_, i) => {
          const o = i * 26;
          return (
            <path
              key={i}
              d={`M-50 ${120 + o} C 200 ${40 + o}, 420 ${260 + o}, 640 ${160 + o} S 1040 ${20 + o}, 1260 ${140 + o}`}
              opacity={0.9 - i * 0.05}
            />
          );
        })}
      </g>
    </svg>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted backdrop-blur">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
      {children}
    </div>
  );
}
