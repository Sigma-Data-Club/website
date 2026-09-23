/**
 * Constantes del tema compartidas entre el servidor y el cliente.
 *
 * Vive fuera de `ThemeProvider` a propósito: ese módulo es `"use client"`
 * y, desde un Server Component, importar de él devuelve una referencia
 * de cliente —no el string—, así que el script anti-parpadeo del layout
 * acabaría leyendo `localStorage.getItem(undefined)`.
 */

export type Theme = "light" | "dark";

/** Clave de localStorage donde se guarda la preferencia explícita. */
export const THEME_STORAGE_KEY = "sigma-theme";

/**
 * Script que corre antes del primer frame: fija `data-theme` en el
 * `<html>` a partir de la preferencia guardada o, si no hay, del sistema.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});var d=s==="dark"||(!s&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light";}catch(e){document.documentElement.dataset.theme="light";}})();`;
