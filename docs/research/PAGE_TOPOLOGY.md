# igloo.inc — Page Topology

## Architecture
igloo.inc is a **pure WebGL experience** — there is no traditional HTML/CSS page structure.
The entire experience is a single `<canvas>` rendered by a custom Three.js scene.
No React, no DOM components, no CSS layout.

## Scenes (scroll-driven sequence)

| # | Scene Name | Visual Description | Interaction Model |
|---|-----------|-------------------|------------------|
| 1 | **intro** | Aerial bird's-eye view of igloo in arctic landscape. Geometric wireframe overlay on terrain. | scroll-driven, camera pulls back |
| 2 | **igloo** | Camera moves to ground level, close-up of igloo. Photorealistic snow + ice blocks. UI overlays appear top-left and top-right. | scroll-driven camera |
| 3 | **explode** | Igloo disassembles — stone blocks separate and float. Transition animated. | scroll-driven |
| 4 | **cubes** | Separated blocks hover, each showcasing a project (partner logos). | scroll-driven + hover/click |
| 5 | **manifesto** | Blurry text / manifesto section | scroll-driven |
| 6 | **projects** | Project showcase section | click-driven |

## Fixed Overlays (on top of WebGL canvas)
- **Top-left:** `iGLOO` logo in IBM Plex Mono, small metadata text below (UI rendered via WebGL datatextures, NOT HTML)
- **Top-right:** Info panel with stats/text (also WebGL rendered)
- **Sound/Close buttons:** UI elements in top corners

## Z-Index Stack
```
[WebGL Canvas — full viewport]
  └─ Scene objects (3D rendered)
  └─ UI overlays (rendered as WebGL quads/datatextures, NOT HTML)
```

## Global CSS (only 3 lines of real CSS)
```css
html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #A0A5B1; touch-action: none; }
#app { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; }
#webgl { position: absolute; width: 100%; height: 100%; }
```

## Tech Stack (igloo.inc actual)
- Three.js (custom, not R3F)
- GSAP (scene transitions + camera animation)
- Draco geometry compression (.drc files)
- KTX2 / Basis texture compression
- MSDF font rendering (fonts as datatextures)
- Spatial audio (Web Audio API)
- No framework (vanilla JS + Vite bundler)

## Asset Inventory
### 3D Geometry (.drc Draco compressed)
- igloo.drc, igloo_cage.drc, igloo_outline.drc, igloo/patch.drc
- mountain.drc, ground.drc, floor.drc
- pudgy.drc (Pudgy Penguins NFT character)
- abstractlogo.drc, overpass_logo.drc
- smoke_trail.drc, ceilingsmoke.drc
- shattered_ring.drc, shattered_ring2.drc
- intro_particles.drc
- blurrytext.drc, blurrytext_cylinder.drc
- cubes/cube1.drc, cube2.drc, cube3.drc
- cubes/background_shapes.drc

### Textures (KTX2 compressed)
- igloo/igloo_scene.ktx2, igloo_color.ktx2, igloo_exploded_color.ktx2
- igloo/mountain_color.ktx2, ground_color.ktx2, ground_glow.ktx2
- cubes/cube1/2/3_color/roughness/normal.ktx2
- cubes_env.exr (HDR environment map)
- Various noise textures: blue-8-128-rgb.ktx2, perlin, wind_noise, clouds_noise

### Audio
- music-highq.ogg (background music)
- room.ogg, wind.ogg (ambient)
- igloo.ogg, beeps.ogg, click-project.ogg, enter/leave-project.ogg (interactive)
- manifesto.ogg, circles.ogg, particles.ogg, logo.ogg

## Color Palette (extracted from App3D bundle)
```
Background:    #A0A5B1  (grey-blue, the "sky")
Dark text:     #3C3C54
Mid grey:      #67707E
Light grey:    #A1AAB7
Snow white:    #d1d6e3
Fog white:     #e0e8ef
Ice blue:      #b5d5ff
Deep navy:     #09121f / #222b42
Warm gold:     #cda05e / #ab8349 / #886a3d  (project cube accents)
```

## Typography
- **IBM Plex Mono Medium** — rendered as MSDF datatexture (not HTML text)
- **IBM Plex Mono Regular** — same
- All text in the scene is rendered as WebGL quads, not DOM elements
