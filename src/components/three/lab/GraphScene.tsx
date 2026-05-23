"use client";

import { Canvas, useThree } from "@/components/three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ACCENT_HEX, INK_HEX, prefersReducedMotion } from "../glsl";
import { mulberry32 } from "./random";
import { labTopics } from "@/content/lab";

const N = 64;

function buildGraph() {
  const rand = mulberry32(0x5_16d_a4);
  const positions = new Float32Array(N * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = i * golden;
    const radius = 2.5;
    positions[i * 3] = Math.cos(theta) * r * radius + (rand() - 0.5) * 0.4;
    positions[i * 3 + 1] = y * radius + (rand() - 0.5) * 0.4;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius + (rand() - 0.5) * 0.4;
  }

  // Aristas: cada nodo se une a sus 2 vecinos más próximos (sin duplicar).
  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  const degree = new Array(N).fill(0);

  for (let i = 0; i < N; i++) {
    const dists: { j: number; d: number }[] = [];
    for (let j = 0; j < N; j++) {
      if (i === j) continue;
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      dists.push({ j, d: dx * dx + dy * dy + dz * dz });
    }
    dists.sort((a, b) => a.d - b.d);
    for (let k = 0; k < 2; k++) {
      const j = dists[k].j;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push([i, j]);
        degree[i]++;
        degree[j]++;
      }
    }
  }

  const isHub = degree.map((d) => d >= 4);
  const radii = isHub.map((h) => (h ? 0.14 : 0.085));
  const topics = Array.from({ length: N }, (_, i) => labTopics[i % labTopics.length]);

  return { positions, edges, isHub, radii, topics };
}

function edgesToPositions(edges: [number, number][], positions: Float32Array) {
  const out = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], i) => {
    out[i * 6] = positions[a * 3];
    out[i * 6 + 1] = positions[a * 3 + 1];
    out[i * 6 + 2] = positions[a * 3 + 2];
    out[i * 6 + 3] = positions[b * 3];
    out[i * 6 + 4] = positions[b * 3 + 1];
    out[i * 6 + 5] = positions[b * 3 + 2];
  });
  return out;
}

function Graph() {
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const invalidate = useThree((s) => s.invalidate);
  const [hovered, setHovered] = useState<number | null>(null);

  const { positions, edges, isHub, radii, topics } = useMemo(() => buildGraph(), []);
  const baseEdges = useMemo(() => edgesToPositions(edges, positions), [edges, positions]);

  const hoverEdges = useMemo(() => {
    if (hovered == null) return null;
    const incident = edges.filter(([a, b]) => a === hovered || b === hovered);
    return edgesToPositions(incident, positions);
  }, [hovered, edges, positions]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmp = useMemo(() => new THREE.Color(), []);
  const ink = useMemo(() => new THREE.Color(INK_HEX), []);
  const accent = useMemo(() => new THREE.Color(ACCENT_HEX), []);

  // Escribe matrices y colores antes del primer pintado; se reejecuta al
  // cambiar el nodo bajo el cursor.
  useLayoutEffect(() => {
    const mesh = nodesRef.current;
    if (!mesh) return;
    for (let i = 0; i < N; i++) {
      const active = hovered === i;
      const scale = radii[i] * (active ? 1.8 : 1);
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      tmp.copy(active || isHub[i] ? accent : ink);
      mesh.setColorAt(i, tmp);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    invalidate(); // repinta también en frameloop="demand" (reduced motion)
  }, [hovered, positions, radii, isHub, dummy, tmp, ink, accent, invalidate]);

  const hoveredPos =
    hovered != null
      ? ([positions[hovered * 3], positions[hovered * 3 + 1], positions[hovered * 3 + 2]] as [
          number,
          number,
          number,
        ])
      : null;

  return (
    <group>
      {/* Aristas base */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[baseEdges, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={INK_HEX} transparent opacity={0.16} />
      </lineSegments>

      {/* Aristas resaltadas del nodo activo */}
      {hoverEdges && (
        <lineSegments key={hovered ?? -1}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[hoverEdges, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={ACCENT_HEX} transparent opacity={0.9} />
        </lineSegments>
      )}

      {/* Nodos */}
      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, N]}
        frustumCulled={false}
        onPointerMove={(e) => {
          e.stopPropagation();
          if (e.instanceId != null) setHovered(e.instanceId);
        }}
        onPointerOut={() => setHovered(null)}
      >
        <sphereGeometry args={[1, 18, 18]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* Etiqueta del tema */}
      {hovered != null && hoveredPos && (
        <Html position={hoveredPos} center distanceFactor={9}>
          <div className="pointer-events-none -translate-y-8 whitespace-nowrap border border-ink bg-bg px-3 py-1.5">
            <span className="kicker text-ink">{topics[hovered]}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

export function GraphScene() {
  const [reduced] = useState(prefersReducedMotion);
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 2]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Graph />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableDamping
        autoRotate={!reduced}
        autoRotateSpeed={0.6}
      />
    </Canvas>
  );
}
