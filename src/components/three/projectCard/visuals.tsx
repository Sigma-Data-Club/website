"use client";

import { useFrame } from "@/components/three/fiber";
import { useLayoutEffect, useMemo, useRef, type ReactElement } from "react";
import * as THREE from "three";
import type { ProjectVisualId } from "@/content/projectVisuals";
import { ACCENT_HEX, INK_HEX, snoise } from "../glsl";
import {
  createLineMaterial,
  pickStroke,
  pointerIndex,
  strokeHex,
  useCardMaterial,
  useCardRig,
  useInvalidateOnHover,
  type VisualProps,
} from "./shared";

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const sphereGeo = new THREE.SphereGeometry(1, 12, 12);

/* ── 0 · Serie temporal (ML) — card 01 ───────────────────────── */
function SignalField({ pointer, hovered, reduced }: VisualProps) {
  const ref = useCardRig(pointer, hovered, reduced, 0.15);
  useInvalidateOnHover(hovered);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const material = useCardMaterial(hovered, { opacity: hovered ? 0.95 : 0.85 });
  const count = 52;
  const gap = 0.11;
  const half = ((count - 1) * gap) / 2;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const c = useMemo(() => new THREE.Color(), []);

  const write = () => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const focus = hovered ? pointerIndex(pointer.x, count) : -1;
    for (let i = 0; i < count; i++) {
      const x = i * gap - half;
      const base = 0.25 + Math.sin(i * 0.31) * 0.22 + Math.cos(i * 0.11) * 0.12;
      const near = focus >= 0 && Math.abs(i - focus) <= 2;
      const h = near && hovered ? base + 0.55 : base;
      dummy.position.set(x, h / 2, 0);
      dummy.scale.set(0.035, h, 0.035);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (!hovered) {
        pickStroke(c, false, near);
        mesh.setColorAt(i, c);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (!hovered && mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  useLayoutEffect(() => {
    write();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered]);

  useFrame(() => {
    if (reduced) return;
    write();
  });

  return (
    <group ref={ref}>
      <instancedMesh
        key={hovered ? "hover" : "rest"}
        ref={meshRef}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <primitive object={boxGeo} attach="geometry" />
        <primitive object={material} attach="material" />
      </instancedMesh>
    </group>
  );
}

/* ── 1 · Flujo / rutas (Data Viz) — card 02 ───────────────── */
function FlowLines({ pointer, hovered, reduced }: VisualProps) {
  const ref = useCardRig(pointer, hovered, reduced, -0.2);
  useInvalidateOnHover(hovered);
  const nLines = 5;
  const segments = 36;

  const lines = useMemo(() => {
    return Array.from({ length: nLines }, () => {
      const positions = new Float32Array((segments + 1) * 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.LineBasicMaterial({
        color: INK_HEX,
        transparent: true,
        opacity: 0.38,
      });
      return new THREE.Line(geo, mat);
    });
  }, []);

  useFrame(() => {
    if (reduced) return;
    const px = (pointer.x - 0.5) * 2.2;
    const py = (pointer.y - 0.5) * 0.35;
    lines.forEach((line, li) => {
      const pos = line.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = (t - 0.5) * 2.8;
        const wave =
          Math.sin(t * Math.PI * 2.2 + li * 0.9) * 0.18 +
          Math.cos(t * 4 + li) * 0.06;
        const lift = hovered ? Math.exp(-((t - pointer.x) ** 2) * 18) * 0.35 : 0;
        pos.setXYZ(i, x, wave + py * 0.12 + lift, (t - 0.5) * 0.5 + li * 0.06 - px * 0.08);
      }
      pos.needsUpdate = true;
      const mat = line.material as THREE.LineBasicMaterial;
      mat.color.set(strokeHex(hovered));
      mat.opacity = hovered ? (Math.abs(li - 2) <= 1 ? 1 : 0.82) : 0.38;
      mat.needsUpdate = true;
    });
  });

  return (
    <group ref={ref}>
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  );
}

/* ── 2 · Lattice (NLP) — card 03 ───────────────────────────── */
function TokenLattice({ pointer, hovered, reduced }: VisualProps) {
  const ref = useCardRig(pointer, hovered, reduced, 0.35);
  useInvalidateOnHover(hovered);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const material = useCardMaterial(hovered, { wireframe: true });
  const cols = 6;
  const rows = 4;
  const count = cols * rows;
  const gap = 0.38;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const c = useMemo(() => new THREE.Color(), []);
  const jitter = useMemo(() => {
    const j = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      j[i * 3] = (hash(i) - 0.5) * 0.16;
      j[i * 3 + 1] = (hash(i + 17) - 0.5) * 0.12;
      j[i * 3 + 2] = (hash(i + 41) - 0.5) * 0.1;
    }
    return j;
  }, [count]);

  const write = () => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const cx = (cols - 1) * gap * 0.5;
    const cz = (rows - 1) * gap * 0.5;
    const pull = hovered ? 1 : 0;
    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const tx = col * gap - cx;
      const tz = row * gap - cz;
      dummy.position.set(
        tx + jitter[i * 3] * (1 - pull),
        pull * Math.sin(col * 0.4 + row * 0.3) * 0.08 + jitter[i * 3 + 1] * (1 - pull),
        tz + jitter[i * 3 + 2] * (1 - pull),
      );
      const s = 0.14 + pull * 0.02;
      dummy.scale.set(s, s * 0.65, s);
      dummy.rotation.y = pull * (pointer.x - 0.5) * 0.4;
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (!hovered) {
        const dist = Math.hypot(pointer.x - col / (cols - 1), pointer.y - row / (rows - 1));
        pickStroke(c, false, dist < 0.32);
        mesh.setColorAt(i, c);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (!hovered && mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  useLayoutEffect(() => {
    write();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered]);

  useFrame(() => {
    if (reduced) return;
    write();
  });

  return (
    <group ref={ref}>
      <instancedMesh
        key={hovered ? "hover" : "rest"}
        ref={meshRef}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <primitive object={boxGeo} attach="geometry" />
        <primitive object={material} attach="material" />
      </instancedMesh>
    </group>
  );
}

/* ── 3 · Match (recomendador) — card 04 ────────────────────── */
function MatchField({ pointer, hovered, reduced }: VisualProps) {
  const ref = useCardRig(pointer, hovered, reduced, -0.1);
  useInvalidateOnHover(hovered);
  const nodes = 7;
  const orbit = 1.05;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const coreMaterial = useCardMaterial(hovered, { wireframe: true, opacity: 0.9 });
  const nodeMaterial = useCardMaterial(hovered, { wireframe: true });
  const edgesGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(nodes * 2 * 3), 3));
    return g;
  }, [nodes]);
  const c = useMemo(() => new THREE.Color(), []);

  const edgeLines = useMemo(
    () => new THREE.LineSegments(edgesGeo, createLineMaterial(hovered, 0.18, 0.65)),
    [edgesGeo, hovered],
  );

  const write = () => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const focus = hovered ? pointerIndex(pointer.x, nodes) : -1;
    const pos = edgesGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < nodes; i++) {
      const a = (i / nodes) * Math.PI * 2 - Math.PI / 2;
      const pull = hovered && i === focus ? 0.35 : 0;
      const px = Math.cos(a) * (orbit - pull);
      const pz = Math.sin(a) * (orbit - pull);
      dummy.position.set(px, 0, pz);
      dummy.scale.setScalar(i === focus && hovered ? 0.16 : 0.1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (!hovered) {
        pickStroke(c, false, i === focus);
        mesh.setColorAt(i, c);
      }
      pos.setXYZ(i * 2, 0, 0, 0);
      pos.setXYZ(i * 2 + 1, px, 0, pz);
    }
    pos.needsUpdate = true;
    mesh.instanceMatrix.needsUpdate = true;
    if (!hovered && mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  useLayoutEffect(() => {
    write();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered]);

  useFrame(() => {
    if (reduced) return;
    write();
  });

  return (
    <group ref={ref}>
      <mesh key={hovered ? "hover-core" : "rest-core"}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <primitive object={coreMaterial} attach="material" />
      </mesh>
      <primitive object={edgeLines} />
      <instancedMesh
        key={hovered ? "hover" : "rest"}
        ref={meshRef}
        args={[undefined, undefined, nodes]}
        frustumCulled={false}
      >
        <primitive object={sphereGeo} attach="geometry" />
        <primitive object={nodeMaterial} attach="material" />
      </instancedMesh>
    </group>
  );
}

/* ── 4 · Aperture (visión) — card 05 ───────────────────────── */
const apertureVert = /* glsl */ `
  uniform float uHover;
  uniform vec2 uPointer;
  varying float vFocus;
  ${snoise}
  void main() {
    vec3 p = position;
    float d = distance(uv, uPointer);
    float lens = exp(-d * d * 14.0) * uHover * 0.35;
    p.z += lens;
    vFocus = lens;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const apertureFrag = /* glsl */ `
  precision mediump float;
  uniform vec3 uInk;
  uniform vec3 uAccent;
  uniform float uCardHover;
  varying float vFocus;
  void main() {
    if (uCardHover > 0.5) {
      vec3 col = mix(uAccent, vec3(1.0), smoothstep(0.02, 0.38, vFocus));
      gl_FragColor = vec4(col, 0.92 + vFocus * 0.08);
      return;
    }
    vec3 col = mix(uInk, uAccent, smoothstep(0.02, 0.28, vFocus));
    gl_FragColor = vec4(col, 0.5 + vFocus * 0.2);
  }
`;

function ApertureGrid({ pointer, hovered, reduced }: VisualProps) {
  const ref = useCardRig(pointer, hovered, reduced, 0.25);
  useInvalidateOnHover(hovered);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uHover: { value: 0 },
      uCardHover: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uInk: { value: new THREE.Color(INK_HEX) },
      uAccent: { value: new THREE.Color(ACCENT_HEX) },
    }),
    [],
  );

  useLayoutEffect(() => {
    const mat = matRef.current;
    if (!mat) return;
    mat.uniforms.uCardHover.value = hovered ? 1 : 0;
    mat.uniforms.uHover.value = hovered ? 1 : 0;
    mat.uniforms.uPointer.value.set(pointer.x, 1 - pointer.y);
    mat.needsUpdate = true;
  }, [hovered, pointer.x, pointer.y]);

  useFrame(() => {
    if (!matRef.current || reduced) return;
    matRef.current.uniforms.uHover.value = hovered ? 1 : 0;
    matRef.current.uniforms.uCardHover.value = hovered ? 1 : 0;
    matRef.current.uniforms.uPointer.value.set(pointer.x, 1 - pointer.y);
  });

  return (
    <group ref={ref} rotation={[0.55, 0, 0]}>
      <mesh>
        <planeGeometry args={[2.4, 1.5, 32, 20]} />
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={apertureVert}
          fragmentShader={apertureFrag}
          wireframe
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ── 5 · Metric strip (analítica) — card 06 ─────────────────── */
function MetricStrip({ pointer, hovered, reduced }: VisualProps) {
  const ref = useCardRig(pointer, hovered, reduced, -0.15);
  useInvalidateOnHover(hovered);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const material = useCardMaterial(hovered, { wireframe: true });
  const count = 9;
  const gap = 0.22;
  const half = ((count - 1) * gap) / 2;
  const heights = useMemo(
    () => [0.35, 0.55, 0.42, 0.78, 0.5, 0.92, 0.62, 0.48, 0.7],
    [],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const c = useMemo(() => new THREE.Color(), []);

  const write = () => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const focus = hovered ? pointerIndex(pointer.x, count) : -1;
    for (let i = 0; i < count; i++) {
      const x = i * gap - half;
      const base = heights[i];
      const lift = hovered && Math.abs(i - focus) <= 1 ? 0.35 : 0;
      const h = base + lift;
      dummy.position.set(x, h / 2 - 0.35, 0);
      dummy.scale.set(0.12, h, 0.12);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (!hovered) {
        pickStroke(c, false, i === focus);
        mesh.setColorAt(i, c);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (!hovered && mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  useLayoutEffect(() => {
    write();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered]);

  useFrame(() => {
    if (reduced) return;
    write();
  });

  return (
    <group ref={ref}>
      <instancedMesh
        key={hovered ? "hover" : "rest"}
        ref={meshRef}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <primitive object={boxGeo} attach="geometry" />
        <primitive object={material} attach="material" />
      </instancedMesh>
    </group>
  );
}

const VISUALS: Record<ProjectVisualId, (props: VisualProps) => ReactElement> = {
  signal: SignalField,
  flow: FlowLines,
  lattice: TokenLattice,
  match: MatchField,
  aperture: ApertureGrid,
  metric: MetricStrip,
};

export function ProjectVisual({
  visualId,
  ...props
}: VisualProps & { visualId: ProjectVisualId }) {
  const V = VISUALS[visualId];
  return <V {...props} />;
}
