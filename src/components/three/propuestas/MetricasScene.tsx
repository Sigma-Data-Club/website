"use client";

import { Canvas, useFrame } from "@/components/three/fiber";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { about } from "@/content/site";
import { INK_HEX, accentColor, inkColor, prefersReducedMotion } from "../glsl";

const raw = about.stats.map((s) => parseFloat(s.value.replace(/\D/g, "")) || 1);
const max = Math.max(...raw);
const N = raw.length;
const GAP = 1.1;

function Metricas({ reduced }: { reduced: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const wireRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const ink = inkColor;
  const accent = accentColor;
  const color = useMemo(() => new THREE.Color(), []);
  const phase = useRef(0);

  const write = (t: number) => {
    const mesh = meshRef.current;
    const wire = wireRef.current;
    if (!mesh || !wire) return;
    const half = ((N - 1) * GAP) / 2;
    for (let i = 0; i < N; i++) {
      const x = i * GAP - half;
      const target = (raw[i] / max) * 2.8;
      const breathe = Math.sin(t * 1.2 + i * 0.7) * 0.06;
      const h = target + breathe;
      dummy.position.set(x, h / 2, 0);
      dummy.scale.set(0.7, h, 0.7);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      wire.setMatrixAt(i, dummy.matrix);
      const tint = THREE.MathUtils.smoothstep(h, 1.6, 2.6);
      color.copy(ink).lerp(accent, tint);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    wire.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  useLayoutEffect(() => {
    write(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(({ clock }) => {
    if (reduced) return;
    phase.current = clock.elapsedTime;
    write(phase.current);
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, N]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.58} metalness={0.05} />
      </instancedMesh>
      <instancedMesh ref={wireRef} args={[undefined, undefined, N]} frustumCulled={false}>
        <boxGeometry args={[1.02, 1.02, 1.02]} />
        <meshBasicMaterial color={INK_HEX} wireframe transparent opacity={0.18} />
      </instancedMesh>
    </group>
  );
}

export function MetricasScene() {
  const [reduced] = useState(prefersReducedMotion);
  return (
    <Canvas
      camera={{ position: [0, 1.8, 6], fov: 40 }}
      dpr={[1, 2]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.52} />
      <directionalLight position={[2, 5, 3]} intensity={0.9} />
      <Metricas reduced={reduced} />
    </Canvas>
  );
}
