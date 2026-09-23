"use client";

import { Canvas, useFrame } from "@/components/three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { accentColor, inkColor, prefersReducedMotion } from "../glsl";

/**
 * Construye la Σ como un sólido editorial: dos barras horizontales y dos
 * diagonales que se encuentran en un vértice central-derecho. Cada parte es
 * una caja extruida; comparten un único material fresnel.
 */
function buildSigma() {
  const hw = 1.0; // semi-ancho
  const hh = 1.34; // semi-alto
  const t = 0.4; // grosor de trazo
  const depth = 0.56;
  const vx = hw * 0.3; // vértice del pico, ligeramente a la derecha

  type Part = {
    position: [number, number, number];
    rotation: [number, number, number];
    args: [number, number, number];
  };

  const diagonal = (ay: number): Part => {
    const ax = -hw;
    const dx = vx - ax;
    const dy = 0 - ay;
    const len = Math.hypot(dx, dy) + t * 0.5;
    const angle = Math.atan2(dy, dx);
    return {
      position: [(ax + vx) / 2, ay / 2, 0],
      rotation: [0, 0, angle],
      args: [len, t, depth],
    };
  };

  const parts: Part[] = [
    // Barra superior
    { position: [0, hh - t / 2, 0], rotation: [0, 0, 0], args: [2 * hw, t, depth] },
    // Barra inferior
    { position: [0, -(hh - t / 2), 0], rotation: [0, 0, 0], args: [2 * hw, t, depth] },
    // Diagonal superior e inferior
    diagonal(hh - t),
    diagonal(-(hh - t)),
  ];

  return parts;
}

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vY;
  void main(){
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    vY = position.y;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform vec3 uInk;
  uniform vec3 uAccent;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vY;
  void main(){
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vView);

    // Forma: luz fija + leve gradiente vertical para dar volumen.
    vec3 L = normalize(vec3(0.45, 0.8, 0.6));
    float diff = max(dot(N, L), 0.0);
    vec3 body = mix(uInk, uInk + vec3(0.12), diff);
    body = mix(body, body + vec3(0.04), smoothstep(-1.4, 1.4, vY));

    // Borde de luz en el acento del club.
    float fres = pow(1.0 - max(dot(N, V), 0.0), 2.6);
    vec3 col = mix(body, uAccent, clamp(fres, 0.0, 1.0));

    gl_FragColor = vec4(col, 1.0);
  }
`;

function makeUniforms() {
  return {
    uInk: { value: inkColor },
    uAccent: { value: accentColor },
  };
}

function Sigma({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const parts = useMemo(() => buildSigma(), []);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    if (reduced) {
      g.rotation.set(-0.12, -0.5, 0);
      return;
    }
    const t = state.clock.elapsedTime;
    // Giro base + parallax suave hacia el cursor + flotación.
    const targetY = -0.5 + state.pointer.x * 0.5;
    const targetX = -0.1 - state.pointer.y * 0.4;
    g.rotation.y += (targetY + t * 0.12 - g.rotation.y) * 0.05;
    g.rotation.x += (targetX - g.rotation.x) * 0.05;
    g.position.y = Math.sin(t * 0.8) * 0.08;
  });

  return (
    <group ref={groupRef} position={[-0.12, 0, 0]}>
      {parts.map((p, i) => (
        <mesh key={i} position={p.position} rotation={p.rotation}>
          <boxGeometry args={p.args} />
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={makeUniforms()}
          />
        </mesh>
      ))}
    </group>
  );
}

export function SigmaScene() {
  const [reduced] = useState(prefersReducedMotion);
  return (
    <Canvas
      camera={{ position: [0, 0, 4.7], fov: 42 }}
      dpr={[1, 2]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Sigma reduced={reduced} />
    </Canvas>
  );
}
