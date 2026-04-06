"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "motion/react"
import FullScreenCard, { CardData } from "./FullScreenCard"

const INFINIX_CARD: CardData = {
  id: "infinix",
  eyebrow: "Venture · 02",
  title: "Infinix Leverage",
  tagline: "Most businesses don't have an AI problem. They have an integration problem.",
  description:
    "The tools exist. The models are powerful. But nobody has mapped them to how your business actually thinks, decides, and operates. That's what we do.\n\nInfinix Leverage starts with your business logic — every workflow, every decision point, every data source. We build AI agents that embed directly into your team. Not a chatbot sitting on the side. Agents assigned to specific people, specific functions, specific outcomes.",
  details: [
    "Your operations manager has an agent. Your sales team has an agent. Your data has a brain.",
    "Your team doesn't change how they work. The work just gets done faster, smarter, with less friction.",
    "That's vertical AI integration. That's Infinix Leverage.",
  ],
  link: null,
  linkLabel: undefined,
  accentColor: "#5b8cff",
}

export default function AIRevSection() {
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
      {/* Statement */}
      <div style={{ maxWidth: "680px", marginBottom: "4rem" }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            color: "#5b8cff",
            textTransform: "uppercase",
            margin: "0 0 2.5rem 0",
            opacity: 0.7,
          }}
        >
          ◈ The opportunity
        </motion.p>

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
            The AI revolution is real.
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
            Here&apos;s what I&apos;m building for it.
          </motion.h2>
        </div>

      </div>

      {/* Infinix card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: "560px", pointerEvents: "all" }}
      >
        <FullScreenCard
          card={INFINIX_CARD}
          isOpen={cardOpen}
          onOpen={() => setCardOpen(true)}
          onClose={() => setCardOpen(false)}
          variant="dark"
        />
      </motion.div>
    </section>
  )
}
