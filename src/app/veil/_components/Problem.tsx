"use client";

import { Orbit, Crosshair, EyeOff, Scale } from "lucide-react";
import { SectionHeading } from "./ui";
import { Stagger, StaggerItem } from "../_lib/motion";

const CARDS = [
  {
    icon: Orbit,
    title: "Low Earth orbit is dangerously full",
    body: "Over 6,000 active satellites share the same shells, alongside 1M+ tracked debris fragments. Conjunction alerts are climbing fast, and a single break-up could cascade.",
  },
  {
    icon: Crosshair,
    title: "Everyone already sees everyone’s orbit",
    body: "To avoid collisions today, operators rely on public catalogs like Space-Track. In a conflict, that same data is a ready-made targeting solution against your assets.",
  },
  {
    icon: EyeOff,
    title: "So operators withhold the good data",
    body: "Covariances and planned maneuvers stay secret for competitive and security reasons. Coordination runs on partial, stale information, exactly when precision matters most.",
  },
  {
    icon: Scale,
    title: "No one can be trusted to hold it all",
    body: "A neutral controller would need every operator’s exact orbit. No nation or company will hand that over. The problem isn’t will, it’s that the trust can’t exist.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The problem"
          title={
            <>
              Space is filling up. The way we
              <br className="hidden sm:block" /> keep it safe is broken.
            </>
          }
          subtitle="Today, avoiding a collision means handing rivals a targeting solution."
        />

        <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <StaggerItem
              key={c.title}
              className="group relative flex flex-col gap-4 rounded-xl border border-line bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-card/70"
            >
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-300 group-hover:via-primary/70" />
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-white/[0.02] text-primary">
                <c.icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {c.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{c.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
