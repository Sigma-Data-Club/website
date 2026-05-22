/**
 * PRNG determinista (mulberry32). Sustituye a Math.random en las escenas:
 * con una semilla fija el resultado es estable entre renders (puro) y, de
 * paso, las composiciones quedan reproducibles.
 */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rand() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
