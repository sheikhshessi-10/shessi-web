"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const COUNT = 180

export default function AsteroidField() {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const { positions, rotationSpeeds, scales } = useMemo(() => {
    const positions: THREE.Vector3[] = []
    const rotationSpeeds: number[] = []
    const scales: number[] = []

    for (let i = 0; i < COUNT; i++) {
      // Scatter in a torus-like band around the scene
      const angle = Math.random() * Math.PI * 2
      const radius = 14 + Math.random() * 10
      positions.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 6,
        Math.sin(angle) * radius - 20
      ))
      rotationSpeeds.push((Math.random() - 0.5) * 0.8)
      scales.push(0.04 + Math.random() * 0.18)
    }
    return { positions, rotationSpeeds, scales }
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    for (let i = 0; i < COUNT; i++) {
      const speed = rotationSpeeds[i]
      const pos = positions[i]

      dummy.position.set(
        pos.x + Math.sin(t * 0.05 + i) * 0.5,
        pos.y + Math.cos(t * 0.03 + i * 0.5) * 0.3,
        pos.z
      )
      dummy.rotation.x = t * speed * 0.5
      dummy.rotation.y = t * speed
      dummy.scale.setScalar(scales[i])
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#1a2340"
        roughness={1}
        metalness={0}
        emissive="#0a1020"
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  )
}
