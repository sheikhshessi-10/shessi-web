"use client"

/**
 * High-end procedural astronaut — NASA EVA suit proportions.
 * Massive helmet, bulky padded torso, gold reflective visor,
 * electric-blue accent LEDs. Drifts weightlessly, rotates on scroll.
 */

import { useRef, MutableRefObject } from "react"
import { useFrame } from "@react-three/fiber"
import { MeshTransmissionMaterial } from "@react-three/drei"
import * as THREE from "three"

interface AstronautProps {
  scrollRef: MutableRefObject<{ t: number }>
  position?: [number, number, number]
  scale?: number
}

// ── Shared materials ────────────────────────────────────────────────────────
const SUIT = new THREE.MeshStandardMaterial({
  color: "#d8e8f8",
  roughness: 0.65,
  metalness: 0.04,
})
const SUIT_SHADOW = new THREE.MeshStandardMaterial({
  color: "#b0c4d8",
  roughness: 0.7,
  metalness: 0.02,
})
const JOINT = new THREE.MeshStandardMaterial({
  color: "#8aabcc",
  roughness: 0.45,
  metalness: 0.35,
})
const DARK = new THREE.MeshStandardMaterial({
  color: "#0d1a2a",
  roughness: 0.6,
  metalness: 0.25,
})
const METAL = new THREE.MeshStandardMaterial({
  color: "#7a9bb8",
  roughness: 0.15,
  metalness: 0.95,
})
const GOLD = new THREE.MeshStandardMaterial({
  color: "#d4a830",
  roughness: 0.05,
  metalness: 1.0,
  envMapIntensity: 2.5,
})
const LED_BLUE = new THREE.MeshStandardMaterial({
  color: "#0066ff",
  emissive: "#0055ff",
  emissiveIntensity: 2.5,
  roughness: 0.1,
  metalness: 0.3,
})
const LED_CYAN = new THREE.MeshStandardMaterial({
  color: "#00ccff",
  emissive: "#00aaff",
  emissiveIntensity: 1.8,
  roughness: 0.1,
  metalness: 0.3,
})
const PATCH = new THREE.MeshStandardMaterial({
  color: "#1a3a6a",
  roughness: 0.5,
  metalness: 0.1,
})

