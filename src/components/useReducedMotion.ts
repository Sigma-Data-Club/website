"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onStoreChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

// El servidor no tiene media queries: prerenderiza siempre la versión
// animada y React ajusta en cuanto hidrata.
function getServerSnapshot() {
  return false;
}

/**
 * `prefers-reduced-motion` como estado de React.
 *
 * Leerlo directamente durante el render (p. ej. `useState(prefersReducedMotion)`)
 * rompe la hidratación: el HTML estático se genera sin `window` y el cliente
 * devuelve otro valor, así que React descarta el árbol y lo regenera —lo que
 * además borra atributos puestos por scripts, como el `data-theme` del tema.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
