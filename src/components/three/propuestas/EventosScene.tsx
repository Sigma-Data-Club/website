"use client";

import { Canvas, useFrame, useThree } from "@/components/three/fiber";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { events } from "@/content/site";
import { ACCENT_HEX, INK_HEX, prefersReducedMotion } from "../glsl";

const N = events.items.length;
const SPINE_LEN = 7;

function spinePoint(t: number) {
  const x = (t - 0.5) * SPINE_LEN;
  const y = Math.sin(t * Math.PI * 1.1) * 0.55;
  const z = Math.cos(t * Math.PI) * 0.35;
  return new THREE.Vector3(x, y, z);
}

function Timeline({ reduced }: { reduced: boolean }) {
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const spineLine = useMemo(() => {
    const pts = Array.from({ length: 32 }, (_, i) => spinePoint(i / 31));
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: INK_HEX,
      transparent: true,
      opacity: 0.25,
    });
    return new THREE.Line(geo, mat);
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const ink = useMemo(() => new THREE.Color(INK_HEX), []);
  const accent = useMemo(() => new THREE.Color(ACCENT_HEX), []);
  const color = useMemo(() => new THREE.Color(), []);
  const active = useRef(0);
  const { pointer } = useThree();

  useLayoutEffect(() => {
    const mesh = nodesRef.current;
    if (!mesh) return;
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const p = spinePoint(t);
      dummy.position.copy(p);
      dummy.scale.setScalar(i === 0 ? 1.15 : 0.85);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, i === 0 ? accent : ink);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [accent, dummy, ink]);

  useFrame(() => {
    if (reduced) return;
    const mesh = nodesRef.current;
    if (!mesh) return;
    const idx = Math.round(((pointer.x + 1) / 2) * (N - 1));
    if (idx === active.current) return;
    active.current = idx;
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const p = spinePoint(t);
      dummy.position.copy(p);
      const isActive = i === idx;
      dummy.scale.setScalar(isActive ? 1.35 : 0.82);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.copy(isActive ? accent : ink);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <group rotation={[0, -0.25, 0]}>
      <primitive object={spineLine} />
      <instancedMesh ref={nodesRef} args={[undefined, undefined, N]} frustumCulled={false}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial roughness={0.45} metalness={0.12} />
      </instancedMesh>
    </group>
  );
}

export function EventosScene() {
  const [reduced] = useState(prefersReducedMotion);
  return (
    <Canvas
      camera={{ position: [0, 1.4, 7], fov: 42 }}
      dpr={[1, 2]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 5, 6]} intensity={0.95} />
      <Timeline reduced={reduced} />
    </Canvas>
  );
}
