"use client";

import { Canvas, useFrame } from "@/components/three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { ShaderMaterial } from "three";
import { ACCENT_HEX, INK_HEX, prefersReducedMotion, snoise } from "./glsl";

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying float vH;
  ${snoise}
  void main(){
    vec3 p = position;
    float h = 0.0;
    h += snoise(vec3(p.x * 0.18, p.y * 0.18, uTime * 0.08)) * 1.35;
    h += snoise(vec3(p.x * 0.48, p.y * 0.48, uTime * 0.12)) * 0.45;
    vH = h;
    p.z += h;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform vec3 uInk;
  uniform vec3 uAccent;
  varying float vH;
  void main(){
    float t = smoothstep(0.65, 1.55, vH); // solo las crestas reciben acento
    vec3 col = mix(uInk, uAccent, t);
    gl_FragColor = vec4(col, 0.5);
  }
`;

function Surface({ reduced }: { reduced: boolean }) {
  const matRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uInk: { value: new THREE.Color(INK_HEX) },
      uAccent: { value: new THREE.Color(ACCENT_HEX) },
    }),
    [],
  );

  useFrame((state) => {
    if (!reduced && matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2.15, 0, 0]} position={[0, -1.1, 0]}>
      <planeGeometry args={[26, 26, 110, 110]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        wireframe
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export function SurfaceScene() {
  const [reduced] = useState(prefersReducedMotion);
  return (
    <Canvas
      camera={{ position: [0, 3.1, 7], fov: 45 }}
      dpr={[1, 2]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Surface reduced={reduced} />
    </Canvas>
  );
}
