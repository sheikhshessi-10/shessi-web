"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const trailX = useMotionValue(-100)
  const trailY = useMotionValue(-100)

  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 })
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 })
  const trailSpringX = useSpring(trailX, { stiffness: 120, damping: 28 })
  const trailSpringY = useSpring(trailY, { stiffness: 120, damping: 28 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      trailX.set(e.clientX)
      trailY.set(e.clientY)
    }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [cursorX, cursorY, trailX, trailY])

  return (
    <>
      {/* Outer glow trail */}
      <motion.div
        style={{
          x: trailSpringX,
          y: trailSpringY,
          position: "fixed",
          top: 0,
          left: 0,
          width: "40px",
          height: "40px",
          marginLeft: "-20px",
          marginTop: "-20px",
          borderRadius: "50%",
          border: "1px solid rgba(91,140,255,0.3)",
          pointerEvents: "none",
          zIndex: 9998,
          mixBlendMode: "screen",
        }}
      />
      {/* Inner dot */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          marginLeft: "-3px",
          marginTop: "-3px",
          borderRadius: "50%",
          background: "#5b8cff",
          pointerEvents: "none",
          zIndex: 9999,
          boxShadow: "0 0 10px rgba(91,140,255,0.8)",
        }}
      />
    </>
  )
}