export default function Astronaut({
  scrollRef,
  position = [3.2, 0, -0.5],
  scale = 1,
}: AstronautProps) {
  const rootRef = useRef<THREE.Group>(null)
  const driftRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!rootRef.current || !driftRef.current) return
    const t = scrollRef.current.t
    const time = state.clock.elapsedTime

    // ── Weightless multi-axis drift ──────────────────────────────────────────
    // Three different sinusoids — never the same path twice
    driftRef.current.position.y  = Math.sin(time * 0.38)  * 0.18
    driftRef.current.position.x  = Math.cos(time * 0.22)  * 0.09
    driftRef.current.rotation.z  = Math.sin(time * 0.28)  * 0.055
    driftRef.current.rotation.x  = Math.cos(time * 0.18)  * 0.04

    // ── Scroll-driven slow tumble ────────────────────────────────────────────
    // Rotates ~110° over full scroll, as if slowly spinning in zero-G
    const targetRotY = t * Math.PI * 0.6
    rootRef.current.rotation.y = THREE.MathUtils.lerp(
      rootRef.current.rotation.y, targetRotY, 0.022
    )

    // Slight scroll-driven position drift
    rootRef.current.position.y = THREE.MathUtils.lerp(
      rootRef.current.position.y, -t * 1.0, 0.025
    )
    rootRef.current.position.z = THREE.MathUtils.lerp(
      rootRef.current.position.z, -t * 1.2, 0.025
    )
  })

  return (
    <group ref={rootRef} position={position} scale={scale}>
      <group ref={driftRef}>

        {/* ── HELMET ─────────────────────────────────────────────────────── */}
        {/* Outer shell — large sphere, key to NASA proportion */}
        <mesh position={[0, 1.72, 0]} material={SUIT} castShadow>
          <sphereGeometry args={[0.46, 40, 40]} />
        </mesh>

        {/* Helmet equatorial ring — hardware band */}
        <mesh position={[0, 1.72, 0]} material={JOINT}>
          <torusGeometry args={[0.46, 0.035, 16, 60]} />
        </mesh>

        {/* Visor housing — dark oval cavity on front */}
        <mesh position={[0, 1.70, 0.3]} rotation={[0.2, 0, 0]} material={DARK}>
          <sphereGeometry args={[0.32, 28, 28, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
        </mesh>

        {/* Gold outer visor — reflective, the iconic NASA look */}
        <mesh position={[0, 1.68, 0.34]} rotation={[0.24, 0, 0]}>
          <sphereGeometry args={[0.28, 28, 28, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
          <meshStandardMaterial
            color="#c8960a"
            roughness={0}
            metalness={1.0}
            envMapIntensity={4}
            emissive="#ff9900"
            emissiveIntensity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Glass visor inner layer — slight blue tint, transmission */}
        <mesh position={[0, 1.70, 0.25]} rotation={[0.18, 0, 0]}>
          <sphereGeometry args={[0.24, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <MeshTransmissionMaterial
            samples={4}
            thickness={0.04}
            roughness={0}
            transmission={0.88}
            ior={1.45}
            color="#99ccff"
            chromaticAberration={0.015}
            backside={false}
          />
        </mesh>

        {/* Neck disconnect ring */}
        <mesh position={[0, 1.36, 0]} material={JOINT}>
          <cylinderGeometry args={[0.17, 0.19, 0.1, 28]} />
        </mesh>
        <mesh position={[0, 1.31, 0]} material={METAL}>
          <torusGeometry args={[0.19, 0.025, 12, 28]} />
        </mesh>

        {/* ── TORSO ──────────────────────────────────────────────────────── */}
        {/* Main torso — wide, puffy EVA suit */}
        <mesh position={[0, 0.78, 0]} material={SUIT} castShadow>
          <capsuleGeometry args={[0.33, 0.52, 10, 28]} />
        </mesh>

        {/* Torso width pads — the quilted EVA look */}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.28, 0.82, 0.08]} material={SUIT_SHADOW}>
            <capsuleGeometry args={[0.13, 0.38, 6, 16]} />
          </mesh>
        ))}

        {/* Chest control unit (PLSS display) */}
        <mesh position={[0, 0.88, 0.34]} material={DARK}>
          <boxGeometry args={[0.32, 0.26, 0.06]} />
        </mesh>
        {/* Display grid LEDs */}
        {[[-0.09, 0.95], [0, 0.95], [0.09, 0.95],
          [-0.09, 0.86], [0, 0.86], [0.09, 0.86]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.38]} material={i % 3 === 0 ? LED_BLUE : LED_CYAN}>
            <boxGeometry args={[0.028, 0.028, 0.02]} />
          </mesh>
        ))}
        {/* Chest screen glow strip */}
        <mesh position={[0, 0.78, 0.38]} material={LED_BLUE}>
          <boxGeometry args={[0.22, 0.03, 0.02]} />
        </mesh>

        {/* Flag / mission patch on left arm */}
        <mesh position={[-0.34, 1.02, 0.2]} rotation={[0.1, 0.3, 0.15]} material={PATCH}>
          <boxGeometry args={[0.16, 0.1, 0.03]} />
        </mesh>

        {/* Shoulder connection hardware */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.36, 1.1, 0]}>
            <mesh material={JOINT}>
              <sphereGeometry args={[0.12, 16, 16]} />
            </mesh>
            <mesh position={[0, -0.04, 0]} material={METAL}>
              <torusGeometry args={[0.12, 0.02, 10, 20]} />
            </mesh>
          </group>
        ))}

        {/* ── BACKPACK (PLSS) ─────────────────────────────────────────── */}
        <mesh position={[0, 0.78, -0.38]} material={DARK} castShadow>
          <boxGeometry args={[0.44, 0.56, 0.16]} />
        </mesh>
        {/* PLSS ridges */}
        {[0.06, 0, -0.06].map((y, i) => (
          <mesh key={i} position={[0, 0.78 + y * 3, -0.47]} material={METAL}>
            <boxGeometry args={[0.42, 0.025, 0.06]} />
          </mesh>
        ))}
        {/* PLSS LED strip */}
        <mesh position={[0.15, 0.78, -0.46]} material={LED_BLUE}>
          <boxGeometry args={[0.03, 0.32, 0.03]} />
        </mesh>
        {/* Oxygen connectors */}
        {[-0.12, 0.12].map((x, i) => (
          <mesh key={i} position={[x, 1.0, -0.42]} material={METAL}>
            <cylinderGeometry args={[0.025, 0.025, 0.1, 10]} />
          </mesh>
        ))}

        {/* ── ARMS ────────────────────────────────────────────────────── */}
        {([
          { side: -1, shoulderRot: [0.15, 0, 0.55] as [number,number,number], elbowBend: -0.55 },
          { side:  1, shoulderRot: [-0.1, 0, -0.52] as [number,number,number], elbowBend: -0.45 },
        ]).map(({ side, shoulderRot, elbowBend }, i) => (
          <group key={i} position={[side * 0.46, 1.02, 0]} rotation={shoulderRot}>
            {/* Upper arm */}
            <mesh position={[0, -0.25, 0]} material={SUIT}>
              <capsuleGeometry args={[0.115, 0.34, 6, 18]} />
            </mesh>
            {/* Upper arm pad */}
            <mesh position={[0, -0.22, side * 0.09]} material={SUIT_SHADOW}>
              <capsuleGeometry args={[0.08, 0.2, 4, 12]} />
            </mesh>
            {/* Elbow joint */}
            <mesh position={[0, -0.48, 0]} material={JOINT}>
              <sphereGeometry args={[0.11, 16, 16]} />
            </mesh>
            {/* Forearm — bent toward front */}
            <group position={[0, -0.52, 0]} rotation={[elbowBend, 0, 0]}>
              <mesh position={[0, -0.2, 0]} material={SUIT}>
                <capsuleGeometry args={[0.1, 0.3, 6, 16]} />
              </mesh>
              {/* Wrist ring */}
              <mesh position={[0, -0.38, 0]} material={JOINT}>
                <torusGeometry args={[0.1, 0.025, 10, 20]} />
              </mesh>
              {/* Glove — thick puffy EVA glove */}
              <mesh position={[0, -0.5, 0]} material={DARK}>
                <sphereGeometry args={[0.12, 18, 18]} />
              </mesh>
              {/* Glove fingers suggested */}
              {[-0.04, 0, 0.04].map((ox, fi) => (
                <mesh key={fi} position={[ox, -0.6, 0.04]} material={DARK}>
                  <capsuleGeometry args={[0.025, 0.07, 4, 8]} />
                </mesh>
              ))}
              {/* Wrist LED */}
              <mesh position={[0.1, -0.42, 0]} material={LED_BLUE}>
                <sphereGeometry args={[0.02, 8, 8]} />
              </mesh>
            </group>
          </group>
        ))}

        {/* ── WAIST RING ──────────────────────────────────────────────── */}
        <mesh position={[0, 0.48, 0]} material={JOINT}>
          <cylinderGeometry args={[0.26, 0.3, 0.1, 28]} />
        </mesh>
        <mesh position={[0, 0.43, 0]} material={METAL}>
          <torusGeometry args={[0.28, 0.022, 12, 28]} />
        </mesh>

        {/* ── LEGS ────────────────────────────────────────────────────── */}
        {([
          { side: -1, rx: 0.08, rz:  0.1 },
          { side:  1, rx: -0.06, rz: -0.08 },
        ]).map(({ side, rx, rz }, i) => (
          <group key={i} position={[side * 0.18, 0.28, 0]} rotation={[rx, 0, rz]}>
            {/* Upper leg */}
            <mesh position={[0, -0.26, 0]} material={SUIT}>
              <capsuleGeometry args={[0.135, 0.36, 8, 20]} />
            </mesh>
            {/* Thigh pad */}
            <mesh position={[side * 0.06, -0.22, 0.08]} material={SUIT_SHADOW}>
              <capsuleGeometry args={[0.07, 0.18, 4, 10]} />
            </mesh>
            {/* Knee joint */}
            <mesh position={[0, -0.5, 0]} material={JOINT}>
              <sphereGeometry args={[0.13, 16, 16]} />
            </mesh>
            {/* Lower leg */}
            <group position={[0, -0.56, 0]} rotation={[0.1, 0, 0]}>
              <mesh position={[0, -0.24, 0]} material={SUIT}>
                <capsuleGeometry args={[0.12, 0.34, 8, 18]} />
              </mesh>
              {/* Ankle ring */}
              <mesh position={[0, -0.44, 0]} material={JOINT}>
                <torusGeometry args={[0.115, 0.025, 10, 22]} />
              </mesh>
              {/* Boot */}
              <mesh position={[0.02, -0.58, 0.06]} material={DARK}>
                <boxGeometry args={[0.22, 0.14, 0.3]} />
              </mesh>
              {/* Boot sole */}
              <mesh position={[0.02, -0.66, 0.06]} material={METAL}>
                <boxGeometry args={[0.24, 0.04, 0.32]} />
              </mesh>
              {/* Boot tread lines */}
              {[-0.08, 0, 0.08].map((bz, bi) => (
                <mesh key={bi} position={[0.02, -0.69, bz]} material={DARK}>
                  <boxGeometry args={[0.22, 0.015, 0.04]} />
                </mesh>
              ))}
            </group>
          </group>
        ))}

        {/* ── TETHER CABLE — spacewalk detail ─────────────────────────── */}
        <mesh
          position={[-0.35, 0.72, 0.2]}
          rotation={[0.3, 0.1, 0.9]}
          material={METAL}
        >
          <cylinderGeometry args={[0.007, 0.007, 0.7, 6]} />
        </mesh>
        <mesh position={[-0.66, 0.55, 0.38]} material={METAL}>
          <sphereGeometry args={[0.025, 8, 8]} />
        </mesh>

        {/* ── SELF-ILLUMINATION lights ─────────────────────────────────── */}
        {/* Blue under-glow */}
        <pointLight position={[0, -1.6, 0.4]} intensity={12} color="#0055ff" distance={4} decay={2} />
        {/* Warm front key */}
        <pointLight position={[-0.6, 1.4, 1.2]} intensity={8}  color="#99ccff" distance={5} decay={2} />
        {/* Purple rim from right */}
        <pointLight position={[1.0, 0.6, -0.4]} intensity={6}  color="#a78bfa" distance={4} decay={2} />
        {/* Visor gold bounce */}
        <pointLight position={[0, 1.9, 0.8]} intensity={4}  color="#ffcc44" distance={2} decay={2} />

      </group>
    </group>
  )
}
