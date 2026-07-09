"use client";

import { SearchX, BellOff, FileWarning, Hourglass } from "lucide-react";
import { SectionHeading } from "./ui";
import { Stagger, StaggerItem } from "../_lib/motion";

const CARDS = [
  {
    icon: SearchX,
    title: "Discovery is manual and blind",
    body: "Standby debris and monitoring contracts live on roughly 90,000 government portals that each re-bid every one to two years. Miss one window and you lose a pre-event position you held for years. No BD team can watch them all.",
  },
  {
    icon: BellOff,
    title: "Generic alerts stop at “a bid exists”",
    body: "SLED tools tell you a solicitation went up. They don’t tell you if the work is FEMA-reimbursable under Public Assistance, whether your cost share pencils out, or where the documentation traps are buried.",
  },
  {
    icon: FileWarning,
    title: "FEMA claws money back over paperwork",
    body: "FEMA deobligated $8.17B in FY2025, much of it for documentation and procurement failures on jobs that were actually done. One applicant logged every pile with GPS and still got denied; another lost $3.07M over missing fields.",
  },
  {
    icon: Hourglass,
    title: "Standby contracts pay nothing until a storm",
    body: "A pre-event MSA can sit dormant for a year. Winning the maximum number of standby positions across jurisdictions is the entire game, and tracking those re-bids across fragmented portals is brutal.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="border-b border-line py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The problem"
          title={
            <>
              The work is the easy part.
              <br className="hidden sm:block" /> Keeping the money is the war.
            </>
          }
          subtitle="Disaster recovery punishes you twice: once at the portal, once at closeout."
        />

        <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <StaggerItem
              key={c.title}
              className="group relative flex flex-col gap-4 rounded-xl border border-line bg-card/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-card"
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
