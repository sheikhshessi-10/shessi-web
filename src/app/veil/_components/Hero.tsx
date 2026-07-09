"use client";

import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
} from "motion/react";
import { ArrowRight, FileText, Lock, ShieldCheck } from "lucide-react";
import { Pill, PrimaryButton, GhostButton } from "./ui";
import { BRAND } from "../_lib/brand";

const CONJUNCTIONS = [
  { pair: "OAST-7 × KX-12", t: "T−6h", verdict: "COLLISION", pc: "Pc 1.2e−3" },
  { pair: "LN-3 × OAST-7", t: "T−2h", verdict: "SAFE", pc: "Pc 4.0e−7" },
  { pair: "KX-12 × VG-9", t: "T−9h", verdict: "SAFE", pc: "Pc 8.1e−8" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(440px circle at ${mx}px ${my}px, rgba(34,211,238,0.10), transparent 70%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  }

  return (
    <section
      id="top"
      onMouseMove={onMove}
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      {!reduce && (
        <motion.div style={{ background: spotlight }} className="pointer-events-none absolute inset-0" />
      )}

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* left */}
        <div className="flex flex-col items-start gap-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Pill>Privacy-preserving space traffic coordination</Pill>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.05 }}
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl text-balance"
          >
            Avoid every collision.{" "}
            <span className="relative whitespace-nowrap bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Reveal nothing.
              <svg
                className="absolute -bottom-1 left-0 w-full text-primary"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
              >
                <motion.path
                  d="M2 8 C 80 2, 220 2, 298 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, ease: "easeInOut", delay: 0.7 }}
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.15 }}
            className="max-w-xl text-lg leading-relaxed text-muted"
          >
            {BRAND} is the neutral coordination layer for space traffic. Operators
            compute collision risk together using cryptography, so only the warning
            is ever shared, never the orbit.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap items-center gap-3"
          >
            <PrimaryButton href="#access">
              Request access
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </PrimaryButton>
            <GhostButton href="#how-it-works">
              <FileText className="h-4 w-4" />
              Read the protocol
            </GhostButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-2 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-muted"
          >
            <span className="h-px w-8 bg-line-strong" />
            SMPC · zero-knowledge proofs · permissioned ledger
          </motion.div>
        </div>

        {/* right: conjunction console */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/15 blur-3xl" />
          <div className="relative rounded-2xl p-px">
            {!reduce && (
              <div
                aria-hidden
                className="absolute inset-0 rounded-2xl opacity-70 [background:conic-gradient(from_0deg,transparent_0deg,rgba(34,211,238,0.85)_40deg,transparent_130deg,transparent_210deg,rgba(139,92,246,0.6)_250deg,transparent_330deg)] animate-[spin-slow_7s_linear_infinite]"
              />
            )}
            <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-surface/95 shadow-2xl backdrop-blur">
              {/* header */}
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <div className="flex items-center gap-2 font-mono text-xs text-muted">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-3">{BRAND.toLowerCase()} · conjunction console</span>
                </div>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  live
                </span>
              </div>

              {/* encrypted inputs */}
              <div className="grid grid-cols-2 divide-x divide-line border-b border-line">
                {["Operator A", "Operator B"].map((op) => (
                  <div key={op} className="px-4 py-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      {op}
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 text-sm text-text/90">
                      <Lock className="h-3.5 w-3.5 text-accent" />
                      <span className="font-mono tracking-widest text-muted">orbit ●●●●●●</span>
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-accent">encrypted share</div>
                  </div>
                ))}
              </div>

              {/* compute bar */}
              <div className="flex items-center justify-center gap-2 border-b border-line bg-white/[0.015] px-4 py-2 font-mono text-[11px] text-muted">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                secure multi-party compute
                <span className="text-line-strong">▸</span>
                <span className="text-primary">ZK-verified</span>
              </div>

              {/* revealed results */}
              <div className="divide-y divide-line">
                {CONJUNCTIONS.map((c, i) => {
                  const danger = c.verdict === "COLLISION";
                  return (
                    <motion.div
                      key={c.pair}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.12 }}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <span className="min-w-0 flex-1 truncate font-mono text-xs text-text/90">
                        {c.pair}
                      </span>
                      <span className="font-mono text-[11px] text-muted">{c.t}</span>
                      <span className="hidden font-mono text-[10px] text-muted sm:inline">{c.pc}</span>
                      <span
                        className={`shrink-0 rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold ${
                          danger
                            ? "border-[#f43f5e]/40 bg-[#f43f5e]/10 text-[#fb7185]"
                            : "border-[#34d399]/30 bg-[#34d399]/10 text-[#34d399]"
                        }`}
                      >
                        {c.verdict}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="border-t border-line px-4 py-2.5 text-center font-mono text-[11px] text-muted">
                orbits never revealed · only risk shared
              </div>

              {!reduce && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_12px_rgba(34,211,238,0.7)] animate-[scan_4.5s_ease-in-out_infinite]"
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
