"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "motion/react"

const projects = [
  {
    id: "01",
    name: "Personal OS",
    status: "ACTIVE",
    statusColor: "#22c55e",
    description: "A system for thinking, building, and shipping — faster than anyone expects.",
    tags: ["Systems", "Productivity", "AI"],
  },
  {
    id: "02",
    name: "Design System",
    status: "SHIPPING",
    statusColor: "#5b8cff",
    description: "Visual language that scales across every product without losing soul.",
    tags: ["Design", "Components", "Scale"],
  },
  {
    id: "03",
    name: "AI Workflows",
    status: "EXPLORING",
    statusColor: "#f59e0b",
    description: "Automating the boring parts of founding. Keeping the interesting ones.",
    tags: ["AI", "Automation", "Ops"],
  },
]

function ProjectCard({ project, index, inView }: { project: typeof projects[0], index: number, inView: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.3 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "32px",
        border: `1px solid ${hovered ? "rgba(91,140,255,0.25)" : "rgba(255,255,255,0.06)"}`,
        background: hovered ? "rgba(91,140,255,0.04)" : "rgba(255,255,255,0.015)",
        transition: "all 0.4s ease",
        cursor: "default",
        backdropFilter: "blur(12px)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "0.58rem",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          {project.id}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: project.statusColor,
              boxShadow: `0 0 6px ${project.statusColor}`,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "0.58rem",
              letterSpacing: "0.2em",
              color: project.statusColor,
            }}
          >
            {project.status}
          </span>
        </div>
      </div>

      <div
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
          fontWeight: 700,
          color: "#ffffff",
          marginBottom: "12px",
          letterSpacing: "-0.02em",
        }}
      >
        {project.name}
      </div>

      <div
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: "0.875rem",
          color: "rgba(255,255,255,0.35)",
          lineHeight: 1.6,
          marginBottom: "24px",
        }}
      >
        {project.description}
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {project.tags.map(tag => (
          <span
            key={tag}
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "0.58rem",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.3)",
              padding: "4px 10px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function BuildingSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-15%" })

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
          marginBottom: "16px",
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
          03 — Currently Building
        </span>
      </motion.div>

      <div style={{ overflow: "hidden", marginBottom: "52px" }}>
        <motion.h2
          initial={{ y: "100%", opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            margin: 0,
            lineHeight: 1,
          }}
        >
          In orbit.
        </motion.h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1px",
          maxWidth: "1100px",
        }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} inView={inView} />
        ))}
      </div>
    </section>
  )
}
