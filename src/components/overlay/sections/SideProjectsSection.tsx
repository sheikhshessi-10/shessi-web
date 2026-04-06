"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"

const SIDE_PROJECTS = [
  {
    name: "Personal OS",
    desc: "A second brain system built on Notion + Claude. Manages tasks, learning, and weekly reviews automatically.",
    link: null,
    wip: true,
  },
  {
    name: "Cold Email Machine",
    desc: "AI-powered cold outreach tool. Pulls context from LinkedIn + Twitter and writes personalized openers.",
    link: null,
    wip: true,
  },
  {
    name: "Portfolio Site",
    desc: "This one. WebGL crystal, procedural astronaut, scroll-driven camera. Built in a weekend.",
    link: "localhost:3000",
    wip: false,
  },
  {
    name: "Tweet Scheduler",
    desc: "Dead-simple tweet scheduling with a clean dark UI. No subscription, no bloat.",
    link: null,
    wip: true,
  },
  {
    name: "Startup Tracker",
    desc: "Track YC, a16z, and Sequoia portfolio companies. Built for founder pattern recognition.",
    link: null,
    wip: false,
  },
]

export default function SideProjectsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })

  return (
    <section
      ref={ref}
      style={{
        minHeight: "80vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "6rem clamp(32px, 5vw, 72px)",
      }}
    >
      {/* Header */}
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
          ◈ Also building
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
            Side projects
          </motion.h2>
        </div>
      </div>

      {/* Twitter-feed style list — stagger in on scroll */}
      <div style={{ maxWidth: "720px", display: "flex", flexDirection: "column", gap: 0 }}>
        {SIDE_PROJECTS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1.2rem",
              padding: "1.1rem 0",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* Dot indicator */}
            <div style={{
              width: 6, height: 6,
              borderRadius: "50%",
              background: p.wip ? "rgba(255,255,255,0.15)" : "#22c55e",
              boxShadow: p.wip ? "none" : "0 0 6px #22c55e",
              flexShrink: 0,
              marginTop: "0.45rem",
            }} />

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.8rem", marginBottom: "0.3rem" }}>
                <span style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#ffffff",
                  letterSpacing: "-0.01em",
                }}>
                  {p.name}
                </span>
                {p.wip && (
                  <span style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "0.52rem",
                    letterSpacing: "0.15em",
                    color: "rgba(255,255,255,0.2)",
                    textTransform: "uppercase",
                  }}>
                    wip
                  </span>
                )}
              </div>
              <p style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.32)",
                margin: 0,
                lineHeight: 1.6,
              }}>
                {p.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
