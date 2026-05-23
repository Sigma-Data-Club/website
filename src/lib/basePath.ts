/**
 * basePath del despliegue: vacío en desarrollo, "/website" en producción
 * (GitHub Pages sirve el sitio bajo https://sigma-data-club.github.io/website/).
 * Se inyecta en build vía `env.NEXT_PUBLIC_BASE_PATH` en next.config.ts.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefija una ruta de asset de `public/` con el basePath del despliegue.
 * Next.js NO prefija automáticamente los `src` de <Image>, así que hay que
 * aplicarlo manualmente para que las imágenes resuelvan bajo la subruta.
 */
export function asset(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}
