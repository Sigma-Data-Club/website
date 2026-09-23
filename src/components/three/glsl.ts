import * as THREE from "three";

/**
 * Ruido simplex 3D (Ashima Arts) reutilizable en los shaders de los heros.
 * Se concatena dentro de cada vertex/fragment shader que lo necesite.
 */
export const snoise = /* glsl */ `
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

/* ------------------------------------------------------------------
   Paleta de las escenas.

   Son `let` a propósito: `syncSceneColors()` las reasigna cuando cambia
   el tema y los imports de ESM son live bindings, así que quien lea el
   hex en cada render (o en cada frame) ve el valor nuevo sin remontar.

   Para los uniforms y los `color.copy(ink)` de los bucles de frame usa
   los singletons de abajo: three lee el objeto en cada frame, de modo
   que mutarlo in situ repinta sin re-render ni remonte.

   Cuidado: `inkColor`/`accentColor`/`bgColor` son compartidos. Úsalos
   siempre como ARGUMENTO (`target.copy(ink)`), nunca como receptor de
   `.copy()`, `.lerp()` o `.set()`.
   ------------------------------------------------------------------ */

export let INK_HEX = "#0b0b0b";
export let BG_HEX = "#ffffff";
export let ACCENT_HEX = "#36b9ba";
export let SKY_HEX = "#dff5f5";

export const inkColor = new THREE.Color(INK_HEX);
export const bgColor = new THREE.Color(BG_HEX);
export const accentColor = new THREE.Color(ACCENT_HEX);

/**
 * Vuelca la paleta CSS del tema activo en la paleta de las escenas.
 * La llama el ThemeProvider en cada cambio de tema (y en el arranque).
 */
export function syncSceneColors() {
  if (typeof window === "undefined") return;

  const css = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) =>
    css.getPropertyValue(name).trim() || fallback;

  INK_HEX = read("--color-ink", INK_HEX);
  BG_HEX = read("--color-bg", BG_HEX);
  ACCENT_HEX = read("--color-accent", ACCENT_HEX);
  SKY_HEX = read("--color-sky", SKY_HEX);

  inkColor.set(INK_HEX);
  bgColor.set(BG_HEX);
  accentColor.set(ACCENT_HEX);
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function isSmallScreen() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}
