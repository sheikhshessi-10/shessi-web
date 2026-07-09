"use client";

import { ArrowRight, ShieldCheck, Lock, ScrollText, MapPin } from "lucide-react";
import { ContourBg, PrimaryButton, GhostButton } from "./ui";
import { Reveal, Stagger, StaggerItem } from "../_lib/motion";

const BADGES = [
  { icon: ShieldCheck, label: "SOC 2-ready" },
  { icon: Lock, label: "Encrypted in transit & at rest" },
  { icon: ScrollText, label: "Audit log" },
  { icon: MapPin, label: "US data residency" },
];

export function CTA() {
  return (
    <section id="demo" className="border-b border-line py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-line-strong bg-surface px-6 py-16 text-center sm:px-12 sm:py-20">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,black,transparent)]" />
          <div className="pointer-events-none absolute inset-0 text-primary/[0.06]">
            <ContourBg className="h-full w-full" />
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] animate-[aurora-a_18s_ease-in-out_infinite]" />

          <div className="relative mx-auto max-w-2xl">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl text-balance">
                Don&rsquo;t let the next storm catch your pipeline empty.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mx-auto mt-5 max-w-xl text-base text-muted sm:text-lg text-balance">
                Book a demo and see every disaster-recovery opportunity, scored for
                FEMA reimbursability and defended through closeout, in one console.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <PrimaryButton className="group">
                  Book a demo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </PrimaryButton>
                <GhostButton>Talk to the team</GhostButton>
              </div>
            </Reveal>
          </div>
        </div>

        <Stagger className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {BADGES.map((b) => (
            <StaggerItem
              key={b.label}
              className="flex items-center gap-2 font-mono text-xs text-muted"
            >
              <b.icon className="h-4 w-4 text-accent" strokeWidth={1.8} />
              {b.label}
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
