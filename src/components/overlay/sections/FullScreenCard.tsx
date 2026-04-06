"use client"

import { useState } from "react"
import { motion } from "motion/react"
import PageOverlay from "../PageOverlay"

export interface CardData {
  id: string
  eyebrow: string
  title: string
  tagline: string
  description: string
  details?: string[]
  link?: string | null
  linkLabel?: string
  accentColor?: string
}

interface FullScreenCardProps {
  card: CardData
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  variant?: "dark" | "darker"
}

export default function FullScreenCard({
  card,
  isOpen,
  onOpen,
  onClose,
}: FullScreenCardProps) {
  const accent = card.accentColor || "#5b8cff"

  return (
    <>
      {/* ── Collapsed card ─────────────────────────────────────────────── */}
      <motion.div
        onClick={onOpen}
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "clamp(1.4rem, 3vw, 2rem) clamp(1.2rem, 3vw, 2.2rem)",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          touchAction: "manipulation",
        }}
        whileHover={{ borderColor: `${accent}40`, background: "rgba(255,255,255,0.05)" }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.18 }}
      >
        {/* Accent top border */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "2px", background: accent,
        }} />

        <div style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "0.58rem",
          letterSpacing: "0.2em",
          color: accent,
          textTransform: "uppercase",
          marginBottom: "0.8rem",
          opacity: 0.7,
        }}>
          {card.eyebrow}
        </div>

        <h3 style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: "clamp(1.4rem, 4vw, 2.4rem)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "#ffffff",
          margin: "0 0 0.6rem 0",
          lineHeight: 1.1,
        }}>
          {card.title}
        </h3>

        <p style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
          color: "rgba(255,255,255,0.4)",
          margin: "0 0 1.6rem 0",
          lineHeight: 1.55,
        }}>
          {card.tagline}
        </p>

        {/* Open CTA */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          fontFamily: "var(--font-geist-mono)",
          fontSize: "0.62rem",
          letterSpacing: "0.15em",
          color: accent,
          textTransform: "uppercase",
          opacity: 0.8,
        }}>
          <span>Open</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M7 2l5 5-5 5" stroke={accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.div>

      {/* ── Full-page overlay ───────────────────────────────────────────── */}
      <PageOverlay
        isOpen={isOpen}
        onClose={onClose}
        accentColor={accent}
        label={card.eyebrow}
      >
        <div style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "clamp(40px, 6vw, 80px) clamp(20px, 5vw, 60px)",
          width: "100%",
        }}>
          {/* Eyebrow */}
          <div style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "clamp(0.58rem, 1.5vw, 0.65rem)",
            letterSpacing: "0.25em",
            color: accent,
            textTransform: "uppercase",
            marginBottom: "1.4rem",
            opacity: 0.8,
          }}>
            {card.eyebrow}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "clamp(2.4rem, 8vw, 5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            margin: "0 0 1rem 0",
            lineHeight: 0.95,
          }}>
            {card.title}
          </h1>

          {/* Tagline */}
          <p style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: "rgba(255,255,255,0.42)",
            margin: "0 0 3rem 0",
            lineHeight: 1.6,
          }}>
            {card.tagline}
          </p>

          {/* Divider */}
          <div style={{
            width: "40px", height: "1px",
            background: `${accent}55`,
            marginBottom: "2.5rem",
          }} />

          {/* Description — supports \n\n paragraph breaks */}
          <div style={{ marginBottom: "2.5rem", display: "flex", flexDirection: "column", gap: "1.4rem" }}>
            {card.description.split("\n\n").map((para, i) => (
              <p key={i} style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: "clamp(1rem, 2vw, 1.1rem)",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.85,
                margin: 0,
              }}>
                {para}
              </p>
            ))}
          </div>

          {/* Details */}
          {card.details && (
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 2.8rem 0",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}>
              {card.details.map((d, i) => (
                <li key={i} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.9rem",
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.6,
                }}>
                  <span style={{ color: accent, flexShrink: 0, marginTop: "3px", fontSize: "1rem" }}>→</span>
                  {d}
                </li>
              ))}
            </ul>
          )}

          {/* Link CTA */}
          {card.link && (
            <a
              href={card.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.7rem",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "0.68rem",
                letterSpacing: "0.15em",
                color: accent,
                textDecoration: "none",
                textTransform: "uppercase",
                border: `1px solid ${accent}40`,
                padding: "0.85rem 1.6rem",
                minHeight: "44px",
                transition: "all 0.2s",
              }}
            >
              {card.linkLabel || "Visit"}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 6h10M6 1l5 5-5 5" stroke={accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          )}
        </div>
      </PageOverlay>
    </>
  )
}
