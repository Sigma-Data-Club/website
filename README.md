# Sigma Data Club — sitio web

Sitio estático del club de ciencia de datos de la Universitat Politècnica de València.
Desplegado en GitHub Pages desde `main`.

## Stack

- [Astro](https://astro.build) (estático, v4)
- TypeScript estricto
- MDX para los posts del blog
- CSS único en `src/styles/global.css`
- Despliegue vía `withastro/action` a GitHub Pages

## Empezar

```bash
nvm use            # node 20
npm install
npm run dev        # http://localhost:4321
```

## Comandos

| Comando           | Qué hace                           |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Servidor de desarrollo             |
| `npm run build`   | Build estático en `dist/`          |
| `npm run preview` | Sirve `dist/` localmente           |
| `npm run check`   | Type-check + validación de schemas |
| `npm run lint`    | Prettier en modo check             |
| `npm run format`  | Prettier en modo escritura         |

## Cómo añadir contenido

Cada lista del sitio se alimenta de una _content collection_ de Astro. Para añadir
una entrada nueva, copia la plantilla y rellena el frontmatter:

| Sección      | Carpeta                  | Plantilla                            |
| ------------ | ------------------------ | ------------------------------------ |
| Post de blog | `src/content/blog/`      | `src/content/blog/_template.mdx`     |
| Evento       | `src/content/eventos/`   | `src/content/eventos/_template.md`   |
| Proyecto     | `src/content/proyectos/` | `src/content/proyectos/_template.md` |
| Persona      | `src/content/equipo/`    | `src/content/equipo/_template.md`    |
| Track lead   | `src/content/tracks/`    | `src/content/tracks/_template.md`    |
| Recurso      | `src/content/recursos/`  | `src/content/recursos/_template.md`  |

Los ficheros que empiezan por `_` se ignoran. El `slug` viene del nombre del fichero.

## Estructura

```
src/
├── content/         # markdown/MDX con frontmatter validado por Zod
├── layouts/         # BaseLayout, PageLayout, PostLayout
├── components/      # piezas reutilizables (Card, Terminal, EventCard, …)
├── pages/           # routing basado en sistema de ficheros
└── styles/global.css # estilo único, importado en BaseLayout
```

## Despliegue

Cualquier push a `main` dispara `.github/workflows/deploy.yml`, que construye el
sitio y publica el artifact en GitHub Pages.

**Configuración manual una sola vez:** ve a Settings → Pages → Source y selecciona
"GitHub Actions".

## Branding

`public/favicon.svg` y `public/og-default.png` son placeholders. Sustituye con los
assets reales cuando estén listos.
