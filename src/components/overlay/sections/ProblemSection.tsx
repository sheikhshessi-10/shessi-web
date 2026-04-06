"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "motion/react"
import FullScreenCard, { CardData } from "./FullScreenCard"

const TOWEREX_CARD: CardData = {
  id: "towerex",
  eyebrow: "Venture · 01",
  title: "TOWEREX",
  tagline: "Data centers are the backbone of AI. Every model you run generates heat. Massive, relentless heat.",
  description:
    "Right now cooling that heat consumes 20–40% of a data center's total energy. It burns electricity. It wastes water. It breaks down. And as AI scales, the problem gets exponentially worse.\n\nThe world is spending trillions on AI infrastructure. Nobody has elegantly solved what happens when it overheats.",
  details: [
    "TOWEREX is a passive phase-exchange cooling tower that runs on pure thermodynamics",
    "No electricity. No water. No moving parts. No maintenance.",
    "Capacity scales superlinearly with tower height — exponentially more cooling per meter",
    "Every hyperscaler, every colocation facility, every AI company on the planet needs this",
  ],
  link: "mailto:sheikhshessi@gmail.com",
  linkLabel: "Interested in how it works?",
  accentColor: "#ff4f1f",
}

export default function ProblemSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-15% 0px" })
  const [cardOpen, setCardOpen] = useState(false)

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "8rem clamp(48px, 8vw, 120px)",
        position: "relative",
      }}
    >
      {/* Problem statement */}
      <div style={{ maxWidth: "680px", marginBottom: "4rem" }}>
        {/* Section marker */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            color: "#ff4f1f",
            textTransform: "uppercase",
            margin: "0 0 2.5rem 0",
            opacity: 0.7,
          }}
        >
          ◈ The problem
        </motion.p>

        {/* Statement — large, sparse */}
        <div style={{ overflow: "hidden", marginBottom: "0.6rem" }}>
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
            I solve problems.
          </motion.h2>
        </div>

        <div style={{ overflow: "hidden", marginBottom: "2rem" }}>
          <motion.h2
            initial={{ y: "100%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: "rgba(255,255,255,0.22)",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            The big one right now:
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "clamp(1.1rem, 2.2vw, 1.45rem)",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.65,
            margin: 0,
            maxWidth: "580px",
          }}
        >
          Data centers are melting under the weight of AI.{" "}
          <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
            I&apos;m fixing that.
          </span>
        </motion.p>
      </div>

      {/* TOWEREX card — expands full screen */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: "560px", pointerEvents: "all" }}
      >
        <FullScreenCard
          card={TOWEREX_CARD}
          isOpen={cardOpen}
          onOpen={() => setCardOpen(true)}
          onClose={() => setCardOpen(false)}
          variant="darker"
        />
      </motion.div>
    </section>
  )
}
