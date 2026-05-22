"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { ShaderMaterial } from "three";
import { ACCENT_HEX, INK_HEX, prefersReducedMotion } from "../glsl";
import {
  cloudFragmentShader,
  cloudVertexShader,
  sampleGlyph,
} from "../sigmaCloud";
import { mulberry32 } from "./random";

const COUNT = 9000;

function Cloud({ reduced }: { reduced: boolean }) {
  const matRef = useRef<ShaderMaterial>(null);
  const { viewport } = useThree();

  const { aScatter, aGlyph, aSize, aAccent, uniforms } = useMemo(() => {
    const rand = mulberry32(0x51_6d_a1);
    const spanX = 7.4;
    const spanY = 7.4;
    const glyph2d = sampleGlyph(COUNT, spanX, spanY, rand);

    const aScatter = new Float32Array(COUNT * 3);
    const aGlyph = new Float32Array(COUNT * 3);
    const aSize = new Float32Array(COUNT);
    const aAccent = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      // Dispersión: disco gaussiano con profundidad.
      const r = Math.pow(rand(), 0.5) * 5.6;
      const a = rand() * Math.PI * 2;
      aScatter[i * 3] = Math.cos(a) * r;
      aScatter[i * 3 + 1] = Math.sin(a) * r * 0.85;
      aScatter[i * 3 + 2] = (rand() - 0.5) * 5.0;

      // Objetivo: la Σ, con un leve relieve en z.
      aGlyph[i * 3] = glyph2d[i * 2];
      aGlyph[i * 3 + 1] = glyph2d[i * 2 + 1];
      aGlyph[i * 3 + 2] = (rand() - 0.5) * 0.5;

      aSize[i] = 1.0 + rand() * 1.3;
      // Acento puntual: ~7% de los puntos.
      aAccent[i] = rand() < 0.07 ? 1.0 : 0.0;
    }

    const u = {
      uTime: { value: 0 },
      uMorph: { value: reduced ? 1 : 0 },
      uDpr: { value: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uInk: { value: new THREE.Color(INK_HEX) },
      uAccent: { value: new THREE.Color(ACCENT_HEX) },
    };

    return { aScatter, aGlyph, aSize, aAccent, uniforms: u };
  }, [reduced]);

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat || reduced) return;
    const t = state.clock.elapsedTime;
    mat.uniforms.uTime.value = t;
    // Respira entre dispersión (0) y Σ (1) con pausas en cada extremo.
    const wave = Math.sin(t * 0.32 - Math.PI / 2) * 0.5 + 0.5;
    mat.uniforms.uMorph.value = THREE.MathUtils.smootherstep(wave, 0.12, 0.88);
    mat.uniforms.uPointer.value.set(
      (state.pointer.x * viewport.width) / 2,
      (state.pointer.y * viewport.height) / 2,
    );
  });

  return (
    <points>
      <bufferGeometry>
        {/* `position` reutiliza el array de dispersión: solo fija el conteo;
            el shader recalcula la posición real desde aScatter/aGlyph. */}
        <bufferAttribute attach="attributes-position" args={[aScatter, 3]} />
        <bufferAttribute attach="attributes-aScatter" args={[aScatter, 3]} />
        <bufferAttribute attach="attributes-aGlyph" args={[aGlyph, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[aSize, 1]} />
        <bufferAttribute attach="attributes-aAccent" args={[aAccent, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={cloudVertexShader}
        fragmentShader={cloudFragmentShader}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

export function PointsScene() {
  const [reduced] = useState(prefersReducedMotion);
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 45 }}
      dpr={[1, 2]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Cloud reduced={reduced} />
    </Canvas>
  );
}
