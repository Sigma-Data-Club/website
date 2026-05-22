"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Group, ShaderMaterial } from "three";

/* Colores en sintonía con los tokens CSS (--color-ink / --color-accent). */
const INK = new THREE.Color("#0b0b0b");
const ACCENT = new THREE.Color("#36b9ba");

const POINT_COUNT = 5500;
const RADIUS = 1.85;
const ACCENT_RATIO = 0.07; // muy pocos puntos en acento — sin abusar del color

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uAmp;
  attribute float aRandom;
  attribute float aAccent;
  varying float vAccent;

  // Simplex noise 3D (Ashima Arts)
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main(){
    vAccent = aAccent;
    vec3 dir = normalize(position);
    float n = snoise(position * 1.25 + uTime * 0.16);
    vec3 pos = position + dir * n * uAmp;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (0.55 + 0.9 * aRandom) * (1.0 / -mv.z);
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

function DataField({ reduced }: { reduced: boolean }) {
  const matRef = useRef<ShaderMaterial>(null);
  const spinRef = useRef<Group>(null);
  const tiltRef = useRef<Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Distribución de puntos sobre una esfera (espiral de Fibonacci) + atributos.
  const { positions, randoms, accents } = useMemo(() => {
    const positions = new Float32Array(POINT_COUNT * 3);
    const randoms = new Float32Array(POINT_COUNT);
    const accents = new Float32Array(POINT_COUNT);
    const golden = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < POINT_COUNT; i++) {
      const y = 1 - (i / (POINT_COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      positions[i * 3] = Math.cos(theta) * r * RADIUS;
      positions[i * 3 + 1] = y * RADIUS;
      positions[i * 3 + 2] = Math.sin(theta) * r * RADIUS;
      randoms[i] = Math.random();
      accents[i] = Math.random() < ACCENT_RATIO ? 1 : 0;
    }
    return { positions, randoms, accents };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 26 },
      uAmp: { value: 0.28 },
      uInk: { value: INK },
      uAccent: { value: ACCENT },
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
    if (spinRef.current) spinRef.current.rotation.y += delta * 0.05;
    if (tiltRef.current) {
      tiltRef.current.rotation.y += (mouse.current.x * 0.3 - tiltRef.current.rotation.y) * 0.04;
      tiltRef.current.rotation.x += (-mouse.current.y * 0.2 - tiltRef.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={tiltRef}>
      <group ref={spinRef} rotation={[-0.15, 0, 0.08]}>
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

export function HeroScene() {
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  return (
    <Canvas
      camera={{ position: [0, 0, 4.4], fov: 42 }}
      dpr={[1, 2]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <DataField reduced={reduced} />
    </Canvas>
  );
}
