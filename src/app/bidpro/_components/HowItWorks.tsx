"use client";

import { motion } from "motion/react";
import { SectionHeading } from "./ui";
import { Stagger, StaggerItem } from "../_lib/motion";

const STEPS = [
  {
    n: "01",
    title: "Ingest",
    body: "BidPro continuously scrapes 2,900+ agencies across 50 states, pulling every new and re-bidding disaster-recovery and FEMA-funded solicitation into one feed.",
  },
  {
    n: "02",
    title: "Diff",
    body: "We compare against all history, so reappearing standby MSAs and quietly re-opened re-bids surface instead of slipping past.",
  },
  {
    n: "03",
    title: "AI triage",
    body: "Every opportunity is scored 1–100 for fit and FEMA reimbursability, with Stafford Act and Public Assistance context applied automatically.",
  },
  {
    n: "04",
    title: "Bid-ready report",
    body: "You get a ranked shortlist, the documentation checklist FEMA will demand at closeout, and the reasonable-cost benchmarks, all in one report.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-b border-line py-24 sm:py-28"
    >
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="From scattered portals to a closeout-proof report."
          subtitle="Four steps, running every day, while you sleep."
        />

        <div className="relative mt-16">
          {/* connecting line (desktop) */}
          <svg
            className="absolute left-0 top-7 hidden h-2 w-full text-primary lg:block"
            viewBox="0 0 1000 8"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden
          >
            <line x1="0" y1="4" x2="1000" y2="4" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" />
            <motion.line
              x1="0"
              y1="4"
              x2="1000"
              y2="4"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="1 0"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
            <motion.circle
              cy="4"
              r="3.5"
              className="fill-primary"
              style={{ filter: "drop-shadow(0 0 4px rgba(245,158,11,0.9))" }}
              animate={{ cx: [0, 1000], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </svg>

          <Stagger className="grid gap-8 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((s) => (
              <StaggerItem key={s.n} className="relative flex flex-col gap-4">
                <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                  <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-bg font-mono text-base font-semibold text-primary shadow-[0_0_0_6px_rgba(10,12,16,1)]">
                    {s.n}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
