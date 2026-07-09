"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Radar } from "lucide-react";

const LINKS = [
  { label: "Sources", href: "#sources" },
  { label: "Platform", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Coverage", href: "#market" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line bg-bg/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-b from-primary to-[#e08905] text-[#1a1205]">
            <Radar className="h-[18px] w-[18px]" strokeWidth={2.4} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            BidPro
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted transition-colors hover:text-text"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#demo"
          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-b from-primary to-[#e08905] px-4 py-2 text-sm font-semibold text-[#1a1205] shadow-[0_6px_18px_-8px_rgba(245,158,11,0.7)] transition-all hover:from-primary-bright hover:to-primary active:scale-[0.98]"
        >
          Book a demo
        </a>
      </nav>
    </motion.header>
  );
}
