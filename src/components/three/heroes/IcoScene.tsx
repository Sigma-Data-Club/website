"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { ACCENT_HEX, INK_HEX, prefersReducedMotion } from "./glsl";

function Ico({ reduced }: { reduced: boolean }) {
  const spinRef = useRef<Group>(null);
  const tiltRef = useRef<Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

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
    if (!reduced && spinRef.current) {
      spinRef.current.rotation.y += delta * 0.16;
      spinRef.current.rotation.x += delta * 0.05;
    }
    if (tiltRef.current) {
      tiltRef.current.rotation.y += (mouse.current.x * 0.25 - tiltRef.current.rotation.y) * 0.05;
      tiltRef.current.rotation.x += (-mouse.current.y * 0.2 - tiltRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={tiltRef}>
      <group ref={spinRef}>
        {/* Icosaedro geodésico en wireframe */}
        <mesh>
          <icosahedronGeometry args={[1.7, 1]} />
          <meshBasicMaterial color={INK_HEX} wireframe transparent opacity={0.85} />
        </mesh>
        {/* Núcleo translúcido con el acento, muy sutil */}
        <mesh scale={0.5}>
          <icosahedronGeometry args={[1.7, 0]} />
          <meshBasicMaterial color={ACCENT_HEX} transparent opacity={0.1} />
        </mesh>
      </group>
    </group>
  );
}

export function IcoScene() {
  const [reduced] = useState(prefersReducedMotion);
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Ico reduced={reduced} />
    </Canvas>
  );
}
