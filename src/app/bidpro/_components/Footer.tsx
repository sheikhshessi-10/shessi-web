"use client";

import { Radar } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      "Disaster Contract Inbox",
      "FEMA Reimbursability Score",
      "Documentation Defense",
      "Standby MSA Radar",
      "AI Solicitation Assistant",
    ],
  },
  {
    title: "Coverage",
    links: [
      "SAM.gov",
      "State Portals",
      "DemandStar",
      "BidNet Direct",
      "Bonfire",
      "All 50 States",
    ],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact", "Book a demo"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security", "Data Residency"],
  },
];

export function Footer() {
  return (
    <footer className="bg-bg">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-b from-primary to-[#e08905] text-[#1a1205]">
                <Radar className="h-[18px] w-[18px]" strokeWidth={2.4} />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">
                BidPro
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-muted">
              Bid intelligence for disaster recovery. Win more, keep more, through
              closeout.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              system status: operational
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
                    <a
                      href="#"
                      className="text-sm text-text/70 transition-colors hover:text-text"
                    >
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
            © {new Date().getFullYear()} BidPro · A project by Shessi
          </p>
          <p className="font-mono text-[11px] text-muted/70">
            BidPro is an independent project and is not affiliated with FEMA or any
            government agency.
          </p>
        </div>
      </div>
    </footer>
  );
}
