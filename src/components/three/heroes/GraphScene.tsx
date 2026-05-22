"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Group, LineSegments, Points } from "three";
import { ACCENT_HEX, INK_HEX, isSmallScreen, prefersReducedMotion } from "./glsl";

const CONNECT_DIST = 1.25;

function Graph({ reduced, nodeCount }: { reduced: boolean; nodeCount: number }) {
  const spinRef = useRef<Group>(null);
  const tiltRef = useRef<Group>(null);
  const pointsRef = useRef<Points>(null);
  const lineRef = useRef<LineSegments>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Nodos base + fases de oscilación + aristas por cercanía (una sola vez).
  const data = useMemo(() => {
    const base: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const r = 1.2 + Math.random() * 1.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      base.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ),
      );
    }
    const phase = base.map(() => Math.random() * Math.PI * 2);
    const accent = base.map(() => (Math.random() < 0.1 ? 1 : 0));
    const edges: Array<[number, number]> = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (base[i].distanceTo(base[j]) < CONNECT_DIST) edges.push([i, j]);
      }
    }
    return { base, phase, accent, edges };
  }, [nodeCount]);

  const nodePositions = useMemo(() => {
    const arr = new Float32Array(nodeCount * 3);
    data.base.forEach((v, i) => {
      arr[i * 3] = v.x;
      arr[i * 3 + 1] = v.y;
      arr[i * 3 + 2] = v.z;
    });
    return arr;
  }, [nodeCount, data]);

  const nodeColors = useMemo(() => {
    const arr = new Float32Array(nodeCount * 3);
    const ink = new THREE.Color(INK_HEX);
    const acc = new THREE.Color(ACCENT_HEX);
    for (let i = 0; i < nodeCount; i++) {
      const c = data.accent[i] ? acc : ink;
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    return arr;
  }, [nodeCount, data]);

  const linePositions = useMemo(() => {
    const arr = new Float32Array(data.edges.length * 2 * 3);
    let k = 0;
    for (const [a, b] of data.edges) {
      const va = data.base[a];
      const vb = data.base[b];
      arr[k++] = va.x; arr[k++] = va.y; arr[k++] = va.z;
      arr[k++] = vb.x; arr[k++] = vb.y; arr[k++] = vb.z;
    }
    return arr;
  }, [data]);

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
    const t = state.clock.elapsedTime;

    // Deriva suave de cada nodo respecto a su posición base.
    for (let i = 0; i < nodeCount; i++) {
      const b = data.base[i];
      const ph = data.phase[i];
      nodePositions[i * 3] = b.x + Math.sin(t * 0.5 + ph) * 0.12;
      nodePositions[i * 3 + 1] = b.y + Math.cos(t * 0.4 + ph * 1.3) * 0.12;
      nodePositions[i * 3 + 2] = b.z + Math.sin(t * 0.6 + ph * 0.7) * 0.12;
    }
    let k = 0;
    for (const [a, b] of data.edges) {
      linePositions[k++] = nodePositions[a * 3];
      linePositions[k++] = nodePositions[a * 3 + 1];
      linePositions[k++] = nodePositions[a * 3 + 2];
      linePositions[k++] = nodePositions[b * 3];
      linePositions[k++] = nodePositions[b * 3 + 1];
      linePositions[k++] = nodePositions[b * 3 + 2];
    }
    if (pointsRef.current) pointsRef.current.geometry.attributes.position.needsUpdate = true;
    if (lineRef.current) lineRef.current.geometry.attributes.position.needsUpdate = true;

    if (spinRef.current) spinRef.current.rotation.y += delta * 0.06;
    if (tiltRef.current) {
      tiltRef.current.rotation.y += (mouse.current.x * 0.3 - tiltRef.current.rotation.y) * 0.04;
      tiltRef.current.rotation.x += (-mouse.current.y * 0.22 - tiltRef.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={tiltRef}>
      <group ref={spinRef}>
        <lineSegments ref={lineRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={INK_HEX} transparent opacity={0.16} />
        </lineSegments>
        <points ref={pointsRef} frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[nodeColors, 3]} />
          </bufferGeometry>
          <pointsMaterial size={0.08} sizeAttenuation vertexColors transparent />
        </points>
      </group>
    </group>
  );
}

export function GraphScene() {
  const [reduced] = useState(prefersReducedMotion);
  const [nodeCount] = useState(() => (isSmallScreen() ? 44 : 72));
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Graph reduced={reduced} nodeCount={nodeCount} />
    </Canvas>
  );
}
