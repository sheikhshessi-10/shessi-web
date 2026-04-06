"use client"

import { motion } from "motion/react"

export default function HeroSection() {
  return (
    <section
      className="hero-col"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 clamp(32px, 5vw, 72px) 0 clamp(80px, 10vw, 140px)",
        position: "relative",
        pointerEvents: "none",
      }}
    >
      {/* Top-left: minimal identity label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        style={{
          position: "absolute",
          top: "clamp(24px, 4vh, 44px)",
          left: "clamp(80px, 10vw, 140px)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontFamily: "var(--font-geist-mono)",
          fontSize: "0.62rem",
          letterSpacing: "0.18em",
          color: "rgba(255,255,255,0.22)",
          textTransform: "uppercase",
        }}
      >
        <span>Shessi</span>
        <span style={{ display: "flex", gap: "3px" }}>
          {"————".split("").map((_, i) => (
            <span key={i} style={{ width: "6px", height: "1px", background: "rgba(255,255,255,0.15)", display: "inline-block", verticalAlign: "middle" }} />
          ))}
        </span>
        <span style={{ color: "#5b8cff" }}>live</span>
      </motion.div>

      {/* Main content — left column */}
      <div style={{ maxWidth: "520px" }}>
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.22em",
            color: "#5b8cff",
            textTransform: "uppercase",
            marginBottom: "1.6rem",
            margin: "0 0 1.6rem 0",
          }}
        >
          Founder · Builder
        </motion.p>

        {/* Name — clean, no glitch, just weight */}
        <div style={{ overflow: "hidden", marginBottom: "2rem" }}>
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.65, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: "clamp(4rem, 8vw, 7.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              color: "#ffffff",
              margin: 0,
            }}
          >
            SHESSI
          </motion.h1>
        </div>

        {/* One-liner */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)",
            color: "rgba(255,255,255,0.38)",
            lineHeight: 1.65,
            margin: "0 0 2.8rem 0",
            maxWidth: "380px",
          }}
        >
          Building things worth remembering.{" "}
          <span style={{ color: "rgba(255,255,255,0.65)" }}>Founder-mode activated.</span>
        </motion.p>

        {/* CTA links — Twitter-style minimal */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.7 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.8rem",
            pointerEvents: "all",
          }}
        >
          {[
            { label: "Twitter",  href: "https://twitter.com" },
            { label: "GitHub",   href: "https://github.com" },
            { label: "Work",     href: "#projects" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                color: label === "Work" ? "#ffffff" : "rgba(255,255,255,0.28)",
                textDecoration: "none",
                textTransform: "uppercase",
                borderBottom: label === "Work" ? "1px solid rgba(255,255,255,0.25)" : "none",
                paddingBottom: label === "Work" ? "2px" : "0",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={e => (e.currentTarget.style.color = label === "Work" ? "#ffffff" : "rgba(255,255,255,0.28)")}
            >
              {label}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Bottom scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          position: "absolute",
          bottom: "clamp(24px, 4vh, 44px)",
          left: "clamp(80px, 10vw, 140px)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.12)" }}
        />
        <span style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "0.52rem",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.15)",
          textTransform: "uppercase",
        }}>
          Scroll
        </span>
      </motion.div>
    </section>
  )
}
