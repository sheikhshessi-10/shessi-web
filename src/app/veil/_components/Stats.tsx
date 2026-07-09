"use client";

import { SectionHeading } from "./ui";
import { CountUp, Stagger, StaggerItem } from "../_lib/motion";

type Stat = {
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
  source: string;
  href: string;
};

const STATS: Stat[] = [
  {
    value: 6000,
    suffix: "+",
    label: "active satellites now share crowded low-Earth-orbit shells",
    source: "ESA Space Environment Report 2024",
    href: "https://www.esa.int/Space_Safety/Space_Debris/ESA_Space_Environment_Report_2024",
  },
  {
    value: 1000000,
    suffix: "+",
    label: "tracked debris fragments larger than 1 cm, each a potential kill shot",
    source: "ESA Space Environment Report 2024",
    href: "https://www.esa.int/Space_Safety/Space_Debris/ESA_Space_Environment_Report_2024",
  },
  {
    prefix: "+",
    value: 50,
    suffix: "%",
    label: "jump in launch rate in 2023 vs 2022 — and accelerating",
    source: "ESA Space Environment Report 2024",
    href: "https://www.esa.int/Space_Safety/Space_Debris/ESA_Space_Environment_Report_2024",
  },
  {
    value: 100,
    suffix: "%",
    label: "of tracked orbits are published publicly today, readable by any adversary",
    source: "Aerospace Corp · Space-Track",
    href: "https://aerospace.org/ssi-space-situational-awareness",
  },
];

export function Stats() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The stakes"
          title="The orbital commons is at a breaking point."
          subtitle="The collision risk is exploding. The privacy gap is total."
        />

        <Stagger className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <StaggerItem key={s.label} className="flex flex-col gap-3 bg-card/50 p-7 backdrop-blur-sm">
              <div className="font-mono text-4xl font-semibold tracking-tight text-primary sm:text-[2.6rem]">
                <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <p className="text-sm leading-relaxed text-muted">{s.label}</p>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto font-mono text-[10px] uppercase tracking-[0.14em] text-muted/70 underline-offset-4 hover:text-muted hover:underline"
              >
                Source: {s.source}
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
