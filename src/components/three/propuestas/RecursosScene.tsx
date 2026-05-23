"use client";

import { Canvas, useFrame, useThree } from "@/components/three/fiber";
import { Html } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { resources } from "@/content/site";
import { site } from "@/content/site";
import { ACCENT_HEX, INK_HEX, prefersReducedMotion } from "../glsl";

const N = resources.items.length;
const R = 3.1;

function nodePos(i: number) {
  const a = -Math.PI * 0.35 + (i / (N - 1)) * Math.PI * 0.7;
  return new THREE.Vector3(Math.cos(a) * R, Math.sin(a * 0.5) * 0.35, Math.sin(a) * R * 0.35);
}

function Hub({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const edgesGeo = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < N; i++) {
      const p = nodePos(i);
      pts.push(0, 0, 0, p.x, p.y, p.z);
    }
    return new THREE.BufferGeometry().setAttribute(
      "position",
      new THREE.Float32BufferAttribute(pts, 3),
    );
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const ink = useMemo(() => new THREE.Color(INK_HEX), []);
  const accent = useMemo(() => new THREE.Color(ACCENT_HEX), []);
  const color = useMemo(() => new THREE.Color(), []);
  const [active, setActive] = useState(0);
  const { pointer } = useThree();

  useLayoutEffect(() => {
    const mesh = nodesRef.current;
    if (!mesh) return;
    for (let i = 0; i < N; i++) {
      const p = nodePos(i);
      dummy.position.copy(p);
      dummy.scale.setScalar(0.9);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, ink);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [dummy, ink]);

  useFrame(({ clock }) => {
    if (reduced || !groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.15) * 0.12;
    const idx = Math.round(((pointer.x + 1) / 2) * (N - 1));
    setActive((prev) => (prev !== idx ? idx : prev));
    const mesh = nodesRef.current;
    if (!mesh) return;
    for (let i = 0; i < N; i++) {
      const p = nodePos(i);
      dummy.position.copy(p);
      dummy.scale.setScalar(i === idx ? 1.2 : 0.88);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.copy(i === idx ? accent : ink);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <primitive object={edgesGeo} attach="geometry" />
        <lineBasicMaterial color={INK_HEX} transparent opacity={0.2} />
      </lineSegments>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color={ACCENT_HEX} emissive={ACCENT_HEX} emissiveIntensity={0.35} />
      </mesh>
      <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <span className="display text-4xl text-accent">{site.symbol}</span>
      </Html>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, N]} frustumCulled={false}>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshStandardMaterial roughness={0.4} metalness={0.2} />
      </instancedMesh>
      {resources.items.map((item, i) => {
        const p = nodePos(i);
        const show = active === i;
        return (
          <Html
            key={item.title}
            position={[p.x, p.y + 0.55, p.z]}
            center
            distanceFactor={10}
            style={{
              pointerEvents: "none",
              opacity: show ? 1 : 0,
              transition: "opacity 0.25s",
              whiteSpace: "nowrap",
            }}
          >
            <span className="kicker rounded-none border border-ink bg-bg px-2 py-1 text-[10px] text-ink shadow-none">
              {item.meta}
            </span>
          </Html>
        );
      })}
    </group>
  );
}

export function RecursosScene() {
  const [reduced] = useState(prefersReducedMotion);
  return (
    <Canvas
      camera={{ position: [0, 1.2, 7.2], fov: 42 }}
      dpr={[1, 2]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={0.95} />
      <Hub reduced={reduced} />
    </Canvas>
  );
}
