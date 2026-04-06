"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"

const SIDE_PROJECTS = [
  {
    name: "UltraChant",
    desc: "AI-powered chant and crowd energy platform. Built for sports, events, and communities that want to move together.",
    url: "https://www.ultrachant.com/",
    status: "live",
  },
]

export default function SideSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })

  return (
    <section
      ref={ref}
      style={{
        minHeight: "60vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "8rem clamp(48px, 8vw, 120px)",
        position: "relative",
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: "720px", marginBottom: "3.5rem" }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            color: "#a78bfa",
            textTransform: "uppercase",
            margin: "0 0 2.5rem 0",
            opacity: 0.75,
          }}
        >
          ◈ Also shipping
        </motion.p>

        <div style={{ overflow: "hidden" }}>
          <motion.h2
            initial={{ y: "100%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: "#ffffff",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Side projects.
          </motion.h2>
        </div>
      </div>

      {/* Project list */}
      <div style={{ maxWidth: "680px", pointerEvents: "all" }}>
        {SIDE_PROJECTS.map((p, i) => (
          <motion.a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "2rem",
              padding: "1.6rem 0",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              textDecoration: "none",
              cursor: "pointer",
            }}
            whileHover="hover"
          >
            {/* Left: dot + content */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem", flex: 1 }}>
              {/* Live indicator */}
              <div style={{
                width: 7, height: 7,
                borderRadius: "50%",
                background: p.status === "live" ? "#22c55e" : "rgba(255,255,255,0.15)",
                boxShadow: p.status === "live" ? "0 0 8px #22c55e" : "none",
                flexShrink: 0,
                marginTop: "0.45rem",
              }} />

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.4rem" }}>
                  <span style={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                    fontWeight: 700,
                    color: "#ffffff",
                    letterSpacing: "-0.02em",
                  }}>
                    {p.name}
                  </span>
                  {p.status === "live" && (
                    <span style={{
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: "0.52rem",
                      letterSpacing: "0.15em",
                      color: "#22c55e",
                      textTransform: "uppercase",
                      opacity: 0.8,
                    }}>
                      live
                    </span>
                  )}
                </div>
                <p style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: "clamp(0.85rem, 1.8vw, 0.95rem)",
                  color: "rgba(255,255,255,0.35)",
                  margin: 0,
                  lineHeight: 1.6,
                  maxWidth: "480px",
                }}>
                  {p.desc}
                </p>
              </div>
            </div>

            {/* Right: arrow */}
            <motion.div
              variants={{ hover: { x: 4, opacity: 1 } }}
              style={{
                flexShrink: 0,
                color: "#a78bfa",
                opacity: 0.5,
                marginTop: "0.25rem",
                transition: "opacity 0.2s",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
