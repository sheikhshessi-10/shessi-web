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
        padding: "0 clamp(24px, 5vw, 72px) 0 clamp(32px, 8vw, 120px)",
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
          top: "clamp(20px, 3.5vh, 36px)",
          left: "clamp(32px, 8vw, 120px)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontFamily: "var(--font-geist-mono)",
          fontSize: "0.6rem",
          letterSpacing: "0.18em",
          color: "rgba(255,255,255,0.22)",
          textTransform: "uppercase",
        }}
      >
        <span>Shessi</span>
        <span style={{ display: "flex", gap: "3px" }}>
          {[0,1,2,3].map(i => (
            <span key={i} style={{ width: "6px", height: "1px", background: "rgba(255,255,255,0.15)", display: "inline-block", verticalAlign: "middle" }} />
          ))}
        </span>
        <span style={{ color: "#5b8cff" }}>live</span>
      </motion.div>

      {/* Main content */}
      <div style={{ maxWidth: "520px" }}>
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            color: "#5b8cff",
            textTransform: "uppercase",
            margin: "0 0 1.2rem 0",
          }}
        >
          Founder · Builder
        </motion.p>

        {/* Name */}
        <div style={{ overflow: "hidden", marginBottom: "1.2rem" }}>
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.65, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: "clamp(3.2rem, 8vw, 7rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
              color: "#ffffff",
              margin: 0,
            }}
          >
            Sches
            <span style={{
              fontSize: "clamp(1.4rem, 3vw, 2.4rem)",
              fontWeight: 500,
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "-0.02em",
              marginLeft: "clamp(8px, 1.5vw, 18px)",
            }}>
              (aka Shessi)
            </span>
          </motion.h1>
        </div>

        {/* One-liner */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
            color: "rgba(255,255,255,0.38)",
            lineHeight: 1.65,
            margin: 0,
            maxWidth: "360px",
          }}
        >
          Building things worth remembering.{" "}
          <span style={{ color: "rgba(255,255,255,0.65)" }}>Founder-mode activated.</span>
        </motion.p>
      </div>

      {/* Bottom scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          position: "absolute",
          bottom: "clamp(20px, 3.5vh, 36px)",
          left: "clamp(32px, 8vw, 120px)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.12)" }}
        />
        <span style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "0.5rem",
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
