"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Group, ShaderMaterial } from "three";
import {
  ACCENT_HEX,
  INK_HEX,
  isSmallScreen,
  prefersReducedMotion,
  snoise,
} from "./glsl";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aRandom;
  attribute float aAccent;
  varying float vAccent;
  ${snoise}

  // Curl del campo de ruido → vector de "flujo" en cada punto.
  vec3 curl(vec3 p){
    float e = 0.12;
    vec3 dx = vec3(e, 0.0, 0.0);
    vec3 dy = vec3(0.0, e, 0.0);
    vec3 dz = vec3(0.0, 0.0, e);
    float x = (snoise(p + dy) - snoise(p - dy)) - (snoise(p + dz) - snoise(p - dz));
    float y = (snoise(p + dz) - snoise(p - dz)) - (snoise(p + dx) - snoise(p - dx));
    float z = (snoise(p + dx) - snoise(p - dx)) - (snoise(p + dy) - snoise(p - dy));
    return normalize(vec3(x, y, z) + 1e-5);
  }

  void main(){
    vAccent = aAccent;
    vec3 seed = position;
    float t = uTime * 0.05 + aRandom * 6.2831;
    vec3 p = seed;
    p += curl(seed * 0.55 + t) * 1.25;
    p += curl(p * 0.45 - t * 0.6) * 0.65;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (0.45 + 0.85 * aRandom) * (1.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform vec3 uInk;
  uniform vec3 uAccent;
  varying float vAccent;
  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float alpha = smoothstep(0.5, 0.4, d);
    if (alpha < 0.01) discard;
    vec3 col = mix(uInk, uAccent, vAccent);
    gl_FragColor = vec4(col, alpha);
  }
`;

function Flow({ reduced, count }: { reduced: boolean; count: number }) {
  const matRef = useRef<ShaderMaterial>(null);
  const spinRef = useRef<Group>(null);
  const tiltRef = useRef<Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const { positions, randoms, accents } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const accents = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Distribución dentro de un volumen esférico (nube contenida).
      const r = 2.6 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      randoms[i] = Math.random();
      accents[i] = Math.random() < 0.06 ? 1 : 0;
    }
    return { positions, randoms, accents };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 24 },
      uInk: { value: new THREE.Color(INK_HEX) },
      uAccent: { value: new THREE.Color(ACCENT_HEX) },
    }),
    [],
  );

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useFrame((state, delta) => {
    if (reduced) return;
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    if (spinRef.current) spinRef.current.rotation.y += delta * 0.03;
    if (tiltRef.current) {
      tiltRef.current.rotation.y += (mouse.current.x * 0.25 - tiltRef.current.rotation.y) * 0.04;
      tiltRef.current.rotation.x += (-mouse.current.y * 0.18 - tiltRef.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={tiltRef}>
      <group ref={spinRef}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
            <bufferAttribute attach="attributes-aAccent" args={[accents, 1]} />
          </bufferGeometry>
          <shaderMaterial
            ref={matRef}
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            transparent
            depthWrite={false}
          />
        </points>
      </group>
    </group>
  );
}

export function FlowScene() {
  const [reduced] = useState(prefersReducedMotion);
  const [count] = useState(() => (isSmallScreen() ? 1800 : 4000));
  return (
    <Canvas
      camera={{ position: [0, 0, 5.6], fov: 48 }}
      dpr={[1, 2]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Flow reduced={reduced} count={count} />
    </Canvas>
  );
}
