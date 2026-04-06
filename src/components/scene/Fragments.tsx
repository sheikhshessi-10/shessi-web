"use client"

import { useRef, useMemo, MutableRefObject } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface FragmentsProps {
  scrollRef: MutableRefObject<{ t: number }>
}

const FRAGMENT_COUNT = 24
const GEO_MAP: Record<string, THREE.BufferGeometry> = {}

function getSharedGeo(type: string): THREE.BufferGeometry {
  if (!GEO_MAP[type]) {
    switch (type) {
      case "octa":  GEO_MAP[type] = new THREE.OctahedronGeometry(1, 0); break
      case "tetra": GEO_MAP[type] = new THREE.TetrahedronGeometry(1, 0); break
      case "ico":   GEO_MAP[type] = new THREE.IcosahedronGeometry(1, 0); break
      default:      GEO_MAP[type] = new THREE.BoxGeometry(1, 1, 1)
    }
  }
  return GEO_MAP[type]
}

export default function Fragments({ scrollRef }: FragmentsProps) {
  const fragmentRefs = useRef<(THREE.Mesh | null)[]>([])

  const fragments = useMemo(() => {
    const types = ["octa", "tetra", "ico", "box"]
    return Array.from({ length: FRAGMENT_COUNT }, (_, i) => {
      const angle = (i / FRAGMENT_COUNT) * Math.PI * 2
      const radius = 2.6 + (i % 3) * 0.6
      const geoType = types[i % types.length]
      const scale = 0.06 + (i % 5) * 0.04
      const speed = 0.3 + (i % 7) * 0.08
      const phaseOffset = i * 0.42

      const homeX = Math.cos(angle) * radius
      const homeY = Math.sin(i * 1.7) * 1.2
      const homeZ = Math.sin(angle) * radius

      const scatter = 7 + (i % 4) * 2
      const shatterX = Math.cos(angle + 0.5) * scatter
      const shatterY = (((i % 5) - 2) / 2) * 8
      const shatterZ = Math.sin(angle + 0.5) * scatter

      const col = i % 6
      const row = Math.floor(i / 6)
      const projectX = (col - 2.5) * 2.2
      const projectY = (row - 2) * 1.6
      const projectZ = -4

      const colors = ["#0057ff", "#a78bfa", "#5b8cff", "#6ab4ff"]
      const color = colors[i % colors.length]

      return {
        homeX, homeY, homeZ,
        shatterX, shatterY, shatterZ,
        projectX, projectY, projectZ,
        geoType, scale, speed, phaseOffset, color,
        isWire: i % 6 === 0,
      }
    })
  }, [])

  useFrame((state) => {
    const t = scrollRef.current.t

    const shatterT = Math.max(0, Math.min(1, (t - 0.42) / 0.22))
    const projectT = Math.max(0, Math.min(1, (t - 0.64) / 0.18))

    fragments.forEach((frag, i) => {
      const mesh = fragmentRefs.current[i]
      if (!mesh) return

      const bob = Math.sin(state.clock.elapsedTime * frag.speed + frag.phaseOffset) * 0.08

      let x: number, y: number, z: number

      if (projectT > 0) {
        x = THREE.MathUtils.lerp(frag.shatterX, frag.projectX, projectT)
        y = THREE.MathUtils.lerp(frag.shatterY, frag.projectY, projectT) + bob * (1 - projectT)
        z = THREE.MathUtils.lerp(frag.shatterZ, frag.projectZ, projectT)
      } else if (shatterT > 0) {
        x = THREE.MathUtils.lerp(frag.homeX, frag.shatterX, shatterT)
        y = THREE.MathUtils.lerp(frag.homeY, frag.shatterY, shatterT) + bob
        z = THREE.MathUtils.lerp(frag.homeZ, frag.shatterZ, shatterT)
      } else {
        // Orbit gently around crystal before shatter
        const angle = (i / FRAGMENT_COUNT) * Math.PI * 2 + state.clock.elapsedTime * 0.1
        const r = 2.6 + Math.sin(state.clock.elapsedTime * frag.speed * 0.4) * 0.25
        x = Math.cos(angle) * r
        y = frag.homeY + bob
        z = Math.sin(angle) * r
      }

      mesh.position.set(x, y, z)
      mesh.rotation.x += 0.008 * frag.speed
      mesh.rotation.y += 0.012 * frag.speed

      // Opacity: invisible until shatter starts
      const mat = mesh.material as THREE.MeshStandardMaterial
      const targetOpacity = Math.min(1, shatterT * 4)
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.08)
      mat.visible = mat.opacity > 0.005
    })
  })

  return (
    <group>
      {fragments.map((frag, i) => (
        <mesh
          key={i}
          ref={(el) => { fragmentRefs.current[i] = el }}
          geometry={getSharedGeo(frag.geoType)}
          scale={frag.scale}
          position={[frag.homeX, frag.homeY, frag.homeZ]}
        >
          <meshStandardMaterial
            color={frag.color}
            emissive={frag.color}
            emissiveIntensity={0.25}
            roughness={0.3}
            metalness={0.6}
            transparent
            opacity={0}
            wireframe={frag.isWire}
          />
        </mesh>
      ))}
    </group>
  )
}
