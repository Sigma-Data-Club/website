"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { ShaderMaterial } from "three";
import { ACCENT_HEX, INK_HEX, prefersReducedMotion } from "./glsl";
import { cloudFragmentShader, cloudVertexShader, sampleGlyph } from "./sigmaCloud";
import { mulberry32 } from "./lab/random";

const COUNT = 12000;
/** Fracción de partículas en color acento (azul) frente a tinta (negro). */
const ACCENT_RATIO = 0.58;

/**
 * Variante de la nube para la sección "Únete": la σ se mantiene casi siempre
 * formada (respira entre medio formada y nítida) para que se lea como marca
 * de fondo, no como demo. Sin interacción de cursor (el formulario manda).
 */
function Cloud({ reduced }: { reduced: boolean }) {
  const matRef = useRef<ShaderMaterial>(null);

  const { aScatter, aGlyph, aSize, aAccent, uniforms } = useMemo(() => {
    const rand = mulberry32(0x51_6d_a7);
    const spanX = 7.2;
    const spanY = 7.2;
    const glyph2d = sampleGlyph(COUNT, spanX, spanY, rand);

    const aScatter = new Float32Array(COUNT * 3);
    const aGlyph = new Float32Array(COUNT * 3);
    const aSize = new Float32Array(COUNT);
    const aAccent = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const r = Math.pow(rand(), 0.5) * 5.2;
      const a = rand() * Math.PI * 2;
      aScatter[i * 3] = Math.cos(a) * r;
      aScatter[i * 3 + 1] = Math.sin(a) * r * 0.85;
      aScatter[i * 3 + 2] = (rand() - 0.5) * 4.2;

      aGlyph[i * 3] = glyph2d[i * 2];
      aGlyph[i * 3 + 1] = glyph2d[i * 2 + 1];
      aGlyph[i * 3 + 2] = (rand() - 0.5) * 0.5;

      aSize[i] = 1.0 + rand() * 1.2;
      aAccent[i] = rand() < ACCENT_RATIO ? 1.0 : 0.0;
    }

    const u = {
      uTime: { value: 0 },
      uMorph: { value: 1 },
      uDpr: { value: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2) },
      // Lejos al inicio (sin empuje) hasta que el cursor entre en escena.
      uPointer: { value: new THREE.Vector2(0, -999) },
      uPointerStrength: { value: 0.5 },
      uInk: { value: new THREE.Color(INK_HEX) },
      uAccent: { value: new THREE.Color(ACCENT_HEX) },
    };

    return { aScatter, aGlyph, aSize, aAccent, uniforms: u };
  }, []);

  // El lienzo es pointer-events-none (el formulario manda), así que el cursor
  // se escucha a nivel de ventana y se proyecta al mundo.
  const mouse = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat || reduced) return;
    const t = state.clock.elapsedTime;
    mat.uniforms.uTime.value = t;
    // Respira muy sutil entre ~0.93 y 1: la σ se mantiene nítida y reconocible.
    const wave = Math.sin(t * 0.5) * 0.5 + 0.5;
    mat.uniforms.uMorph.value = 0.93 + 0.07 * wave;

    // Proyecta el cursor al espacio local de la nube y la repele con suavidad.
    if (mouse.current) {
      const rect = state.gl.domElement.getBoundingClientRect();
      const nx = ((mouse.current.x - rect.left) / rect.width) * 2 - 1;
      const ny = -(((mouse.current.y - rect.top) / rect.height) * 2 - 1);
      const tx = (nx * state.viewport.width) / 2;
      const ty = (ny * state.viewport.height) / 2 - 0.85; // resta el offset del grupo
      const p = mat.uniforms.uPointer.value as THREE.Vector2;
      p.x += (tx - p.x) * 0.1;
      p.y += (ty - p.y) * 0.1;
    }
  });

  return (
    // Centrada y elevada: el trazo superior queda arriba (limpio) y el cuenco
    // deja sitio abajo para el título superpuesto.
    <points position={[0, 0.85, 0]}>
      <bufferGeometry>
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

export function JoinCloudScene() {
  const [reduced] = useState(prefersReducedMotion);
  return (
    <Canvas
      camera={{ position: [0, 0, 7.8], fov: 45 }}
      dpr={[1, 2]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Cloud reduced={reduced} />
    </Canvas>
  );
}
