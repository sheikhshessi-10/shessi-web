"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "motion/react"

const VENTURES = [
  {
    id: "01",
    name: "ConceptHero",
    tag: "Active",
    tagColor: "#22c55e",
    short: "The platform where ideas become products.",
    what: "A full-stack product studio that takes founders from zero to shipped. Design system, AI-powered spec generation, and rapid deployment pipelines all in one place.",
    stack: ["Next.js", "Supabase", "OpenAI", "Vercel"],
    status: "Building in public",
    url: null,
  },
  {
    id: "02",
    name: "AI Workflows",
    tag: "Exploring",
    tagColor: "#f59e0b",
    short: "Automating the boring parts of founding.",
    what: "A suite of AI agents that handle the operational overhead of running a company — investor updates, sprint planning, customer research synthesis. So founders can stay in the creative zone.",
    stack: ["Claude API", "Zapier", "Notion", "Vercel"],
    status: "Early research",
    url: null,
  },
  {
    id: "03",
    name: "Design System",
    tag: "Shipping",
    tagColor: "#5b8cff",
    short: "Visual language that scales without losing soul.",
    what: "A component library and design token system built for founders who care about craft. Ships with dark mode, motion primitives, and accessibility out of the box. Open source.",
    stack: ["React", "Tailwind", "Radix UI", "Storybook"],
    status: "Open source — soon",
    url: null,
  },
]

function VentureCard({ venture, index, inView }: {
  venture: typeof VENTURES[0]
  index: number
  inView: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.1 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => setOpen(o => !o)}
      style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "1.4rem 0",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* Card header — always visible */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          {/* Number + tag row */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.5rem" }}>
            <span style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.18)",
            }}>
              {venture.id}
            </span>
            <span style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontFamily: "var(--font-geist-mono)",
              fontSize: "0.55rem",
              letterSpacing: "0.15em",
              color: venture.tagColor,
              textTransform: "uppercase",
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: venture.tagColor,
                boxShadow: `0 0 6px ${venture.tagColor}`,
                display: "inline-block",
              }} />
              {venture.tag}
            </span>
          </div>

          {/* Name */}
          <h3 style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: "#ffffff",
            margin: "0 0 0.35rem 0",
          }}>
            {venture.name}
          </h3>

          {/* Short description */}
          <p style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.35)",
            margin: 0,
            lineHeight: 1.5,
          }}>
            {venture.short}
          </p>
        </div>

        {/* Expand chevron */}
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: 28, height: 28,
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            marginTop: "0.25rem",
            color: "rgba(255,255,255,0.3)",
            fontSize: "1rem",
            fontWeight: 300,
          }}
        >
          +
        </motion.div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingTop: "1.4rem", paddingLeft: "0" }}>
              {/* Full description */}
              <p style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: "0.95rem",
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.75,
                margin: "0 0 1.4rem 0",
                maxWidth: "580px",
              }}>
                {venture.what}
              </p>

              {/* Stack tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.2rem" }}>
                {venture.stack.map(s => (
                  <span key={s} style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.12em",
                    color: "rgba(255,255,255,0.3)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    padding: "4px 10px",
                    textTransform: "uppercase",
                  }}>
                    {s}
                  </span>
                ))}
              </div>

              {/* Status */}
              <div style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                color: venture.tagColor,
                textTransform: "uppercase",
                opacity: 0.7,
              }}>
                → {venture.status}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function VenturesSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "6rem clamp(32px, 5vw, 72px)",
        position: "relative",
      }}
    >
      {/* Section header */}
      <div style={{ marginBottom: "3rem", maxWidth: "720px" }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            color: "#5b8cff",
            textTransform: "uppercase",
            margin: "0 0 1.2rem 0",
          }}
        >
          ◈ What I&apos;m building
        </motion.p>

        <div style={{ overflow: "hidden" }}>
          <motion.h2
            initial={{ y: "100%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: "#ffffff",
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            Ventures
          </motion.h2>
        </div>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: "720px" }}>
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          {VENTURES.map((v, i) => (
            <VentureCard key={v.id} venture={v} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
