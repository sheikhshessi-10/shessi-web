"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

interface PlanetProps {
  position?: [number, number, number]
}

export default function Planet({ position = [0, 0, 0] }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.06
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.05
    }
    if (glowRef.current) {
      glowRef.current.rotation.y += delta * 0.03
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.02
    }
  })

  // Procedural ring geometry
  const ringGeometry = useMemo(() => {
    const geo = new THREE.RingGeometry(2.6, 3.8, 128)
    // Warp UVs for texture-like look
    const pos = geo.attributes.position as THREE.BufferAttribute
    const uv = geo.attributes.uv as THREE.BufferAttribute
    for (let i = 0; i < pos.count; i++) {
      uv.setXY(i, pos.getX(i) * 0.5 + 0.5, pos.getY(i) * 0.5 + 0.5)
    }
    return geo
  }, [])

  return (
    <group position={position}>
      {/* Main planet body */}
      <Sphere ref={meshRef} args={[2, 128, 128]}>
        <MeshDistortMaterial
          color="#0d1f4a"
          emissive="#1a3080"
          emissiveIntensity={0.15}
          roughness={0.85}
          metalness={0.1}
          distort={0.12}
          speed={0.8}
        />
      </Sphere>

      {/* Atmosphere glow — outer shell */}
      <Sphere ref={glowRef} args={[2.18, 64, 64]}>
        <meshStandardMaterial
          color="#4facfe"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>

      {/* Second atmosphere layer */}
      <Sphere args={[2.35, 64, 64]}>
        <meshStandardMaterial
          color="#6ab4ff"
          transparent
          opacity={0.018}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>

      {/* Planetary ring */}
      <mesh ref={ringRef} geometry={ringGeometry} rotation={[1.2, 0.1, 0.4]}>
        <meshStandardMaterial
          color="#4facfe"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Ring inner glow */}
      <mesh geometry={ringGeometry} rotation={[1.2, 0.1, 0.4]}>
        <meshStandardMaterial
          color="#a78bfa"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
