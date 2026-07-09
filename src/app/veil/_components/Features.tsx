"use client";

import { motion } from "motion/react";
import {
  Network,
  ShieldCheck,
  EyeOff,
  Boxes,
  BrainCircuit,
  LifeBuoy,
  Lock,
} from "lucide-react";
import { SectionHeading } from "./ui";
import { Stagger, StaggerItem } from "../_lib/motion";

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The platform"
          title="Built for a contested, crowded orbit."
          subtitle="Cryptographic coordination, autonomous avoidance, and a tamper-proof record, in one protocol."
        />

        <Stagger className="mt-14 grid gap-4 lg:grid-cols-3">
          {/* SMPC engine — large */}
          <StaggerItem className="group relative flex flex-col gap-5 rounded-xl border border-line bg-card/40 p-6 backdrop-blur-sm transition-colors hover:border-line-strong sm:col-span-2 lg:col-span-2">
            <TopGlow />
            <CellHead
              icon={Network}
              kicker="SMPC Conjunction Engine"
              title="Compute collision risk on data no one can read"
            />
            <p className="max-w-xl text-sm leading-relaxed text-muted">
              Operators secret-share their orbits across compute nodes, which jointly
              evaluate the conjunction integral. You get exact collision
              probabilities, not noisy approximations, and not a single shared coordinate.
            </p>

            <div className="mt-auto grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg border border-line bg-bg/50 p-4">
              <Encrypted label="Operator A" />
              <div className="flex flex-col items-center gap-1 text-primary">
                <Lock className="h-4 w-4" />
                <span className="font-mono text-[10px] uppercase tracking-wider">MPC</span>
              </div>
              <Encrypted label="Operator B" />
              <div className="col-span-3 mt-1 flex items-center justify-center gap-2 border-t border-line pt-3 font-mono text-xs">
                <span className="text-muted">output</span>
                <span className="text-line-strong">▸</span>
                <span className="rounded border border-primary/40 bg-primary/10 px-2 py-0.5 text-primary">
                  Pc = 0.0012
                </span>
              </div>
            </div>
          </StaggerItem>

          {/* ZK integrity */}
          <StaggerItem className="group relative flex flex-col gap-5 rounded-xl border border-line bg-card/40 p-6 backdrop-blur-sm transition-colors hover:border-line-strong">
            <TopGlow />
            <CellHead
              icon={ShieldCheck}
              kicker="Zero-Knowledge Integrity"
              title="Prove you played fair"
            />
            <p className="text-sm leading-relaxed text-muted">
              Each party proves it ran the agreed computation and that its orbit obeyed
              physics, without revealing maneuvers or state. Cheating is provable;
              honesty leaks nothing.
            </p>
          </StaggerItem>

          {/* wedge: zero disclosure */}
          <StaggerItem className="group relative flex flex-col gap-4 rounded-xl border border-primary/25 bg-gradient-to-b from-primary/[0.07] to-card/40 p-6 backdrop-blur-sm transition-colors hover:border-primary/40">
            <span className="absolute right-5 top-5 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
              The wedge
            </span>
            <CellHead
              icon={EyeOff}
              kicker="Zero Orbit Disclosure"
              title="Only the verdict ever leaves"
            />
            <p className="text-sm leading-relaxed text-muted">
              No position, velocity, or covariance is exposed, to anyone, ever. Even a
              corrupted node learns nothing below the collusion threshold. This is the
              guarantee no public catalog can make.
            </p>
          </StaggerItem>

          {/* ledger */}
          <StaggerItem className="group relative flex flex-col gap-4 rounded-xl border border-line bg-card/40 p-6 backdrop-blur-sm transition-colors hover:border-line-strong">
            <TopGlow />
            <CellHead
              icon={Boxes}
              kicker="Permissioned Ledger"
              title="A record no one can rewrite"
            />
            <p className="text-sm leading-relaxed text-muted">
              Every alert, maneuver, and attestation is signed and written to a
              Byzantine-fault-tolerant ledger. High throughput, no public mining, a
              clean audit trail for every decision.
            </p>
          </StaggerItem>

          {/* MARL */}
          <StaggerItem className="group relative flex flex-col gap-4 rounded-xl border border-line bg-card/40 p-6 backdrop-blur-sm transition-colors hover:border-line-strong">
            <TopGlow />
            <CellHead
              icon={BrainCircuit}
              kicker="Autonomous Avoidance"
              title="Maneuvers that cooperate"
            />
            <p className="text-sm leading-relaxed text-muted">
              Federated reinforcement-learning agents pick fuel-efficient avoidance
              maneuvers cooperatively, training on shared gradients, never shared data.
            </p>
          </StaggerItem>

          {/* graceful degradation — wide */}
          <StaggerItem className="group relative flex flex-col gap-5 rounded-xl border border-line bg-card/40 p-6 backdrop-blur-sm transition-colors hover:border-line-strong lg:col-span-3">
            <TopGlow />
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <CellHead
                  icon={LifeBuoy}
                  kicker="Graceful Degradation"
                  title="Failures reduce completeness, never safety"
                />
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Partial participation, a network partition, or a stalled computation
                  all fall back safely to known-good plaintext alerting. The system
                  bends; it never blinds an operator.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 font-mono text-[11px] text-muted">
                {["partial participation", "network partition", "node offline", "plaintext fallback"].map((t) => (
                  <span key={t} className="rounded-md border border-line bg-bg/50 px-2.5 py-1">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

function Encrypted({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-line bg-card/60 px-3 py-2.5 text-center">
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-1 font-mono text-sm tracking-widest text-accent">●●●●●●</div>
    </div>
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
