"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function ParticleField({ count = 1800 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null)

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 18 + Math.random() * 20
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      velocities[i * 3] = (Math.random() - 0.5) * 0.003
      velocities[i * 3 + 1] = -Math.random() * 0.002
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003
    }
    return { positions, velocities }
  }, [count])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3))
    return g
  }, [positions])

  useFrame(() => {
    if (!meshRef.current) return
    const pos = meshRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3]
      arr[i * 3 + 1] += velocities[i * 3 + 1]
      arr[i * 3 + 2] += velocities[i * 3 + 2]
      // Reset if too far from center
      const x = arr[i * 3], y = arr[i * 3 + 1], z = arr[i * 3 + 2]
      const dist = Math.sqrt(x * x + y * y + z * z)
      if (dist > 40) {
        arr[i * 3] *= 0.5
        arr[i * 3 + 1] = 18 + Math.random() * 10
        arr[i * 3 + 2] *= 0.5
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={meshRef} geometry={geo}>
      <pointsMaterial
        size={0.04}
        color="#5b8cff"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
