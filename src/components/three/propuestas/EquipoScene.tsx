"use client";

import { Canvas, useFrame, useThree } from "@/components/three/fiber";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { team } from "@/content/site";
import { ACCENT_HEX, INK_HEX, prefersReducedMotion } from "../glsl";

const COLS = 3;
const N = team.board.members.length;
const GAP = 1.55;

function EquipoGrid({ reduced }: { reduced: boolean }) {
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
      const bob = Math.sin(t * 0.9 + i) * 0.05;
      const active = hover.current === i;
      dummy.position.set(p.x, bob + (active ? 0.25 : 0), p.z);
      dummy.scale.set(0.95, active ? 0.22 : 0.16, 0.95);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.copy(active ? accent : ink);
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
    const idx = Math.round(((pointer.x + 1) / 2) * (N - 1));
    hover.current = idx;
    write(clock.elapsedTime);
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, N]} frustumCulled={false}>
      <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
      <meshStandardMaterial roughness={0.35} metalness={0.45} />
    </instancedMesh>
  );
}

export function EquipoScene() {
  const [reduced] = useState(prefersReducedMotion);
  return (
    <Canvas
      camera={{ position: [0, 3.8, 7], fov: 38 }}
      dpr={[1, 2]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.48} />
      <directionalLight position={[4, 6, 5]} intensity={1} />
      <EquipoGrid reduced={reduced} />
    </Canvas>
  );
}
