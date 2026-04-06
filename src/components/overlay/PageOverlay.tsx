"use client"

/**
 * Full-page slide-up overlay.
 * Header is pinned — never scrolls.
 * Content is its own scroll container — always starts at top on open.
 */

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"

interface PageOverlayProps {
  isOpen: boolean
  onClose: () => void
  accentColor?: string
  label?: string
  children: React.ReactNode
}

export default function PageOverlay({
  isOpen,
  onClose,
  accentColor = "#5b8cff",
  label,
  children,
}: PageOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Escape key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  // Always start at top of content when opened
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%", transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "#04070f",
            display: "flex",
            flexDirection: "column",
            // NO overflow here — only the content div scrolls
          }}
        >
          {/* ── Pinned header — never scrolls ─────────────────────── */}
          <div style={{ flexShrink: 0 }}>
            {/* Accent strip */}
            <div style={{ height: "3px", background: accentColor }} />

            {/* Nav bar */}
            <div style={{
              background: "rgba(4, 7, 15, 0.97)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              padding: "0 clamp(20px, 5vw, 56px)",
              height: "52px",
            }}>
              {/* Back button — 44px+ touch target */}
              <button
                onClick={onClose}
                aria-label="Go back"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "0 16px 0 0",
                  minHeight: "44px",
                  minWidth: "44px",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 8H2M7 3L2 8l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Back</span>
              </button>

              {/* Category label */}
              {label && (
                <span style={{
                  marginLeft: "auto",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.2em",
                  color: accentColor,
                  textTransform: "uppercase",
                  opacity: 0.7,
                }}>
                  {label}
                </span>
              )}

              {/* Esc hint — desktop only */}
              <span
                className="esc-hint"
                style={{
                  marginLeft: label ? "1rem" : "auto",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "0.52rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.14)",
                  whiteSpace: "nowrap",
                }}
              >
                esc to close
              </span>
            </div>
          </div>

          {/* ── Scrollable content — always starts at top ──────────── */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {children}

            {/* iOS home indicator clearance */}
            <div style={{ height: "env(safe-area-inset-bottom, 24px)" }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
