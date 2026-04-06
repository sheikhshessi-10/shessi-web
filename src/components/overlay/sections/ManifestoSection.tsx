"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"

const lines = [
  { text: "I don't build features.", highlight: false },
  { text: "I build", highlight: false, suffix: " futures." },
  { text: "Systems that outlast the hype.", highlight: true },
  { text: "Products people actually need.", highlight: true },
]

const stats = [
  { value: "0→1", label: "Builder" },
  { value: "∞", label: "Mindset" },
  { value: "2026", label: "Now" },
]

export default function ManifestoSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-20%" })

  return (
    <section
      ref={ref}
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        padding: "clamp(32px, 6vw, 80px)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "880px" }}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          <div style={{ width: "32px", height: "1px", background: "#5b8cff" }} />
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "0.62rem",
              letterSpacing: "0.35em",
              color: "#5b8cff",
              textTransform: "uppercase",
            }}
          >
            02 — Manifesto
          </span>
        </motion.div>

        {/* Big headline lines */}
        <div>
          {lines.map((line, i) => (
            <div key={i} style={{ overflow: "hidden", lineHeight: 1.1 }}>
              <motion.div
                initial={{ y: "110%", opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: "clamp(2rem, 5.5vw, 5rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.035em",
                    color: line.highlight ? "#ffffff" : "rgba(255,255,255,0.25)",
                    display: "inline",
                  }}
                >
                  {line.text}
                  {line.suffix && (
                    <span style={{ color: "#5b8cff" }}>{line.suffix}</span>
                  )}
                </span>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{
            display: "flex",
            gap: "clamp(32px, 6vw, 80px)",
            marginTop: "64px",
            paddingTop: "48px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {stats.map((s, i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.3em",
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
