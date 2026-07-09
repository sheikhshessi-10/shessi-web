"use client";

import { motion } from "motion/react";
import {
  Inbox,
  Gauge,
  ShieldCheck,
  Radar as RadarIcon,
  Scale,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "./ui";
import { CountUp, Stagger, StaggerItem } from "../_lib/motion";

const INBOX_ROWS = [
  { id: "FL-2291", t: "Pre-event debris removal MSA", s: 96 },
  { id: "TX-0148", t: "Debris monitoring services", s: 91 },
  { id: "LA-7733", t: "Emergency ROW clearing, re-bid", s: 88 },
  { id: "NC-0925", t: "Hurricane recovery & restoration", s: 84 },
];

export function Features() {
  return (
    <section id="features" className="border-b border-line py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The platform"
          title="Built for how disaster contracts are actually won, and kept."
          subtitle="Discovery, scoring, documentation defense, and standby tracking in one console."
        />

        <Stagger className="mt-14 grid gap-4 lg:grid-cols-3">
          {/* Inbox — large */}
          <StaggerItem className="group relative flex flex-col gap-5 rounded-xl border border-line bg-card/50 p-6 transition-colors hover:border-line-strong sm:col-span-2 lg:col-span-2">
            <TopGlow />
            <CellHead
              icon={Inbox}
              kicker="Disaster Contract Inbox"
              title="Every solicitation, matched to how you compete"
            />
            <p className="max-w-xl text-sm leading-relaxed text-muted">
              Our AI scrapes thousands of state and local portals plus SAM.gov and
              matches every solicitation against your capabilities, your standby
              positions, and the disaster categories you run, so no re-bid window
              is ever missed again.
            </p>

            <div className="mt-auto overflow-hidden rounded-lg border border-line bg-bg/60">
              {INBOX_ROWS.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                  className="flex items-center gap-3 border-b border-line px-4 py-2.5 last:border-0"
                >
                  <span className="font-mono text-[11px] text-muted">{r.id}</span>
                  <span className="flex-1 truncate text-sm text-text/90">{r.t}</span>
                  <span className="rounded border border-primary/40 bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-primary">
                    {r.s}
                  </span>
                </motion.div>
              ))}
            </div>
          </StaggerItem>

          {/* FEMA score */}
          <StaggerItem className="group relative flex flex-col gap-5 rounded-xl border border-line bg-card/50 p-6 transition-colors hover:border-line-strong">
            <TopGlow />
            <CellHead
              icon={Gauge}
              kicker="FEMA Reimbursability Score"
              title="Know which bids are worth your time"
            />
            <div className="flex items-end gap-2">
              <span className="font-mono text-5xl font-semibold text-primary">
                <CountUp value={94} />
              </span>
              <span className="mb-1.5 font-mono text-sm text-muted">/ 100</span>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              Every opportunity is scored 1–100: is it Public Assistance Category A
              debris, does the 75% federal share apply, and how does your 25%
              non-federal share pencil out?
            </p>
          </StaggerItem>

          {/* Documentation Defense — the wedge */}
          <StaggerItem className="group relative flex flex-col gap-4 rounded-xl border border-primary/25 bg-gradient-to-b from-primary/[0.06] to-card/50 p-6 transition-colors hover:border-primary/40">
            <span className="absolute right-5 top-5 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
              The wedge
            </span>
            <CellHead
              icon={ShieldCheck}
              kicker="Documentation Defense"
              title="Win the bid and keep the money"
            />
            <p className="text-sm leading-relaxed text-muted">
              BidPro maps the exact load tickets, monitoring logs, cubic-yard
              records, and procurement trail FEMA will demand at closeout, then
              flags the deobligation traps that sink awards years later.
            </p>
          </StaggerItem>

          {/* Standby radar */}
          <StaggerItem className="group relative flex flex-col gap-4 rounded-xl border border-line bg-card/50 p-6 transition-colors hover:border-line-strong">
            <TopGlow />
            <CellHead
              icon={RadarIcon}
              kicker="Standby MSA Radar"
              title="Defend positions two years out"
            />
            <p className="text-sm leading-relaxed text-muted">
              Track every pre-event and standby Master Service Agreement across
              every jurisdiction, with re-bid windows surfaced two years out, so
              you grab the ones competitors let lapse.
            </p>
          </StaggerItem>

          {/* Reasonable cost */}
          <StaggerItem className="group relative flex flex-col gap-4 rounded-xl border border-line bg-card/50 p-6 transition-colors hover:border-line-strong">
            <TopGlow />
            <CellHead
              icon={Scale}
              kicker="Reasonable-Cost Guardrail"
              title="Don’t bill 15% and collect 6.5%"
            />
            <p className="text-sm leading-relaxed text-muted">
              BidPro benchmarks your monitoring and engineering percentages against
              what FEMA has actually allowed in appeals, so your fees survive the
              reasonableness test.
            </p>
          </StaggerItem>

          {/* Assistant — wide */}
          <StaggerItem className="group relative flex flex-col gap-5 rounded-xl border border-line bg-card/50 p-6 transition-colors hover:border-line-strong lg:col-span-3">
            <TopGlow />
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <CellHead
                  icon={Sparkles}
                  kicker="AI Solicitation Assistant"
                  title="Evaluate any RFP in seconds"
                />
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Ask plain questions about any RFP, IFB, or re-bid and instantly
                  assess technical requirements, procurement rules, full-and-open
                  competition compliance, and whether it’s worth pursuing.
                </p>
              </div>
              <div className="w-full max-w-md shrink-0 rounded-lg border border-line bg-bg/60 p-4">
                <div className="font-mono text-xs text-muted">
                  <span className="text-accent">›</span> Is FL-2291 FEMA-reimbursable?
                </div>
                <div className="mt-3 rounded-md border border-line bg-card/60 p-3 text-sm text-text/90">
                  Yes. Public Assistance Category A. 75% federal share applies.
                  <span className="text-primary"> 2 documentation traps flagged.</span>
                </div>
              </div>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

function TopGlow() {
  return (
    <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-300 group-hover:via-primary/60" />
  );
}

function CellHead({
  icon: Icon,
  kicker,
  title,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  kicker: string;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-white/[0.02] text-primary">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary/80">
          {kicker}
        </div>
        <h3 className="mt-1 font-display text-lg font-semibold tracking-tight">
          {title}
        </h3>
      </div>
    </div>
  );
}
