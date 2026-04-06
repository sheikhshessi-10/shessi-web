"use client"

import { useMemo } from "react"
import * as THREE from "three"

// The igloo.inc wireframe grid overlay on the ground
export default function GroundGrid() {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const lines: number[] = []
    const size = 30
    const divisions = 20

    for (let i = 0; i <= divisions; i++) {
      const t = (i / divisions - 0.5) * size
      lines.push(-size / 2, 0, t, size / 2, 0, t)
      lines.push(t, 0, -size / 2, t, 0, size / 2)
    }

    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(lines), 3))
    return g
  }, [])

  return (
    <group position={[0, -5, -5]} rotation={[-0.1, 0, 0]}>
      <lineSegments geometry={geo}>
        <lineBasicMaterial
          color="#0057ff"
          transparent
          opacity={0.08}
          linewidth={1}
        />
      </lineSegments>
    </group>
  )
}
