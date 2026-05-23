import type { NextConfig } from "next";

// El sitio se publica en GitHub Pages bajo la subruta del repo:
// https://sigma-data-club.github.io/website/
// En desarrollo (`next dev`) el basePath queda vacío para servir desde la raíz.
const basePath = process.env.NODE_ENV === "production" ? "/website" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    // GitHub Pages no puede optimizar imágenes en tiempo de ejecución.
    unoptimized: true,
  },
  env: {
    // Expone el basePath al cliente para prefijar assets de `public/`.
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
