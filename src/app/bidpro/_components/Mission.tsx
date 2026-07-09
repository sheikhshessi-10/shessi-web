"use client";

import { Reveal } from "../_lib/motion";
import { Eyebrow } from "./ui";

export function Mission() {
  return (
    <section className="relative overflow-hidden border-b border-line py-28 sm:py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.07] blur-[130px] animate-[aurora-a_20s_ease-in-out_infinite]" />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <div className="flex justify-center">
            <Eyebrow>Our mission</Eyebrow>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-7 font-display text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl md:text-[2.9rem] text-balance">
            Hundreds of billions in disaster-recovery funding flows every year.{" "}
            <span className="text-muted">
              Most of it is invisible to the contractors best positioned to win it.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg text-balance">
            BidPro connects what FEMA funds with the contractors who do the work.
            We find every opportunity across thousands of fragmented portals, score
            it for reimbursability, and defend every dollar through closeout. One
            console for a market that never had a center.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-primary/80">
            Purpose-built for the storm economy
          </p>
        </Reveal>
      </div>
    </section>
  );
}
