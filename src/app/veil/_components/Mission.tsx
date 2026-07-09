"use client";

import { Reveal } from "../_lib/motion";
import { Eyebrow } from "./ui";
import { BRAND } from "../_lib/brand";

export function Mission() {
  return (
    <section id="mission" className="relative overflow-hidden py-28 sm:py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.07] blur-[140px] animate-[aurora-a_22s_ease-in-out_infinite]" />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <div className="flex justify-center">
            <Eyebrow>Our mission</Eyebrow>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-7 font-display text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl md:text-[2.9rem] text-balance">
            Space is becoming the most contested commons in history.{" "}
            <span className="text-muted">
              Keeping it safe shouldn’t mean giving up your secrets.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg text-balance">
            {BRAND} is neutral infrastructure for orbit, a coordination layer every
            operator, agency, and nation can use precisely because none of them has to
            trust the others, or reveal where their satellites are. Safety and
            sovereignty, at the same time.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-primary/80">
            The Switzerland of space
          </p>
        </Reveal>
      </div>
    </section>
  );
}
