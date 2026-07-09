"use client";

import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "./ui";
import { CountUp, Reveal } from "../_lib/motion";

const COLS = 22;
const ROWS = 11;

// deterministic "coverage" pattern — denser in the middle to read as a spread map
function isLit(x: number, y: number) {
  const cx = COLS / 2;
  const cy = ROWS / 2;
  const d = Math.hypot((x - cx) / cx, (y - cy) / cy);
  const noise = ((x * 7 + y * 13) % 5) / 5;
  return d < 0.95 && noise > 0.25;
}

export function Market() {
  const reduce = useReducedMotion();
  const dots: { x: number; y: number; lit: boolean }[] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      dots.push({ x, y, lit: isLit(x, y) });
    }
  }

  return (
    <section id="market" className="border-b border-line py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Coverage"
            title="Total coverage of a market with no center."
            subtitle="Every portal, every jurisdiction, every disaster category, in one view."
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
              Only federal contracting is centralized on SAM.gov. Everything else,
              the state purchasing portals, the thousands of county and city sites,
              the special districts, lives apart, each with its own interface and
              update schedule. The disaster restoration market contractors operate in
              is projected to grow from $43.0B in 2025 to{" "}
              <span className="text-text">$58.46B by 2031</span>. BidPro gives you
              complete coverage of your addressable market in a single console.
            </p>
          </Reveal>

          <div className="mt-8 flex gap-10">
            <div>
              <div className="font-mono text-3xl font-semibold text-primary">
                <CountUp value={50} />
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                States covered
              </div>
            </div>
            <div>
              <div className="font-mono text-3xl font-semibold text-primary">
                <CountUp value={2900} suffix="+" />
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                Agencies monitored
              </div>
            </div>
          </div>
        </div>

        {/* coverage constellation */}
        <Reveal delay={0.05}>
          <div className="relative rounded-2xl border border-line bg-card/40 p-8">
            <div className="absolute right-5 top-5 inline-flex items-center gap-1.5 font-mono text-[11px] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> live coverage
            </div>
            <div
              className="grid w-full gap-2"
              style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
            >
              {dots.map((d, i) => (
                <motion.span
                  key={i}
                  className={`aspect-square rounded-[2px] ${
                    d.lit ? "bg-primary" : "bg-white/[0.05]"
                  }`}
                  initial={{ opacity: 0, scale: 0.4 }}
                  whileInView={{
                    opacity: d.lit ? 0.9 : 0.5,
                    scale: 1,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: reduce ? 0 : (d.x + d.y) * 0.012,
                  }}
                />
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-line pt-4 font-mono text-[11px] text-muted">
              <span>SLED + FEMA-funded opportunities</span>
              <span className="text-text">scored daily</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
