"use client";

import { useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";
import { syncSceneColors } from "./three/glsl";

export type { Theme };

/** Evento interno con el que el store avisa a los suscriptores. */
const THEME_EVENT = "sigma:themechange";

/* ------------------------------------------------------------------
   El tema vive en `document.documentElement.dataset.theme`, que ya
   escribe el script del layout antes del primer frame. React no lo
   duplica en estado: lo lee con useSyncExternalStore, así que no hay
   dos fuentes de verdad que puedan desincronizarse.
   ------------------------------------------------------------------ */

function subscribe(onStoreChange: () => void) {
  window.addEventListener(THEME_EVENT, onStoreChange);
  return () => window.removeEventListener(THEME_EVENT, onStoreChange);
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

// En el servidor no hay DOM: renderizamos en claro y el primer snapshot
// del cliente corrige si hacía falta (por eso el suppressHydrationWarning).
function getServerSnapshot(): Theme {
  return "light";
}

function storedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  // Las variables CSS ya son las nuevas: las escenas releen de ahí.
  syncSceneColors();
  window.dispatchEvent(new Event(THEME_EVENT));
}

/** Tema activo. Las escenas 3D lo usan como key para remontarse. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return useMemo(
    () => ({
      theme,
      toggle() {
        const next: Theme = theme === "dark" ? "light" : "dark";
        try {
          localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {
          // Modo privado o storage bloqueado: el tema vive solo esta sesión.
        }
        applyTheme(next);
      },
    }),
    [theme],
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Reafirmamos el tema al montar por dos motivos: volcar la paleta CSS
  // real en las escenas 3D y reponer `data-theme` si React hubiera
  // regenerado el árbol en cliente (una hidratación fallida se lleva por
  // delante los atributos que puso el script del layout).
  useEffect(() => {
    applyTheme(storedTheme() ?? systemTheme());
  }, []);

  // Sin preferencia explícita, seguimos al sistema.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (storedTheme()) return;
      applyTheme(systemTheme());
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return <>{children}</>;
}
