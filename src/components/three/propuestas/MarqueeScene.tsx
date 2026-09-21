"use client";

import { Canvas, useFrame, useThree } from "@/components/three/fiber";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { marquee } from "@/content/site";
import { accentColor, inkColor, prefersReducedMotion } from "../glsl";

const N = marquee.length;
const R = 3.2;
const TUBE = 0.9;

function OrbitRing({ reduced }: { reduced: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const ink = inkColor;
  const accent = accentColor;
  const color = useMemo(() => new THREE.Color(), []);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const x = Math.cos(a) * R;
      const z = Math.sin(a) * R;
      const y = Math.sin(a * 2) * TUBE * 0.35;
      dummy.position.set(x, y, z);
      dummy.rotation.set(0, -a + Math.PI / 2, 0);
      dummy.scale.set(1.15, 0.22, 0.55);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.copy(i % 3 === 0 ? accent : ink);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [accent, color, dummy, ink]);

  useFrame(({ clock }) => {
    if (reduced || !groupRef.current) return;
    const t = clock.elapsedTime * 0.35;
    groupRef.current.rotation.y = t;
    groupRef.current.rotation.x = pointer.y * 0.22;
    groupRef.current.rotation.z = pointer.x * 0.12;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, N]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.55} metalness={0.08} />
      </instancedMesh>
    </group>
  );
}

export function MarqueeScene() {
  const [reduced] = useState(prefersReducedMotion);
  return (
    <Canvas
      camera={{ position: [0, 1.2, 7.5], fov: 42 }}
      dpr={[1, 2]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={0.9} />
      <OrbitRing reduced={reduced} />
    </Canvas>
  );
}
