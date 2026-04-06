"use client"

import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useScroll } from "@react-three/drei"
import * as THREE from "three"
import HeroCrystal from "./HeroCrystal"
import Fragments from "./Fragments"
import ParticleField from "./ParticleField"

export default function SceneWorld() {
  const scroll = useScroll()
  const { camera } = useThree()
  const scrollRef = useRef({ t: 0 })

  useFrame(() => {
    const t = scroll.offset
    scrollRef.current.t = t

    // Camera stays left-of-center — crystal lives on the right half of screen
    // Left side of screen = free for text content
    const breathe = Math.sin(Date.now() * 0.0008) * 0.04

    let camX: number, camY: number, camZ: number

    if (t < 0.3) {
      const s = t / 0.3
      camX = THREE.MathUtils.lerp(-2.2, -2.0, s)
      camY = THREE.MathUtils.lerp(0.8, 0.2, s)
      camZ = THREE.MathUtils.lerp(9, 8, s)
    } else if (t < 0.6) {
      const s = (t - 0.3) / 0.3
      camX = THREE.MathUtils.lerp(-2.0, -1.8, s)
      camY = THREE.MathUtils.lerp(0.2, -0.2, s)
      camZ = THREE.MathUtils.lerp(8, 10, s)
    } else {
      const s = (t - 0.6) / 0.4
      camX = THREE.MathUtils.lerp(-1.8, -1.5, s)
      camY = THREE.MathUtils.lerp(-0.2, -0.5, s)
      camZ = THREE.MathUtils.lerp(10, 12, s)
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, camX, 0.035)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, camY + breathe, 0.035)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, camZ, 0.035)

    // Look left of the crystal so it lands on the right ~80% of the viewport
    camera.lookAt(-0.5, 0, 0)
  })

  return (
    <>
      <fog attach="fog" args={["#04070f", 16, 70]} />

      <ambientLight intensity={0.1} />
      <directionalLight position={[-6, 8, 6]} intensity={1.8} color="#4488ff" />
      <pointLight position={[8, -2, -4]} intensity={50} color="#a78bfa" />
      <pointLight position={[2, -5, 0]} intensity={20} color="#0057ff" />
      <pointLight position={[2, 8, -6]} intensity={10} color="#6ab4ff" />

      {/* Crystal + fragments live on the RIGHT side of the scene */}
      <group position={[3.5, 0, 0]}>
        <HeroCrystal scrollRef={scrollRef} />
        <Fragments scrollRef={scrollRef} />
      </group>

      <ParticleField count={1200} />
    </>
  )
}
