"use client"

import { useRef, useMemo, MutableRefObject } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, MeshTransmissionMaterial } from "@react-three/drei"
import * as THREE from "three"

interface HeroCrystalProps {
  scrollRef: MutableRefObject<{ t: number }>
}

export default function HeroCrystal({ scrollRef }: HeroCrystalProps) {
  const wireRef = useRef<THREE.LineSegments>(null)
  const groupRef = useRef<THREE.Group>(null)

  const edgesGeo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2.1, 1)
    return new THREE.EdgesGeometry(geo)
  }, [])

  useFrame((state) => {
    const t = scrollRef.current.t
    if (!wireRef.current || !groupRef.current) return

    // Slow rotation on wireframe cage
    wireRef.current.rotation.y = state.clock.elapsedTime * 0.08
    wireRef.current.rotation.x = state.clock.elapsedTime * 0.04

    // Shatter: scale down between t=0.45 and t=0.65
    const shatterT = Math.max(0, Math.min(1, (t - 0.45) / 0.2))
    const targetScale = 1 - shatterT * 0.92
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.06)
    )
  })

  return (
    <Float speed={0.6} rotationIntensity={0.3} floatIntensity={0.4}>
      <group ref={groupRef}>
        {/* Glassy crystal core */}
        <mesh>
          <icosahedronGeometry args={[1.8, 4]} />
          <MeshTransmissionMaterial
            backside
            samples={6}
            thickness={0.5}
            roughness={0.05}
            transmission={0.98}
            ior={1.5}
            chromaticAberration={0.06}
            color="#a8c8ff"
            distortionScale={0.15}
            temporalDistortion={0.05}
          />
        </mesh>

        {/* Low-poly outer shell — subtle fill */}
        <mesh>
          <icosahedronGeometry args={[2.0, 1]} />
          <meshStandardMaterial
            color="#3b6fff"
            transparent
            opacity={0.06}
            side={THREE.FrontSide}
          />
        </mesh>

        {/* Wireframe cage — the igloo.inc signature */}
        <lineSegments ref={wireRef} geometry={edgesGeo}>
          <lineBasicMaterial color="#0057ff" transparent opacity={0.7} />
        </lineSegments>

        {/* Inner glow */}
        <mesh>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshStandardMaterial
            color="#0057ff"
            emissive="#0057ff"
            emissiveIntensity={0.9}
            transparent
            opacity={0.12}
          />
        </mesh>
      </group>
    </Float>
  )
}
