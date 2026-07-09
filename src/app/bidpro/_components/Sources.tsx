"use client";

import { Reveal } from "../_lib/motion";

const SOURCES = [
  "SAM.gov",
  "DemandStar",
  "BidNet Direct",
  "BidPrime",
  "OpenGov",
  "Bonfire",
  "eVA Virginia",
  "50 State Portals",
  "2,900+ Agencies",
  "Special Districts",
];

export function Sources() {
  return (
    <section id="sources" className="border-b border-line py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-muted">
            One feed for a market with no front door. Sources we monitor
          </p>
        </Reveal>
      </div>

      <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-4 hover:[animation-play-state:paused]">
          {[...SOURCES, ...SOURCES].map((s, i) => (
            <span
              key={i}
              className="flex items-center gap-2.5 whitespace-nowrap rounded-lg border border-line bg-card/60 px-5 py-2.5 text-sm font-medium text-muted"
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
