"use client";

import { Settings2, Brain, Sunrise } from "lucide-react";
import { SectionHeading } from "./ui";
import { Stagger, StaggerItem } from "../_lib/motion";

const STEPS = [
  {
    icon: Settings2,
    title: "Onboard your edge",
    body: "Input your capabilities, your standby positions, your past recovery wins, and the jurisdictions you cover. BidPro learns the rules unique to how you compete for disaster work.",
  },
  {
    icon: Brain,
    title: "Train it as you go",
    body: "Every like, dismiss, and pursue teaches BidPro your preferences, so it surfaces sharper, higher-fit opportunities every single day.",
  },
  {
    icon: Sunrise,
    title: "Make it a habit",
    body: "Wake up to a ranked feed of disaster-recovery opportunities and standby re-bids, instead of scrambling across portals after the next hurricane makes landfall.",
  },
];

export function Personalize() {
  return (
    <section className="border-b border-line py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="Gets smarter daily"
          title="BidPro gets smarter every day you use it."
          subtitle="It learns what makes you competitive, then surfaces better work."
        />

        <Stagger className="mt-14 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <StaggerItem
              key={s.title}
              className="relative flex flex-col gap-4 rounded-xl border border-line bg-card/50 p-7"
            >
              <span className="font-mono text-xs text-muted">0{i + 1}</span>
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-white/[0.02] text-primary">
                <s.icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{s.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
