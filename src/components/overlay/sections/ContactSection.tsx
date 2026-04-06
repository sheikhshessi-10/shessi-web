"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "motion/react"

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-15%" })
  const [copied, setCopied] = useState(false)
  const email = "shessi@gmail.com"

  const handleCopy = async () => {
    if (copied) return
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = email
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(32px, 6vw, 80px)",
        position: "relative",
      }}
    >
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
          04 — Let&apos;s Build
        </span>
      </motion.div>

      {/* Headline */}
      <div>
        {["Wanna team up?", "Help me build."].map((line, i) => (
          <div key={i} style={{ overflow: "hidden" }}>
            <motion.h2
              initial={{ y: "110%", opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.1 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: "clamp(2.5rem, 7vw, 6.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "#ffffff",
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              {line}
            </motion.h2>
          </div>
        ))}
      </div>

      {/* Sub-text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.45 }}
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)",
          color: "rgba(255,255,255,0.35)",
          maxWidth: "420px",
          marginTop: "24px",
          lineHeight: 1.7,
        }}
      >
        Open to collaborations, interesting problems, and people who ship.
      </motion.p>

      {/* Email CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{ marginTop: "48px" }}
      >
        <button
          onClick={handleCopy}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
              fontWeight: 500,
              color: copied ? "#22c55e" : "#ffffff",
              transition: "color 0.25s ease",
              letterSpacing: "-0.02em",
              textDecoration: "underline",
              textDecorationColor: copied ? "#22c55e" : "rgba(91,140,255,0.4)",
              textUnderlineOffset: "6px",
            }}
          >
            {copied ? "Copied ✓" : email}
          </span>
        </button>
      </motion.div>

      {/* Available dot */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.8 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 8px #22c55e",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          Available for the right thing
        </span>
        <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }`}</style>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.9 }}
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.06)",
          marginTop: "64px",
          marginBottom: "32px",
          transformOrigin: "left",
        }}
      />

      {/* Footer row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.1 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", gap: "24px" }}>
          {["GitHub", "Twitter", "LinkedIn"].map(link => (
            <a
              key={link}
              href="#"
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.3)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
            >
              {link}
            </a>
          ))}
        </div>
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "0.62rem",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.15)",
          }}
        >
          Built by Shessi · © 2026
        </span>
      </motion.div>
    </section>
  )
}
