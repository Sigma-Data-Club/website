"use client";

import { Canvas, useFrame, useThree } from "@/components/three/fiber";
import { useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { team } from "@/content/site";
import { buildGridLayout, gridCameraDistance, type CrowdLayout } from "./clubCrowdGrid";
import { ACCENT_HEX, BG_HEX, prefersReducedMotion } from "./glsl";

const N = team.memberCount;
const DROP_HEIGHT = 2.8;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function placedAmount(scrollProgress: number, rank: number) {
  const slot = rank / Math.max(N - 1, 1);
  const fade = 0.09;
  const start = slot * (1 - fade);
  return smoothstep(0, 1, (scrollProgress - start) / fade);
}

function GridCamera({ layout }: { layout: CrowdLayout }) {
  const { camera } = useThree();
  const dist = useMemo(() => gridCameraDistance(layout), [layout]);

  useLayoutEffect(() => {
    camera.position.set(0, dist.y, dist.z);
    camera.lookAt(0, 0.28, 0);
    camera.updateProjectionMatrix();
  }, [camera, dist.y, dist.z]);

  return null;
}

function ClubCrowd({
  reduced,
  layout,
  scrollProgressRef,
}: {
  reduced: boolean;
  layout: CrowdLayout;
  scrollProgressRef: RefObject<number>;
}) {
  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const headRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const hidden = useMemo(() => new THREE.Vector3(0, -999, 0), []);
  const color = useMemo(() => new THREE.Color(), []);
  const highlight = useMemo(() => new THREE.Color(ACCENT_HEX), []);
  const pointerWorld = useRef(new THREE.Vector2(99, 99));
  const smoothScroll = useRef(reduced ? 1 : 0);
  const { pointer, viewport } = useThree();
  const fig = layout.figureScale;

  const write = (t: number, scrollProgress: number) => {
    const bodyMesh = bodyRef.current;
    const headMesh = headRef.current;
    if (!bodyMesh || !headMesh) return;

    const px = pointerWorld.current.x;
    const pz = pointerWorld.current.y;
    const waveOrigin = t * 1.35;
    const allPlaced = scrollProgress >= 0.995;

    for (let i = 0; i < N; i++) {
      const placed = placedAmount(scrollProgress, layout.placeRank[i]);

      if (placed <= 0.001) {
        dummy.position.copy(hidden);
        dummy.scale.setScalar(0.001);
        dummy.updateMatrix();
        bodyMesh.setMatrixAt(i, dummy.matrix);
        headMesh.setMatrixAt(i, dummy.matrix);
        continue;
      }

      const x = layout.xz[i * 2];
      const z = layout.xz[i * 2 + 1];

      const dx = x - px;
      const dz = z - pz;
      const dist2 = dx * dx + dz * dz;
      const ripple = allPlaced ? Math.exp(-dist2 * 0.55) * 0.35 : 0;

      const wave = allPlaced
        ? Math.sin(waveOrigin - (x + z) * 0.65 + layout.phase[i]) * 0.04
        : 0;
      const bob = allPlaced ? Math.sin(t * 1.15 + layout.phase[i]) * 0.025 : 0;
      const drop = (1 - placed) * DROP_HEIGHT;
      const y = bob + wave + ripple - drop;

      const rotY =
        layout.baseRot[i] +
        (allPlaced ? Math.sin(t * 0.6 + i * 0.11) * 0.04 : 0);
      const lift = 1 + (allPlaced ? ripple * 0.35 + wave * 0.5 : 0);
      const scaleIn = (0.35 + 0.65 * placed) * fig;

      dummy.position.set(x, y + 0.2 * lift, z);
      dummy.rotation.y = rotY;
      dummy.scale.set(0.95 * lift * scaleIn, lift * scaleIn, 0.95 * lift * scaleIn);
      dummy.updateMatrix();
      bodyMesh.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, y + 0.38 * lift, z);
      dummy.rotation.y = rotY;
      dummy.scale.setScalar(0.92 * lift * scaleIn);
      dummy.updateMatrix();
      headMesh.setMatrixAt(i, dummy.matrix);

      const tint = allPlaced
        ? THREE.MathUtils.clamp(ripple * 1.4 + wave * 2.5, 0, 1)
        : THREE.MathUtils.clamp(placed * 0.25, 0, 1);
      const ci = i * 3;
      color.setRGB(layout.colors[ci], layout.colors[ci + 1], layout.colors[ci + 2]);
      if (tint > 0) color.lerp(highlight, tint * 0.4);
      bodyMesh.setColorAt(i, color);
      headMesh.setColorAt(i, color);
    }

    bodyMesh.instanceMatrix.needsUpdate = true;
    headMesh.instanceMatrix.needsUpdate = true;
    if (bodyMesh.instanceColor) bodyMesh.instanceColor.needsUpdate = true;
    if (headMesh.instanceColor) headMesh.instanceColor.needsUpdate = true;
  };

  useLayoutEffect(() => {
    write(0, scrollProgressRef.current ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  useFrame(({ clock }) => {
    const target = reduced ? 1 : (scrollProgressRef.current ?? 0);
    smoothScroll.current = reduced
      ? 1
      : THREE.MathUtils.lerp(smoothScroll.current, target, 0.14);

    if (!reduced) {
      pointerWorld.current.set(
        ((pointer.x * viewport.width) / 2) * 1.1,
        ((-pointer.y * viewport.height) / 2) * 0.95,
      );
    }

    write(clock.elapsedTime, smoothScroll.current);
  });

  const mat = <meshLambertMaterial />;

  return (
    <group position={[0, -0.55, 0]}>
      <GridCamera layout={layout} />
      <instancedMesh ref={bodyRef} args={[undefined, undefined, N]} frustumCulled={false}>
        <capsuleGeometry args={[0.09, 0.2, 6, 10]} />
        {mat}
      </instancedMesh>
      <instancedMesh ref={headRef} args={[undefined, undefined, N]} frustumCulled={false}>
        <sphereGeometry args={[0.11, 10, 10]} />
        {mat}
      </instancedMesh>
    </group>
  );
}

function ClubCrowdRoot({
  reduced,
  scrollProgressRef,
}: {
  reduced: boolean;
  scrollProgressRef: RefObject<number>;
}) {
  const { viewport } = useThree();
  const layout = useMemo(
    () => buildGridLayout(N, viewport.width, viewport.height),
    [viewport.width, viewport.height],
  );

  return (
    <ClubCrowd reduced={reduced} layout={layout} scrollProgressRef={scrollProgressRef} />
  );
}

export function ClubCrowdScene({
  scrollProgressRef,
}: {
  scrollProgressRef: RefObject<number>;
}) {
  const [reduced] = useState(prefersReducedMotion);

  return (
    <Canvas
      camera={{ position: [0, 4, 10], fov: 36 }}
      dpr={[1, 1.75]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent", width: "100%", height: "100%", touchAction: "pan-y" }}
    >
      <ambientLight intensity={1.1} />
      <hemisphereLight args={["#dff5f5", BG_HEX, 0.95]} />
      <directionalLight position={[4, 10, 6]} intensity={0.42} />
      <directionalLight position={[-5, 7, 4]} intensity={0.28} color={ACCENT_HEX} />
      <directionalLight position={[0, 5, -7]} intensity={0.22} />
      <ClubCrowdRoot reduced={reduced} scrollProgressRef={scrollProgressRef} />
    </Canvas>
  );
}
