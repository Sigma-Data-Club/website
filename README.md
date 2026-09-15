# Sigma Data Club — web oficial

Sitio web del **Sigma Data Club**, la comunidad estudiantil de ciencia de datos
(UPV / València). Es una web **estática** construida con Next.js (App Router) y
`output: "export"`: se genera HTML/CSS/JS y se publica en GitHub Pages, sin
servidor ni base de datos.

- **Producción:** https://sigma-data-club.github.io/website/
- **Contenido editable:** `src/content/` (textos, equipo, proyectos, recursos)
- **Lenguaje visual:** [`DESIGN.md`](./DESIGN.md) — léelo antes de tocar estilos o 3D

---

## Índice

- [Cómo está montado](#cómo-está-montado)
- [Puesta en marcha](#puesta-en-marcha)
- [Editar el contenido](#editar-el-contenido)
- [Añadir una página de laboratorio o una propuesta](#añadir-una-página-de-laboratorio-o-una-propuesta)
- [La capa 3D: convenciones](#la-capa-3d-convenciones)
- [Estilos y sistema de diseño](#estilos-y-sistema-de-diseño)
- [Despliegue](#despliegue)
- [Deuda técnica conocida](#deuda-técnica-conocida)
- [Contribuir](#contribuir)

---

## Cómo está montado

### Rutas

| Ruta | Qué es | Contenido en |
| --- | --- | --- |
| `/` | Home editorial: hero, marquee, club, eventos, proyectos, equipo, recursos y únete | `src/content/site.ts` |
| `/lab` | Índice del **laboratorio 3D**: exploraciones de UI/UX con Three.js | `src/content/lab.ts` |
| `/lab/nube`, `/lab/campo`, `/lab/sigma`, `/lab/red` | Una demo a pantalla completa por experimento | `lab.ts` + `src/components/three/lab/*` |
| `/propuestas` | Índice de **propuestas**: dónde integrar más 3D en la home | `src/content/propuestas.ts` |
| `/propuestas/marquee`, `pilares`, `metricas`, `eventos`, `proyectos`, `equipo`, `recursos` | Una demo a pantalla completa por propuesta | `propuestas.ts` + `src/components/three/propuestas/*` |

> `lab` y `propuestas` son **páginas internas de trabajo**: no hay ningún enlace
> desde la home hacia ellas (se llega por URL directa o desde el índice de
> propuestas). Sirven para comparar ideas antes de integrarlas en la home.

Anclas de la home (las que usa la navbar): `#top`, `#club`, `#eventos`,
`#proyectos`, `#equipo`, `#recursos`, `#unete`.

### Stack

| Pieza | Versión | Notas |
| --- | --- | --- |
| Next.js | 16.2.6 | App Router, `output: "export"`, `trailingSlash: true` |
| React | 19.2.4 | |
| Tailwind CSS | v4 | Configuración **desde CSS** (`@theme`), sin `tailwind.config.js` |
| three / @react-three/fiber / drei | 0.184 / 9.6 / 10.7 | Escenas 3D y shaders |
| TypeScript | 5, `strict: true` | Alias `@/*` → `./src/*` |
| pnpm | 11.1.1 | Fijado en `packageManager` de `package.json` |
| Node | 22 (CI) | No hay `.nvmrc`; CI usa Node 22 |

### Estructura

```
src/
├── app/                     # Rutas (una carpeta = una URL)
│   ├── layout.tsx           # <html lang="es">, fuentes, metadata raíz, grano
│   ├── globals.css          # Sistema de diseño (@theme) + utilidades
│   ├── page.tsx             # Home: compone las secciones
│   ├── lab/                 # Laboratorio 3D
│   └── propuestas/          # Propuestas 3D
├── components/
│   ├── sections/            # Secciones de la home + tarjetas
│   ├── three/               # Capa WebGL (pares Canvas + Scene)
│   ├── lab/, propuestas/    # Cromo editorial de las demos (Stage + Frame)
│   └── ...                  # Navbar, Hero, Footer, Marquee, Reveal…
├── content/                 # ← TODO el texto y los datos viven aquí
└── lib/basePath.ts          # Helper `asset()` para el subpath de GitHub Pages
```

---

## Puesta en marcha

Requisitos: **Node 22+** y **pnpm 11** (`corepack enable` si no lo tienes).

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

| Script | Qué hace |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo. En dev el `basePath` es **vacío** (sirve desde `/`) |
| `pnpm build` | Build estático → genera `out/` con todas las URLs bajo `/website` |
| `pnpm lint` | ESLint (flat config, `eslint-config-next`). **Hoy falla**: 10 errores en `main` (ver deuda técnica) |
| `pnpm start` | **No funciona**: `next start` es incompatible con `output: "export"` |

Solo `pnpm build` es una comprobación verde hoy, y es también la única que corre
en CI (incluye el paso de TypeScript de Next).

### Previsualizar el build de producción

`pnpm start` falla a propósito (Next lo dice: *"next start" does not work with
"output: export"*). Como el build de producción prefija todo con `/website`,
hay que servir `out/` **bajo esa subruta**:

```bash
pnpm build
rm -rf /tmp/sigma-preview
mkdir -p /tmp/sigma-preview/website
cp -R out/. /tmp/sigma-preview/website/
npx --yes serve@latest /tmp/sigma-preview
# → http://localhost:3000/website/
```

---

## Editar el contenido

Todo el texto del sitio está en **`src/content/site.ts`**. No hace falta tocar
componentes para cambiar copys, fechas, equipo o recursos.

Ojo: **dos secciones de la home no pintan su lista de contenido** (eventos y
proyectos). Están en modo *placeholder*; ver los avisos más abajo.

| Export | Qué controla | Dónde se ve |
| --- | --- | --- |
| `site` | Nombre, símbolo `σ`, tagline, universidad, email, año | Navbar, Hero, Footer |
| `nav` | Enlaces de la navbar | `Navbar` (desktop y móvil) |
| `hero` | Titular por líneas, intro y los dos CTA | `Hero` |
| `marquee` | Disciplinas de la cinta | `Marquee` |
| `about` | Reclamo, párrafos, 4 pilares y 4 métricas | `About` |
| `events` | Cabecera de la sección de eventos; **`items` no se usa** | `Events` — ver avisos |
| `projects` | Cabecera de la sección de proyectos; **`items` no se usa** | `Projects` — ver avisos |
| `team` | Contador de la comunidad, junta directiva y mentores | `Team` |
| `resources` | 4 categorías de recursos curados (fundamentos, ML & DL, LLMs & agentes, informática) | `ResourceCategories` |
| `join` | Texto y URL del formulario de alta | `Join` |
| `socials` | Redes del pie | `Footer` |

### Tareas frecuentes

**Añadir un proyecto (hoy no se ve).** `projects.items` ya **no se renderiza en
la home**: la PR #2 sustituyó las tarjetas por un placeholder «En construcción».
Puedes añadir objetos ahí, pero no aparecerán. El array sigue vivo en el
laboratorio de propuestas (`/propuestas/proyectos`, que solo usa `items.length`).
La capa 3D de tarjetas (`ProjectCard`, `projectVisuals`, `projectCard/*`) quedó
huérfana y no se monta; ver deuda técnica.

**Añadir o cambiar una persona del equipo.** Edita `team.board.members` (junta)
o `team.mentors.members` (mentores). El campo `image` es una ruta absoluta
desde `public/`, por ejemplo `/sigma-characters-images/lara-ruiz.png`; la imagen
debe existir en `public/sigma-characters-images/`. `linkedin` y `bio` son
opcionales.

**Añadir un recurso.** Edita `resourceCategories` dentro de `site.ts`
(`title`, `kind`, `subtitle`, `href`). **No edites `resources.items`**: se
deriva automáticamente de las categorías con `flatMap`.

**Cambiar la navbar.** `nav` apunta a anclas (`#club`, `#eventos`…). Si
renombras una sección, actualiza también el `id` de la `<section>` en
`src/components/sections/*` o el enlace dejará de funcionar.

### Avisos: dos secciones en modo placeholder

**Eventos** — `src/components/sections/Events.tsx` renderiza un texto fijo
(«Estamos preparando el próximo curso») y **no** dibuja `events.items`. Ese array
solo se usa para contar nodos en la demo `/propuestas/eventos`.

**Proyectos** — desde la PR #2, `src/components/sections/Projects.tsx` renderiza
también un placeholder («Los proyectos están en marcha») y **no** dibuja
`projects.items`. Los títulos de proyecto ya no aparecen en la home.

Es decir: hoy **editar `events.items` o `projects.items` no cambia nada en la web
pública**. Ambas secciones ya tienen montada la retícula fantasma y la tarjeta
central; para publicar el contenido real hay que sustituir esa tarjeta por el
listado (el patrón de la retícula está en `Events.tsx` y `Projects.tsx`).

---

## Añadir una página de laboratorio o una propuesta

Ambas familias siguen el mismo patrón de tres pasos. Ejemplo real: `nube`.

1. **Contenido** — añade la entrada en `src/content/lab.ts` (`labExperiments`) o
   `src/content/propuestas.ts` (`propuestas`) con `slug`, `index`, `title`,
   `intro`, `hint` y `technique`.
2. **Ruta** — crea `src/app/lab/<slug>/page.tsx` (o `propuestas/<slug>`) copiando
   una existente. Es un archivo de ~15 líneas: resuelve el contenido, exporta
   `metadata` y mete el `<Canvas>` dentro del `Stage` (el `Stage` ya monta el
   `Frame` editorial superpuesto):

   ```tsx
   import { LabStage } from "@/components/lab/LabStage";
   import { PointsCanvas } from "@/components/three/lab/PointsCanvas";
   import { getExperiment } from "@/content/lab";

   const exp = getExperiment("nube");
   export const metadata: Metadata = { title: exp.title, description: exp.intro };

   export default function Page() {
     return (
       <LabStage slug="nube">
         <PointsCanvas />
       </LabStage>
     );
   }
   ```

3. **Escena** — crea el par `Canvas` + `Scene` en
   `src/components/three/lab/` (ver la sección siguiente).

No hay rutas dinámicas ni `generateStaticParams`: cada página es un archivo
explícito, y `output: "export"` genera una carpeta con `index.html` por ruta
gracias a `trailingSlash: true`.

---

## La capa 3D: convenciones

### El patrón Canvas + Scene (respetadlo)

Cada efecto WebGL son **dos archivos**:

- `XCanvas.tsx` — `"use client"` + `dynamic(() => import("./XScene"), { ssr: false })`.
  Existe solo para cargar la escena **en el cliente** (evita desajustes de
  hidratación y mantiene ligero el render inicial).
- `XScene.tsx` — contiene el `<Canvas>` de R3F, la cámara, las luces y
  `useFrame`.

Regla: **el `<Canvas>` nunca vive en el `Canvas.tsx`**. Las escenas importan
R3F desde `@/components/three/fiber` (un re-export de `@react-three/fiber`) para
tener un único punto de importación.

| Montado en | Canvas → Scene |
| --- | --- |
| `Hero` | `SurfaceCanvas` → `SurfaceScene` (malla de superficie con shader) |
| `sections/Join` | `JoinCloudCanvas` → `JoinCloudScene` (nube de puntos en forma de σ) |
| `sections/TeamCrowdStage` | `ClubCrowdCanvas` → `ClubCrowdScene` (162 instancias) |
| *sin montar* | `ProjectCardCanvas` → `ProjectCardScene` (6 metáforas) — huérfano desde la PR #2 |
| `/lab/*` | `three/lab/{Points,Field,Sigma,Graph}Canvas` → `…Scene` |
| `/propuestas/*` | `three/propuestas/*Canvas` → `*Scene` (7 demos) |

### Helpers compartidos

| Archivo | Aporta |
| --- | --- |
| `three/fiber.ts` | Re-export de `@react-three/fiber` |
| `three/glsl.ts` | Chunk GLSL `snoise`, colores en hex (`INK_HEX`, `ACCENT_HEX`), `prefersReducedMotion()`, `isSmallScreen()` |
| `three/lab/random.ts` | `mulberry32(seed)`: PRNG determinista (nada de `Math.random` en escenas) |
| `three/sigmaCloud.ts` | Muestreo del glifo σ en un canvas 2D + shaders de la nube de puntos |
| `three/clubCrowdGrid.ts` | Layout de la multitud: columnas, filas, gaps y degradado |
| `three/projectCard/shared.ts` | Materiales de tarjeta/línea, `useCardRig`, `pointerIndex` |
| `three/projectCard/visuals.tsx` | Las 6 metáforas abstractas de las tarjetas de proyecto |

### Movimiento y rendimiento (no negociable)

- **Respeta `prefers-reduced-motion`.** Toda escena hace
  `const [reduced] = useState(prefersReducedMotion)` y aplica
  `frameloop={reduced ? "demand" : "always"}`. Al añadir una escena, cópialo.
- **Modera el 3D en móvil.** `isSmallScreen()` (`< 768px`) desactiva las escenas
  de las tarjetas de proyecto; en su lugar se dibuja un número tipográfico.
- **El 3D es atmósfera, no protagonista.** Siempre detrás del contenido, con
  `aria-hidden` y `pointer-events-none` en el wrapper; los enlaces del cromo
  editorial recuperan el puntero con `pointer-events-auto`.
- **Nada de assets pesados:** las formas se generan por código (muestreo en
  canvas, geometría procedural). No hay modelos `.glb` ni texturas de imagen.
- El cromo editorial de las demos (`LabFrame`, `PropuestaFrame`) es una capa
  superpuesta: no le robes la interacción a la escena.

---

## Estilos y sistema de diseño

`src/app/globals.css` es la **única** fuente de tokens (Tailwind v4 vía
`@theme`, sin archivo de config). El contrato visual está en
[`DESIGN.md`](./DESIGN.md): brutalismo editorial, tema claro, 3 colores, 2
tipografías, esquinas vivas.

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-bg` | `#ffffff` | Fondo |
| `--color-ink` | `#0b0b0b` | Texto y líneas fuertes |
| `--color-accent` | `#36b9ba` | Único acento, con moderación |
| `--color-paper` | `#f2f1ec` | Bloques de contraste |
| `--color-line` | `#e4e3dd` | Líneas de retícula |

Clases utilitarias propias (definidas en `globals.css`, usadas por nombre):

| Clase | Para qué |
| --- | --- |
| `.shell` | Contenedor maestro (máx. 1480px + padding fluido) |
| `.kicker` | Etiqueta editorial en mayúsculas con tracking |
| `.display` | Titular con la tipografía display |
| `.link-underline` | Subrayado animado en acento |
| `.reveal` / `.is-visible` / `.reveal-fast` | Aparición al hacer scroll (vía `<Reveal>`) |
| `.marquee`, `.scroll-hint` | Animaciones de la cinta y del indicador |
| `.grain` | Grano sutil superpuesto (se monta en `layout.tsx`) |

Tipografías: **Space Grotesk** (display) e **Inter** (texto), cargadas con
`next/font/google` en `layout.tsx` y expuestas como `--font-display` /
`--font-sans`.

---

## Despliegue

GitHub Actions construye y publica en **GitHub Pages** en cada push a `main`
(`.github/workflows/deploy.yml`, también lanzable a mano con
`workflow_dispatch`): Node 22 + pnpm → `pnpm build` → `touch out/.nojekyll` →
subida de `out/` → `deploy-pages`.

Detalles que hay que conocer antes de tocar assets o rutas:

- **`basePath` es `/website` en producción y `""` en desarrollo**
  (`next.config.ts`). En dev todo cuelga de la raíz; en producción, de
  `https://sigma-data-club.github.io/website/`.
- **Los assets de `public/` se prefijan a mano.** Next **no** aplica el
  `basePath` a los `src` de `<Image>`. Usa siempre el helper:

  ```tsx
  import { asset } from "@/lib/basePath";
  <Image src={asset(member.image)} alt="" fill />
  ```

  Si escribes `/sigma-characters-images/foo.png` directamente en un componente,
  funcionará en `pnpm dev` y **dará 404 en producción**. (Hoy lo usan
  `TeamMemberCard` y los datos de `site.ts`, que guardan rutas sin prefijo.)
- `images.unoptimized: true` porque GitHub Pages no optimiza en tiempo de
  ejecución.
- `trailingSlash: true` genera URLs tipo directorio (`/lab/nube/index.html`).
- `metadataBase` apunta a `https://sigmadataclub.org`, pero el despliegue real
  es `sigma-data-club.github.io/website`. No hay `CNAME` en el repo: **el
  dominio propio está pendiente** (ver deuda técnica).

---

## Deuda técnica conocida

Cosas reales de hoy, útiles si vas a tocar el repo:

- **Dos secciones no muestran su contenido**: eventos y proyectos renderizan un
  placeholder; `events.items` y `projects.items` son contenido muerto en la web
  pública (ver avisos más arriba).
- **Cadena de código huérfana**: `ProjectCard.tsx` ya no lo importa nadie, y con
  él quedan sin usar `ProjectCardCanvas.tsx`, `ProjectCardScene.tsx`,
  `three/projectCard/*` y `content/projectVisuals.ts`. Borrarla bajaría el lint a
  9 errores (uno de los 10 vive dentro de ese código muerto).
- **`/lab` y `/propuestas` son huérfanas**: ninguna parte de la home enlaza con
  ellas.
- **`pnpm lint` falla con 10 errores** (0 warnings), así que no sirve como
gate previo a una PR. Todos son reglas de React Hooks:
  - `src/components/Reveal.tsx:47` (`react-hooks/refs`)
  - `src/components/sections/ProjectCard.tsx:29` y
    `src/components/sections/TeamCrowdStage.tsx:25` (`set-state-in-effect`)
  - `src/components/three/ClubCrowdScene.tsx:102,129,134` y
    `src/components/three/projectCard/visuals.tsx:179,192,260,265`
    (`react-hooks/immutability`)

  Uno de ellos (`ProjectCard.tsx:29`) está dentro de código ya muerto, así que
  borrar esa cadena deja el lint en 9.

  Y **`pnpm lint` no se ejecuta en CI**, así que el repositorio puede acumular
  errores de lint sin que nadie se entere.
- **Sin tests ni comprobaciones en CI más allá del build**: no hay runner de
tests ni archivos `*.test.*`/`*.spec.*`. La seguridad de tipos en CI depende
enteramente del paso interno de TypeScript de `next build`.
- **`pnpm start` está muerto** en `package.json` (incompatible con
  `output: "export"`). Para previsualizar, servir `out/` como se explica arriba.
- **Restos sin usar**: `public/{next,vercel,globe,file,window}.svg`,
  `src/components/GlassCard.tsx`, `CheckGlyph` en `GlyphIcons.tsx`, el campo
  `metaphor` de `projectVisuals.ts` y los tokens `--color-muted`,
  `--color-accent-soft`, `--color-line-strong`, `--radius-none`.
- **Imágenes huérfanas** en `public/sigma-characters-images/`: `adria-a.png`,
  `carlota-g.png`, `fernando-m.png`, `nouh-k.png`, `pablo-gil.png`,
  `pablog-gandia.png`. Se despliegan aunque nadie las use (peso, no riesgo).
- **TypeScript se resuelve a 5.0.2**, por debajo del **5.1.0** que Next 16
  recomienda: el build lo avisa (`Minimum recommended TypeScript version is
  v5.1.0`) y el rango declarado `^5` no protege contra una subida de exigencia.
- **`out/` local no lleva `.nojekyll`**: lo crea el workflow. Si subes un build
  local a mano, Pages borra el directorio `_next/` y el sitio queda sin estilos
  ni JS.
- **Node local (26) ≠ Node CI (22)**: en local aparece
  `[DEP0205] module.register() is deprecated`. Inofensivo hoy; puede volverse
  duro en una futura major.

### Frágil (funciona hoy, pero se rompe con facilidad)

- **`asset()` es el único guardián del subpath.** `src/content/site.ts` guarda
  rutas de imagen sin prefijo y un único renderizador (`TeamMemberCard`) las
  envuelve con `asset()`. El día que alguien lea `member.image` desde otro
  sitio —una textura de Three.js, un `og:image`, un schema.org, otra tarjeta—
  las fotos darán 404 en Pages sin ningún error local.
- **`metadataBase` apunta a `sigmadataclub.org` sin `CNAME`.** Hoy es inerte
  (no se emite ni `canonical` ni `og:url` ni `og:image`), pero en cuanto se
  añada una imagen Open Graph, la metadata apuntará a un dominio que este
  repositorio no sirve.

---

## Estado verificado (2026-09-15)

Comprobado ejecutando sobre `8304d6b` (merge de la PR #2) más el arreglo de
`site.university` en el working tree:

| Comprobación | Resultado |
| --- | --- |
| `pnpm exec tsc --noEmit` | ✅ 0 errores |
| `pnpm build` | ✅ 0 errores, 17/17 páginas prerenderizadas |
| Las 14 rutas existen como `index.html` en `out/` | ✅ 14/14 |
| Prefijado `/website` de assets en el HTML emitido | ✅ 0 rutas sin prefijar de 360 |
| Enlaces internos y anclas (`#club`, `#unete`…) | ✅ todos resuelven y las 7 anclas existen |
| Sin enlaces al blog desaparecido | ✅ 0 ocurrencias de `blog` en `out/` y en `src/` |
| `university` en el HTML emitido | ✅ «Universitat Politècnica de València» en Hero y Footer; 0 veces «Universidad» |
| Placeholder de proyectos | ✅ renderizado; 0 títulos de `projects.items` en la home |
| `next dev` sirviendo `/`, `/lab`, `/lab/nube`, `/propuestas`, `/propuestas/proyectos`… | ✅ 200 (y 404 correcto en una ruta inventada) |
| `pnpm lint` | ❌ 10 errores (sin cambios desde el merge) |

Lo que estas comprobaciones **no** pueden demostrar (no hay navegador ni GPU en
el pipeline): que las escenas WebGL realmente rendericen, que la hidratación del
cliente sea correcta, el aspecto visual y responsive, el comportamiento en
Safari/móvil, y el sitio publicado en Pages (solo se verificó el artefacto
local).

---

## Contribuir

1. Crea una rama (`feat/…`, `fix/…`, `content/…`).
2. `pnpm dev` para trabajar. Antes de subir, comprueba con `pnpm build` (hoy
   `pnpm lint` **no** pasa: ver deuda técnica).
3. Abre una PR contra `main`. Al hacer merge, el despliegue es automático.

Convenciones del repositorio:

- **Contenido, copys y comentarios en español; identificadores y nombres de
  archivo en inglés.**
- Respeta el sistema de diseño antes de inventar estilos: si algo no encaja,
  se discute en `DESIGN.md`, no se parchea en un componente.
- Un cambio de UI debería caber en una PR revisable; si toca muchas secciones,
  divídelo.

Para trabajo asistido por IA, el repo trae skills de Three.js y de buenas
prácticas de React/Next en `.agents/skills/` (y `.claude/skills/`), con su
procedencia y hashes en `skills-lock.json`.
