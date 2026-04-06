"use client"

import { useRef, useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { ScrollControls, Scroll } from "@react-three/drei"
import { EffectComposer, ChromaticAberration, Noise, Vignette, Bloom } from "@react-three/postprocessing"
import { BlendFunction, KernelSize } from "postprocessing"
import { Vector2 } from "three"
import SceneWorld from "./scene/SceneWorld"
import HtmlOverlay from "./overlay/HtmlOverlay"
import CustomCursor from "./ui/CustomCursor"

export default function Experience() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#04070f", position: "fixed", top: 0, left: 0 }}>
      <CustomCursor />

      {ready && (
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 1000 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          style={{ width: "100%", height: "100%" }}
        >
          <ScrollControls pages={10} damping={0.08}>
            <SceneWorld />
            <Scroll html style={{ width: "100%" }}>
              <HtmlOverlay />
            </Scroll>
          </ScrollControls>

          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.6}
              kernelSize={KernelSize.LARGE}
              luminanceThreshold={0.3}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={new Vector2(0.0006, 0.0006)}
              radialModulation={false}
              modulationOffset={0}
            />
            <Noise
              premultiply
              blendFunction={BlendFunction.SOFT_LIGHT}
              opacity={0.1}
            />
            <Vignette
              offset={0.25}
              darkness={0.75}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        </Canvas>
      )}
    </div>
  )
}
