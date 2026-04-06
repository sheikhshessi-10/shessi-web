"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "motion/react"
import PageOverlay from "../PageOverlay"

const ARTICLES = [
  {
    id: "art-01",
    date: "2025",
    tag: "Intelligence",
    title: "Age of Agent Intelligence",
    summary:
      "Intelligence creating intelligence. The new leverage isn't land, labor, or capital — it's agents in place of labor and compute in place of capital.",
    body: `People think of ChatGPT and Claude as this magical box that gives you answers. And it is. But something far more fundamental has happened in the last two years. We now have agents that perform tasks on our behalf. And then we have those agents hiring other agents. When you prompt an agent to create a sub-agent that does XYZ — that agent comes into existence on demand. Intelligence creating intelligence.

Here's why that matters more than people realize.

For centuries there were only three forms of leverage: land, labor, and capital. That was it. Every business, every industry, every empire was built on some combination of those three.

That's changing right now.

The new leverage is agents in place of labor and compute in place of capital. The computer is becoming the new capital. Agents are becoming the new labor. And unlike human labor — agents don't sleep, don't quit, don't need HR.

This fundamental shift is swallowing the service industry whole. Any white collar task — writing, research, customer service, sales, operations, analysis — these agents can replicate it. We have officially conquered white collar work.

And what comes next is even more profound.

That's the next article.`,
    accentColor: "#ff4f1f",
  },
  {
    id: "art-02",
    date: "2025",
    tag: "The Physical Revolution",
    title: "Robots Creating Robots",
    summary:
      "What's happening in the digital world right now is just a simulation of what's coming in the physical world.",
    body: `We're watching agents replace white collar work in real time. Every service, every task, every knowledge worker function — being eaten by software. That's the digital revolution. But soon that same revolution hits the physical world. Robots replacing tangible production. Factories. Kitchens. Construction. Everything.

And here's where it gets truly mind-bending.

When you have one robot that can create other robots, the only real bottleneck left is energy. Not labor. Not capital. Energy. When we solve that — and we will — labor becomes essentially free. And labor is one of the biggest constraints on human civilization right now.

We as humans have this fundamental inability to think in exponentials. We think linearly. Two robots make twice the output. But that's not how this works. A robot that creates robots that create robots — that's not linear. That's a number you can't write on a whiteboard without running out of space.

So what does that world actually look like? Kitchens run by robots. Factories with no workers. Every physical product made without a single human hand. That's a world nobody has truly imagined yet.

And yes — that displaces people. The restaurant worker, the factory hand, the warehouse crew. They look at that future and say "what's my purpose?"

But here's what I'd ask them. Was working for someone else actually your purpose? Or was that just what kept you busy and distracted from what your purpose could have been?

Robots retiring humans from physical labor doesn't make us obsolete. It frees us. It gives us the leverage to explore. To go into space. To make our species multiplanetary. To finally explore the ocean — which we've barely touched. To pursue curiosity without the constraint of survival.

That's the idealistic version. And yes, the dystopian version exists too — a small group controlling the robots, controlling the resources, controlling the competition. We won't pretend that risk isn't real.

But the true existential moment — the one that actually changes everything — is when we achieve general intelligence. An AI that can out-think us. That can create mathematical proofs we couldn't conceive. That makes scientific discoveries on its own.

When that happens, humanity as a species faces a question nobody has a clean answer to.

People keep saying AI isn't conscious. But if it achieves all of those benchmarks — scientific discovery, mathematical reasoning, independent thought — what does consciousness even mean anymore?

That's not a rhetorical question. I genuinely don't know.`,
    accentColor: "#5b8cff",
  },
  {
    id: "art-03",
    date: "2025",
    tag: "Geopolitics",
    title: "The Big Blue Button: Why Kessler Syndrome Isn't Just an Accident",
    summary:
      "Everyone talks about Kessler Syndrome like it's a slow natural disaster. That framing misses the real threat. The real threat is a nation that chooses to push the button.",
    body: `Everyone talks about Kessler Syndrome like it's a slow natural disaster. Space gets crowded, two satellites collide, debris multiplies, chain reaction, game over. A self-ticking bomb we just need to be careful around.

That framing misses the real threat.

The real threat is a nation that chooses to push the button.

Here's the logic. You're a smaller country. You're getting decimated by a technologically superior military. AI drones. Precision missiles. Robot armies. All of it guided by satellites orbiting above you. You can't win a conventional fight against that.

So what do you do when you have nothing left to lose?

You don't need a sophisticated space program. You need cheap rockets and something large enough to detonate in low Earth orbit. And before anyone says "we'd detect it and shoot it down" — yes, probably. If you fire one.

Fire fifteen simultaneously from dispersed locations and the math changes completely. Missile defense is built to intercept a small number of high value threats. It is not built for a saturation volley of cheap dumb rockets aimed at different orbital altitudes. Even if you intercept 80% of them — the 20% that get through is enough. One detonation in the right orbital shell seeds debris traveling at 17,000 miles per hour. That debris shreds everything it touches. Which creates more debris. Which shreds more. Cascade.

And detection isn't as fast as people think. Current space situational awareness has real latency. By the time a launch is detected, trajectory confirmed as orbital, threat assessed, and intercept authorized — the rocket is already there. You're talking minutes of technical and bureaucratic delay against an 8 to 10 minute ballistic window. That gap is exploitable.

Suddenly the most advanced military on the planet is blind. No GPS. No satellite communications. No surveillance. No coordination. The robot army stops working. The drones lose their eyes. Precision missiles become dumb missiles.

And the obvious counterargument — you'd be destroying your own satellites too. Sure. But a regime that is days from collapse has no satellites worth protecting. Their military is already losing. Their communications are already gone. They have nothing left to lose in orbit because they've already lost everything on the ground.

This is the asymmetric reset nobody is building defense strategy around. We are concentrating our most critical infrastructure — banking, military, communications, AI compute — into a single orbital layer that any sufficiently desperate nation can attack with cheap rockets and basic math.

It's not a sophisticated attack. It's a suicide vest worn by a regime with nothing left to lose.

The scary part isn't the technology required. It's how low the bar is. You don't need to win. You just need to burn it down so nobody else can win either.

We're building the most advanced civilization in human history on an infrastructure layer that one desperate actor can collapse in an afternoon.

That's the Kessler problem nobody is talking about.`,
    accentColor: "#22c55e",
  },
]

