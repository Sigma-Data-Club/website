"use client";

import { Canvas, useFrame, useThree } from "@/components/three/fiber";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ACCENT_HEX, INK_HEX, prefersReducedMotion } from "../glsl";

const GRID = 50; // 50 x 50 = 2.500 columnas
const SPACING = 0.34;
const HALF = ((GRID - 1) * SPACING) / 2;

/** Altura del campo: dos octavas de seno + onda radial bajo el cursor. */
function heightAt(x: number, z: number, t: number, px: number, pz: number) {
  let h =
    Math.sin(x * 0.55 + t) * Math.cos(z * 0.5 + t * 0.8) +
    0.45 * Math.sin((x + z) * 0.4 - t * 1.1);
  h = h * 0.5 + 0.9; // a rango positivo

  const dx = x - px;
  const dz = z - pz;
  const r2 = dx * dx + dz * dz;
  h += Math.exp(-r2 * 0.35) * 1.7; // pulso del cursor
  return Math.max(h, 0.05);
}

function Field({ reduced }: { reduced: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const ink = useMemo(() => new THREE.Color(INK_HEX), []);
  const accent = useMemo(() => new THREE.Color(ACCENT_HEX), []);
  const pointer = useRef(new THREE.Vector2(99, 99)); // fuera del campo al inicio

  // Coordenadas (x, z) de cada columna, precalculadas.
  const coords = useMemo(() => {
    const c = new Float32Array(GRID * GRID * 2);
    for (let iz = 0; iz < GRID; iz++) {
      for (let ix = 0; ix < GRID; ix++) {
        const i = iz * GRID + ix;
        c[i * 2] = ix * SPACING - HALF;
        c[i * 2 + 1] = iz * SPACING - HALF;
      }
    }
    return c;
  }, []);

  const write = (t: number) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const px = pointer.current.x;
    const pz = pointer.current.y;
    for (let i = 0; i < GRID * GRID; i++) {
      const x = coords[i * 2];
      const z = coords[i * 2 + 1];
      const h = heightAt(x, z, t, px, pz);
      // Pivote central: subimos la columna media altura para que crezca
      // desde el plano del suelo (y = 0) hacia arriba.
      dummy.position.set(x, h / 2, z);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      // Acento solo en las crestas (uso moderado).
      const tint = THREE.MathUtils.smoothstep(h, 1.9, 3.0);
      color.copy(ink).lerp(accent, tint);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  // Rellena las matrices ANTES del primer pintado: así el fotograma inicial
  // ya muestra el campo (sin esto las instancias arrancan con matriz cero).
  useLayoutEffect(() => {
    write(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(({ clock, pointer: ptr }) => {
    if (reduced) return;
    // Proyección aproximada del cursor al plano del campo.
    pointer.current.set(
      ((ptr.x * viewport.width) / 2) * 1.6,
      ((-ptr.y * viewport.height) / 2) * 1.6,
    );
    write(clock.elapsedTime * 0.85);
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, GRID * GRID]}
      frustumCulled={false}
    >
      <boxGeometry args={[0.16, 1, 0.16]} />
      <meshStandardMaterial roughness={0.62} metalness={0.05} />
    </instancedMesh>
  );
}

export function FieldScene() {
  const [reduced] = useState(prefersReducedMotion);
  return (
    <Canvas
      camera={{ position: [0, 7.5, 12], fov: 38 }}
      dpr={[1, 1.75]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      onCreated={({ camera }) => camera.lookAt(0, 0.4, 0)}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[6, 12, 4]} intensity={1.5} />
      <directionalLight position={[-8, 4, -6]} intensity={0.35} color={ACCENT_HEX} />
      <Field reduced={reduced} />
    </Canvas>
  );
}
