"use client";

import { Canvas, useFrame, useThree } from "@/components/three/fiber";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { about } from "@/content/site";
import { ACCENT_HEX, INK_HEX, prefersReducedMotion } from "../glsl";

const N = about.pillars.length;
const GAP = 1.35;

function heightAt(x: number, t: number, px: number) {
  const base = 0.85 + Math.sin(t + x * 0.9) * 0.22;
  const wave = Math.exp(-((x - px) ** 2) * 0.55) * 1.4;
  return Math.max(base + wave, 0.35);
}

function Pilares({ reduced }: { reduced: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const ink = useMemo(() => new THREE.Color(INK_HEX), []);
  const accent = useMemo(() => new THREE.Color(ACCENT_HEX), []);
  const color = useMemo(() => new THREE.Color(), []);
  const pointer = useRef(0);

  const write = (t: number) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const px = pointer.current;
    const half = ((N - 1) * GAP) / 2;
    for (let i = 0; i < N; i++) {
      const x = i * GAP - half;
      const h = heightAt(x, t, px);
      dummy.position.set(x, h / 2, 0);
      dummy.scale.set(0.75, h, 0.75);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      const tint = THREE.MathUtils.smoothstep(h, 1.35, 2.1);
      color.copy(ink).lerp(accent, tint);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  useLayoutEffect(() => {
    write(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(({ clock, pointer: ptr }) => {
    if (reduced) return;
    pointer.current = ((ptr.x * viewport.width) / 2) * 0.85;
    write(clock.elapsedTime * 0.9);
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, N]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.6} metalness={0.06} />
    </instancedMesh>
  );
}

export function PilaresScene() {
  const [reduced] = useState(prefersReducedMotion);
  return (
    <Canvas
      camera={{ position: [0, 2.4, 6.5], fov: 42 }}
      dpr={[1, 2]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={0.95} />
      <Pilares reduced={reduced} />
    </Canvas>
  );
}