function ArticleCard({ article, index, inView }: {
  article: typeof ARTICLES[0]
  index: number
  inView: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.15 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setOpen(true)}
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
          padding: "clamp(1.4rem, 3vw, 2rem) clamp(1.2rem, 3vw, 2.2rem)",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          touchAction: "manipulation",
        }}
        whileHover={{ borderColor: `${article.accentColor}30`, background: "rgba(255,255,255,0.04)" }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Accent top */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "2px", background: article.accentColor,
        }} />

        {/* Meta row */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.2rem" }}>
          <span style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "0.58rem",
            letterSpacing: "0.18em",
            color: article.accentColor,
            textTransform: "uppercase",
            opacity: 0.8,
          }}>
            {article.tag}
          </span>
          <span style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "0.58rem",
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.2)",
          }}>
            {article.date}
          </span>
        </div>

        <h3 style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: "clamp(1rem, 3vw, 1.4rem)",
          fontWeight: 700,
          letterSpacing: "-0.025em",
          color: "#ffffff",
          margin: "0 0 0.8rem 0",
          lineHeight: 1.2,
        }}>
          {article.title}
        </h3>

        <p style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: "clamp(0.85rem, 2vw, 0.9rem)",
          color: "rgba(255,255,255,0.35)",
          margin: "0 0 1.5rem 0",
          lineHeight: 1.6,
        }}>
          {article.summary}
        </p>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontFamily: "var(--font-geist-mono)",
          fontSize: "0.6rem",
          letterSpacing: "0.15em",
          color: article.accentColor,
          textTransform: "uppercase",
          opacity: 0.8,
        }}>
          <span>Read</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 6h10M6 1l5 5-5 5" stroke={article.accentColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.div>

      {/* Full-page article reader */}
      <PageOverlay
        isOpen={open}
        onClose={() => setOpen(false)}
        accentColor={article.accentColor}
        label={article.tag}
      >
        <div style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "clamp(40px, 6vw, 72px) clamp(20px, 5vw, 48px)",
          width: "100%",
        }}>
          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
            <span style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: article.accentColor,
              textTransform: "uppercase",
              opacity: 0.85,
            }}>
              {article.tag}
            </span>
            <span style={{ width: "1px", height: "12px", background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />
            <span style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.22)",
            }}>
              {article.date}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "clamp(1.9rem, 6vw, 3.2rem)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            color: "#ffffff",
            margin: "0 0 1.2rem 0",
            lineHeight: 1.05,
          }}>
            {article.title}
          </h1>

          {/* Summary / lede */}
          <p style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
            color: "rgba(255,255,255,0.42)",
            margin: "0 0 2.5rem 0",
            lineHeight: 1.65,
            fontStyle: "italic",
          }}>
            {article.summary}
          </p>

          {/* Divider */}
          <div style={{
            width: "36px", height: "1px",
            background: `${article.accentColor}55`,
            marginBottom: "2.5rem",
          }} />

          {/* Body — each paragraph */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
            {article.body.split("\n\n").map((para, i) => (
              <p key={i} style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: "clamp(1rem, 2vw, 1.08rem)",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.9,
                margin: 0,
              }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </PageOverlay>
    </>
  )
}

export default function WritingSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })

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
      {/* Header */}
      <div style={{ maxWidth: "720px", marginBottom: "4rem" }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            color: "#22c55e",
            textTransform: "uppercase",
            margin: "0 0 2.5rem 0",
            opacity: 0.75,
          }}
        >
          ◈ Writing
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
            I used to write.
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
            Now I talk and AI writes for me.
          </motion.h2>
        </div>
      </div>

      {/* Article cards — centered grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "1.5rem",
        maxWidth: "1100px",
        pointerEvents: "all",
      }}>
        {ARTICLES.map((article, i) => (
          <ArticleCard key={article.id} article={article} index={i} inView={inView} />
        ))}
      </div>
    </section>
  )
}
