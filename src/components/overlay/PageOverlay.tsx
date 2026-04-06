"use client"

/**
 * Full-page slide-up overlay — feels like a real page push.
 * The 3D scene stays frozen underneath (position: fixed preserves scroll state).
 * Slides up on open, slides down on close. Back button always sticky.
 */

import { useEffect } from "react"
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
  // Escape key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%", transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "#04070f",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            overflowX: "hidden",
            // scroll within this overlay (not the page behind)
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Accent top strip — always visible */}
          <div style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            flexShrink: 0,
          }}>
            {/* Color strip */}
            <div style={{ height: "3px", background: accentColor }} />

            {/* Nav bar */}
            <div style={{
              background: "rgba(4, 7, 15, 0.94)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              padding: "0 clamp(20px, 5vw, 56px)",
              height: "56px",
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
                  color: "rgba(255,255,255,0.55)",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "0 12px 0 0",
                  minHeight: "44px",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 8H2M7 3L2 8l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Back</span>
              </button>

              {/* Label — center-ish */}
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

              {/* Esc hint — hidden on mobile via .esc-hint CSS class */}
              <span
                className="esc-hint"
                style={{
                  marginLeft: label ? "1.2rem" : "auto",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "0.55rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.16)",
                  whiteSpace: "nowrap",
                }}
              >
                esc to close
              </span>
            </div>
          </div>

          {/* Page content — scrolls inside the overlay */}
          <div style={{ flex: 1 }}>
            {children}
          </div>

          {/* Bottom safe area spacer (iOS home indicator) */}
          <div style={{ height: "env(safe-area-inset-bottom, 24px)", flexShrink: 0 }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
