"use client";

import { Reveal } from "../_lib/motion";

const ITEMS = [
  "Secure Multi-Party Computation",
  "Zero-Knowledge Proofs",
  "Permissioned Ledger",
  "SGP4 / TLE",
  "Multi-Agent RL",
  "Physics-Aware Proofs",
  "Aligned with UNOOSA · ESA · IADC",
];

export function TechStrip() {
  return (
    <section className="border-y border-line py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-muted">
            A new layer of the space stack, built from proven cryptography
          </p>
        </Reveal>
      </div>

      <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-4 hover:[animation-play-state:paused]">
          {[...ITEMS, ...ITEMS].map((s, i) => (
            <span
              key={i}
              className="flex items-center gap-2.5 whitespace-nowrap rounded-lg border border-line bg-card/50 px-5 py-2.5 text-sm font-medium text-muted backdrop-blur"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
