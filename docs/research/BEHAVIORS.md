# igloo.inc — Behavior Documentation

## Critical Insight
igloo.inc has NO HTML behaviors. All interactions are handled inside the WebGL renderer.
This is NOT a CSS-cloneable site.

## Scroll-Driven Camera Journey
The scroll wheel drives a camera through a 3D scene.

### Sequence
1. **Scroll 0** (intro): Camera high above, bird's-eye view of igloo in snow. Geometric white wireframe overlay covers terrain like a grid/topology map.
2. **Scroll → igloo**: Camera descends and approaches ground level. Igloo fills the frame. Snow landscape visible. Atmospheric fog.
3. **Scroll → explode**: Igloo blocks begin to separate and float. Each block drifts apart.
4. **Scroll → cubes**: Blocks are now floating "project cubes" with textured faces showing partner/project logos (Overpass, Pudgy Penguins, Abstract, etc.)
5. **Scroll → manifesto**: Blurry text section, manifestoaudio plays
6. **Scroll → projects**: Project showcase

### Camera Properties
- Uses GSAP for camera position/rotation tweening between waypoints
- Each scene has a camera position + target defined
- Scroll progress maps linearly to camera progress through the scene graph

## UI Overlay Behaviors
All UI rendered in WebGL as textured quads over the scene.

### Top-Left Panel
- Logo: "iGLOO" in IBM Plex Mono
- Small text below (metadata/tagline)
- Appears to fade in when camera is in igloo scene

### Top-Right Panel
- Stats/info text block
- Numbers or project count
- Same IBM Plex Mono font

### Sound Button
- Top corner, toggles audio on/off

## Hover/Click on Project Cubes
- Hovering a cube: cube highlights, sound plays (click-project.ogg)
- Clicking a cube: camera enters the cube (enter-project.ogg), project detail view

## Visual Effects
- **Atmospheric fog** — heavy, cinematic. The snow landscape fades into grey-blue fog.
- **Caustics** — light patterns on igloo surface (caustics.ktx2 texture)
- **Particle systems** — intro_particles (snow particles in the scene)
- **Smoke trails** — smoke_trail.drc, ceilingsmoke.drc
- **Film grain** — rendered as post-process effect
- **Shattered ring** — animated shattered ring geometry (two pieces, ring + ring2)
- **Wireframe overlay** — white wireframe geometry overlaid on terrain (igloo_cage.drc, igloo_outline.drc)

## Responsive Behavior
- Desktop: Full immersive viewport
- Mobile: `touch-action: none` — custom touch handlers for scroll
- The viewport is always 100vw × 100vh, no scrollbar

## Audio System
- Spatial audio using Web Audio API
- Music plays on page load (or after user interaction)
- Each interaction has a corresponding sound
- Room tone + wind ambient layer continuously
