"use client";

import { SectionHeading } from "./ui";
import { CountUp, Stagger, StaggerItem } from "../_lib/motion";

type Stat = {
  prefix?: string;
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
  source: string;
  href: string;
};

const STATS: Stat[] = [
  {
    prefix: "$",
    value: 158.9,
    decimals: 1,
    suffix: "B",
    label: "FEMA disaster funding approved over the last five years",
    source: "USAFacts",
    href: "https://usafacts.org/answers/how-much-does-fema-spend-on-disaster-response/country/united-states/",
  },
  {
    value: 88,
    suffix: "%",
    label: "of it flows through Public Assistance, the program that pays recovery contractors",
    source: "USAFacts",
    href: "https://usafacts.org/answers/how-much-does-fema-spend-on-disaster-response/country/united-states/",
  },
  {
    prefix: "$",
    value: 8.17,
    decimals: 2,
    suffix: "B",
    label: "deobligated by FEMA in FY2025, the clawback risk BidPro is built to defend",
    source: "Congressional Research Service",
    href: "https://www.congress.gov/crs-product/R47676",
  },
  {
    prefix: "~",
    value: 90000,
    label: "government entities run fragmented portals; only federal SAM.gov is centralized",
    source: "SLED.AI",
    href: "https://www.sledai.com/blog/what-is-sled",
  },
];

export function Stats() {
  return (
    <section className="border-b border-line py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The stakes"
          title="A market in the hundreds of billions, won one ticket at a time."
          subtitle="The prize is enormous. The penalty for sloppy paperwork is just as big."
        />

        <Stagger className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <StaggerItem
              key={s.label}
              className="flex flex-col gap-3 bg-card/60 p-7"
            >
              <div className="font-mono text-4xl font-semibold tracking-tight text-primary sm:text-[2.75rem]">
                <CountUp
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  decimals={s.decimals}
                />
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
