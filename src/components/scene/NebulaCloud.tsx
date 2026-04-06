"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface NebulaCloudProps {
  position?: [number, number, number]
  color?: string
  scale?: number
}

export default function NebulaCloud({ position = [0, 0, 0], color = "#3b4ff0", scale = 8 }: NebulaCloudProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(1, 32, 32)
  }, [])

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.045,
      depthWrite: false,
      side: THREE.BackSide,
    })
  }, [color])

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.01
      meshRef.current.rotation.x += delta * 0.005
      // Breathe
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.03
      meshRef.current.scale.setScalar(scale * breathe)
    }
  })

  return (
    <mesh ref={meshRef} position={position} geometry={geometry} material={material} />
  )
}
