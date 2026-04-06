# Shessi Website — Build Plan

## Current Status
We are cloning igloo.inc as the visual reference, then building Shessi's founder site on top of it.

The old space-theme site has been **wiped**. A new R3F (React Three Fiber) foundation was started but is also being replaced by the igloo.inc clone approach.

---

## What We're Building
A founder personal site for Shessi — cinematic, jaw-dropping, igloo.inc quality.
Reference: https://www.igloo.inc/

---

## NEXT STEP — Do This First When You Come Back

### Prerequisites Already Done
- [x] Installed `@playwright/mcp` globally (`npm install -g @playwright/mcp`)
- [x] Added Playwright MCP to Claude Desktop config (`C:\Users\sheik\AppData\Roaming\Claude\claude_desktop_config.json`)
- [x] Installed `clone-website` skill into `.claude/skills/clone-website/SKILL.md`
- [x] Cloned the skill repo to `D:\Shessi Special\Personal Web\website-cloner-skill\`

### Step 1 — Restart Claude Desktop (REQUIRED)
> Fully quit Claude Desktop (right-click tray icon → Quit), then reopen it.
> This activates the Playwright MCP browser tool added to the config.
> Without this restart, the browser automation won't be available.

### Step 2 — Open this project in Claude Code
Navigate to: `D:\Shessi Special\Personal Web\shessi-web`

### Step 3 — Run the clone skill
Type exactly:
```
/clone-website https://www.igloo.inc/
```

The skill will automatically:
1. Open igloo.inc in a headless Playwright browser
2. Take full-page screenshots at 1440px (desktop) and 390px (mobile)
3. Extract every CSS value, font, color, spacing, animation
4. Map all page sections and their interaction models (scroll-driven vs click-driven)
5. Write spec files to `docs/research/components/`
6. Dispatch parallel builder agents to reconstruct each section
7. Run a visual QA diff against the original

### Step 4 — After clone completes
Customize the igloo.inc clone for Shessi:
- Swap their content for Shessi's (name, tagline, projects, contact)
- Keep the visual DNA, motion, and effects exactly
- Update color palette if needed to give it Shessi's identity

---

## Tech Stack
- Next.js 16 (App Router, TypeScript strict)
- React Three Fiber (`@react-three/fiber`, `@react-three/drei`)
- `@react-three/postprocessing` (chromatic aberration, bloom, noise, vignette)
- `motion/react` (framer motion)
- Tailwind CSS v4
- Playwright MCP (browser automation for the clone skill)
- Vercel (deployment)

## Key Files
- Skill: `.claude/skills/clone-website/SKILL.md`
- Skill repo (reference): `D:\Shessi Special\Personal Web\website-cloner-skill\`
- Playwright config: `C:\Users\sheik\AppData\Roaming\Claude\claude_desktop_config.json`
- Current src: `D:\Shessi Special\Personal Web\shessi-web\src\`

---

## Design Reference — igloo.inc Key Effects to Capture
- Full-screen 3D scene IS the page (WebGL canvas)
- Scroll drives camera movement through the scene
- Chromatic aberration intensifies on scroll
- Particle systems — ambient + interactive
- Film grain / noise overlay
- Shader-driven text effects
- Cinematic dark palette (muted blue-grey)
- Custom cursor with trailing glow
- No visible nav — pure immersive scroll experience
