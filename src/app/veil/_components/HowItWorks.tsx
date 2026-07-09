"use client";

import { motion } from "motion/react";
import { SectionHeading } from "./ui";
import { Stagger, StaggerItem } from "../_lib/motion";

const STEPS = [
  {
    n: "01",
    title: "Commit",
    body: "Each operator publishes a cryptographic commitment to its orbit. Everyone can verify the orbit was fixed, without seeing it.",
  },
  {
    n: "02",
    title: "Secret-share",
    body: "Orbits are split into encrypted shares across compute nodes. No single node ever holds a full trajectory.",
  },
  {
    n: "03",
    title: "Compute",
    body: "Nodes jointly run the conjunction analysis under secure multi-party computation, deriving collision probability from data they cannot read.",
  },
  {
    n: "04",
    title: "Prove",
    body: "Zero-knowledge proofs attest every step ran correctly and each orbit obeyed physics, leaking no extra information.",
  },
  {
    n: "05",
    title: "Settle",
    body: "Only the verdict, SAFE or a collision alert, is written to a permissioned ledger. Every operator gets the warning; no one gets the orbit.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-24 sm:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The protocol"
          title="Coordinate without trusting anyone."
          subtitle="Orbits in, warnings out, secrets stay home."
        />

        <div className="relative mt-16">
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
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
            <motion.circle
              cy="4"
              r="3.5"
              className="fill-primary"
              style={{ filter: "drop-shadow(0 0 4px rgba(34,211,238,0.9))" }}
              animate={{ cx: [0, 1000], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </svg>

          <Stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {STEPS.map((s) => (
              <StaggerItem key={s.n} className="relative flex flex-col gap-4">
                <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-bg font-mono text-base font-semibold text-primary shadow-[0_0_0_6px_var(--color-bg)]">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">
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
