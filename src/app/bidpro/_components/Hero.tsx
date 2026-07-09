"use client";

import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { useRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import { ContourBg, Pill, PrimaryButton, GhostButton } from "./ui";
import { CountUp } from "../_lib/motion";

const FEED = [
  { id: "FL-2291", title: "Pre-event debris removal, standby MSA", state: "FL", score: 96, status: "FEMA-PA" },
  { id: "TX-0148", title: "Disaster debris monitoring services", state: "TX", score: 91, status: "Cat A" },
  { id: "LA-7733", title: "Emergency ROW clearing, re-bid", state: "LA", score: 88, status: "Re-bid" },
  { id: "NC-0925", title: "Hurricane recovery & restoration", state: "NC", score: 84, status: "FEMA-PA" },
  { id: "MS-3310", title: "Vegetative debris hauling MSA", state: "MS", score: 79, status: "Standby" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contourY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  const spotlight = useMotionTemplate`radial-gradient(480px circle at ${mx}px ${my}px, rgba(245,158,11,0.10), transparent 70%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  }

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      className="relative overflow-hidden border-b border-line pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      {/* aurora field */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-44 h-[38rem] w-[38rem] rounded-full bg-primary/20 blur-[120px] animate-[aurora-a_16s_ease-in-out_infinite]" />
        <div className="absolute -right-44 top-8 h-[34rem] w-[34rem] rounded-full bg-[#3b82f6]/12 blur-[130px] animate-[aurora-b_21s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-12rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-[140px] animate-[aurora-a_24s_ease-in-out_infinite]" />
      </div>

      {/* textures */}
      <motion.div
        style={{ y: gridY }}
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_30%,black,transparent)]"
      />
      <motion.div
        style={{ y: contourY }}
        className="pointer-events-none absolute inset-x-0 top-0 h-[120%] text-primary/[0.07]"
      >
        <ContourBg className="h-full w-full" />
      </motion.div>
      {!reduce && (
        <motion.div style={{ background: spotlight }} className="pointer-events-none absolute inset-0" />
      )}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* left: copy */}
        <div className="flex flex-col items-start gap-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Pill>Coverage · 2,900+ agencies · 50 states</Pill>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.05 }}
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl text-balance"
          >
            Where{" "}
            <span className="relative whitespace-nowrap">
              disaster-recovery
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
            </span>{" "}
            contracts are won.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.15 }}
            className="max-w-xl text-lg leading-relaxed text-muted"
          >
            BidPro&rsquo;s AI finds, scores, and wins FEMA-funded and
            disaster-recovery contracts across thousands of fragmented state and
            local portals, then defends every dollar through closeout.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap items-center gap-3"
          >
            <PrimaryButton>
              Book a demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </PrimaryButton>
            <GhostButton href="#how-it-works">
              <Play className="h-4 w-4" />
              See BidPro in action
            </GhostButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-2 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.16em] text-muted"
          >
            <span className="h-px w-8 bg-line-strong" />
            Purpose-built for disaster recovery &amp; FEMA work
          </motion.div>
        </div>

        {/* right: mission console */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/15 blur-3xl" />
          {/* animated gradient border */}
          <div className="relative rounded-2xl p-px">
            {!reduce && (
              <div
                aria-hidden
                className="absolute inset-0 rounded-2xl opacity-70 [background:conic-gradient(from_0deg,transparent_0deg,rgba(245,158,11,0.85)_40deg,transparent_130deg,transparent_210deg,rgba(94,234,212,0.6)_250deg,transparent_330deg)] animate-[spin-slow_7s_linear_infinite]"
              />
            )}
            <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl">
            {/* console header */}
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div className="flex items-center gap-2 font-mono text-xs text-muted">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3">bidpro · contract inbox</span>
              </div>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                live
              </span>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-3 divide-x divide-line border-b border-line">
              <KPI label="New today" value={<CountUp value={47} />} />
              <KPI
                label="FEMA-eligible"
                value={<CountUp value={31} />}
                accent
              />
              <KPI label="Re-bids ≤30d" value={<CountUp value={12} />} />
            </div>

            {/* feed */}
            <div className="divide-y divide-line">
              {FEED.map((row, i) => (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.12 }}
                  className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]"
                >
                  <span className="font-mono text-[11px] text-muted">{row.id}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-text/90">
                    {row.title}
                  </span>
                  <span className="hidden rounded border border-line bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted sm:inline">
                    {row.status}
                  </span>
                  <ScoreChip score={row.score} />
                </motion.div>
              ))}
            </div>
            <div className="border-t border-line px-4 py-2.5 text-center font-mono text-[11px] text-muted">
              + 42 more scored opportunities
            </div>
              {!reduce && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_12px_rgba(245,158,11,0.7)] animate-[scan_4.5s_ease-in-out_infinite]"
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function KPI({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="px-4 py-3">
      <div
        className={`font-mono text-2xl font-semibold ${accent ? "text-primary" : "text-text"}`}
      >
        {value}
      </div>
      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        {label}
      </div>
    </div>
  );
}

function ScoreChip({ score }: { score: number }) {
  const tone =
    score >= 90
      ? "text-primary border-primary/40 bg-primary/10"
      : score >= 80
        ? "text-accent border-accent/30 bg-accent/10"
        : "text-muted border-line-strong bg-white/[0.03]";
  return (
    <span
      className={`shrink-0 rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${tone}`}
    >
      {score}
    </span>
  );
}
