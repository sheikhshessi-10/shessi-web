"use client"

import HeroSection from "./sections/HeroSection"
import ProblemSection from "./sections/ProblemSection"
import AIRevSection from "./sections/AIRevSection"
import WritingSection from "./sections/WritingSection"
import SideSection from "./sections/SideSection"
import ContactSection from "./sections/ContactSection"

export default function HtmlOverlay() {
  return (
    <div style={{ width: "100vw" }}>
      <HeroSection />
      <ProblemSection />
      <AIRevSection />
      <WritingSection />
      <SideSection />
      <ContactSection />
    </div>
  )
}
