"use client";

import { Orbit } from "lucide-react";
import { BRAND } from "../_lib/brand";

const COLUMNS = [
  {
    title: "Protocol",
    links: [
      "SMPC Conjunction Engine",
      "Zero-Knowledge Integrity",
      "Permissioned Ledger",
      "Autonomous Avoidance",
      "Whitepaper",
    ],
  },
  {
    title: "Built on",
    links: ["SMPC", "Zero-Knowledge Proofs", "SGP4 / TLE", "Multi-Agent RL", "BFT Consensus"],
  },
  {
    title: "Company",
    links: ["About", "Research", "Careers", "Request access"],
  },
  {
    title: "Standards",
    links: ["UNOOSA / COPUOS", "ESA STM", "IADC Guidelines", "Space Data Association"],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/40 bg-primary/10 text-primary">
                <Orbit className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">
                {BRAND}
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-muted">
              The neutral, privacy-preserving coordination layer for space traffic.
              Avoid every collision. Reveal nothing.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              protocol status: in development
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-text/70 transition-colors hover:text-text">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <p className="font-mono text-xs text-muted">
            © {new Date().getFullYear()} {BRAND} · A project by Shessi
          </p>
          <p className="font-mono text-[11px] text-muted/70">
            {BRAND} is an independent research project, not affiliated with any space agency.
          </p>
        </div>
      </div>
    </footer>
  );
}
