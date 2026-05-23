"use client";

import { Canvas, useFrame, useThree } from "@/components/three/fiber";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { projects } from "@/content/site";
import { ACCENT_HEX, INK_HEX, prefersReducedMotion } from "../glsl";

const COLS = 3;
const N = projects.items.length;
const GAP = 1.45;

function ProyectosMosaic({ reduced }: { reduced: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const ink = useMemo(() => new THREE.Color(INK_HEX), []);
  const accent = useMemo(() => new THREE.Color(ACCENT_HEX), []);
  const color = useMemo(() => new THREE.Color(), []);
  const hover = useRef(-1);
  const { pointer } = useThree();

  const posAt = (i: number) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const halfX = ((COLS - 1) * GAP) / 2;
    const halfZ = ((Math.ceil(N / COLS) - 1) * GAP) / 2;
    return new THREE.Vector3(col * GAP - halfX, 0, row * GAP - halfZ);
  };

  const write = (t: number) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < N; i++) {
      const p = posAt(i);
      const float = Math.sin(t + i * 0.6) * 0.12;
      const lifted = hover.current === i ? 0.55 : 0;
      dummy.position.set(p.x, float + lifted, p.z);
      dummy.rotation.set(0, hover.current === i ? 0.08 : 0, 0);
      const s = hover.current === i ? 1.08 : 1;
      dummy.scale.set(1.35 * s, 0.08 + lifted * 0.15, 1.05 * s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.copy(hover.current === i ? accent : ink);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  useLayoutEffect(() => {
    write(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(({ clock }) => {
    if (reduced) return;
    const col = Math.round(((pointer.x + 1) / 2) * (COLS - 1));
    const row = Math.round(((-pointer.y + 1) / 2) * (Math.ceil(N / COLS) - 1));
    hover.current = Math.min(row * COLS + col, N - 1);
    write(clock.elapsedTime * 0.85);
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, N]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.5} metalness={0.1} />
    </instancedMesh>
  );
}

export function ProyectosScene() {
  const [reduced] = useState(prefersReducedMotion);
  return (
    <Canvas
      camera={{ position: [0, 4.5, 7.5], fov: 38 }}
      dpr={[1, 2]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.52} />
      <directionalLight position={[5, 8, 4]} intensity={0.95} />
      <ProyectosMosaic reduced={reduced} />
    </Canvas>
  );
}
