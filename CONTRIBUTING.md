# Contribuir a sigma-data-club/website

Guía para levantar el proyecto en local y mandar cambios. Pensada para gente que entra por primera vez al repo.

---

## 1. Levantar el proyecto

### 1.1 Requisitos

- **Node.js 20** (fijado en `.nvmrc`)
- **npm** (incluido con Node)
- **Git**

Con `nvm`:

```bash
nvm use   # lee .nvmrc → instala/activa Node 20
```

### 1.2 Clonar e instalar

```bash
git clone https://github.com/Sigma-Data-Club/website.git
cd website
npm install
```

### 1.3 Servidor de desarrollo

```bash
npm run dev
```

Abre <http://localhost:4321/website>.

> El sitio se sirve bajo `/website` porque está configurado así en `astro.config.mjs` (`base: '/website'`) para encajar con la URL de GitHub Pages.

### 1.4 Comandos disponibles

| Comando           | Qué hace                                            |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Servidor con HMR en <http://localhost:4321/website> |
| `npm run build`   | Compila el sitio estático a `dist/`                 |
| `npm run preview` | Sirve `dist/` en local para revisar el build        |
| `npm run check`   | `astro check` — TypeScript + schemas de contenido   |
| `npm run lint`    | `prettier --check .`                                |
| `npm run format`  | `prettier --write .`                                |

### 1.5 Verificar antes de un PR

```bash
npm run check && npm run lint && npm run build
```

Los tres deben pasar sin errores.

---

## 2. Estructura del proyecto

```
.
├── astro.config.mjs        # base "/website", output static
├── public/                 # assets estáticos servidos tal cual
├── src/
│   ├── components/         # *.astro reutilizables
│   ├── content/            # colecciones (md/mdx) + config.ts (Zod)
│   ├── layouts/            # BaseLayout, PageLayout, PostLayout
│   ├── lib/                # helpers (withBase, …)
│   ├── pages/              # routing por sistema de ficheros
│   └── styles/global.css   # toda la CSS del sitio
├── docs/                   # specs históricas
├── CLAUDE.md               # contexto para asistentes IA
└── CONTRIBUTING.md         # este fichero
```

### Colecciones de contenido

Definidas y validadas con Zod en `src/content/config.ts`. Cada carpeta lleva un `_template.{md,mdx}` con la estructura esperada (Astro ignora ficheros que empiezan por `_`).

| Colección   | Formato | Cuerpo usado | Para                                       |
| ----------- | ------- | ------------ | ------------------------------------------ |
| `blog`      | MDX     | sí           | Posts del blog                             |
| `eventos`   | md      | no           | Talleres, charlas, datathons               |
| `proyectos` | md      | no           | Repos del club                             |
| `equipo`    | md      | no           | Personas (`junta`, `track-lead`, `mentor`) |
| `tracks`    | md      | no           | Track leads y grupos de trabajo            |
| `recursos`  | md      | no           | Material curado por la comunidad           |

---

## 3. Flujo de contribución

### 3.1 Issue primero (recomendado)

Para cambios grandes (feature nueva, refactor de estilos, sección nueva): abre un issue antes de codear. Para typos / fixes pequeños: PR directo.

### 3.2 Branch + commit + PR

```bash
git checkout -b feat/mi-cambio
# … edita …
npm run check && npm run lint
git add <archivos>
git commit -m "feat(eventos): añade taller de DuckDB"
git push -u origin feat/mi-cambio
gh pr create
```

- `main` está protegida — todo entra por PR.
- Mensajes de commit en estilo [Conventional Commits](https://www.conventionalcommits.org/) en español: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`.
- PR pequeño y enfocado. Un cambio = un PR.
- Título de PR ≤ 70 caracteres. Detalles en el cuerpo.

### 3.3 Añadir contenido nuevo

1. Copia el `_template.{md,mdx}` de la colección correspondiente.
2. Renómbralo — el slug es el nombre del fichero (sin extensión).
3. Rellena el frontmatter siguiendo el schema en `src/content/config.ts`.
4. Para blog: el cuerpo del MDX es el contenido del post.
5. `npm run check` para validar el schema.

**Borradores de blog:** `draft: true` en el frontmatter → ignorado en producción.

### 3.4 Tocar diseño / componentes

- Layouts en `src/layouts/`. Envuelve siempre con `BaseLayout` (directa o vía `PageLayout` / `PostLayout`).
- Componentes en `src/components/`.
- Estilos: **un único** `src/styles/global.css`, importado una vez en `BaseLayout`. Estética terminal/hacker — no la refactorices sin razón clara.
- Sin frameworks de cliente (React, Vue, Svelte). Solo `.astro` + un script inline para el theme toggle.

---

## 4. Convenciones

- **Idioma:** español. Todo el copy en `<html lang="es">`.
- **Voz editorial:** minúsculas, metáforas de CLI (`./join.sh`, `git push antes de hablar`).
- **Numeración de secciones:** cada `<section>` lleva un `.section-num` tipo `[ 02 / 04 ]`. Si añades o quitas una sección en una página, actualiza el contador en todas las de esa página.
- **Brand mark:** la letra `σ` literal dentro de `<span class="brand-mark">`.
- **Fechas y horas de eventos:** siempre con `timeZone: 'Europe/Madrid'` en `toLocaleDateString` / `toLocaleTimeString`. El build corre en UTC y desplaza las horas si no.
- **Bloques de terminal** (`.terminal-body`) usan `white-space: pre`. Para inyectar markup, declara una constante con el HTML literal y pásala con `set:html` — la indentación de JSX se cuela como espacios. Ejemplos: `src/pages/index.astro`, `src/pages/unete.astro`, `src/pages/sobre.astro`.
- **Theme toggle:** botón muestra el tema **destino**, no el actual (`[ light ]` mientras estás en dark). LocalStorage key: `sdc-theme`.
- **Accesibilidad:** respeta `prefers-reduced-motion` (ya configurado en `global.css`). No añadas animaciones agresivas.
- **Responsive:** todo debe funcionar a 360px de ancho sin scroll horizontal. Tablas dentro de `.table-wrap`.

---

## 5. Despliegue

- Push a `main` → dispara `.github/workflows/deploy.yml`.
- Build con `withastro/action@v3` → publica en GitHub Pages.
- URL en producción: <https://sigma-data-club.github.io/website>.
- Settings → Pages → Source: **GitHub Actions** (configuración manual hecha una vez).

No hay deploy preview por PR. Para validar el build de un PR, corre `npm run build && npm run preview` en local.

---

## 6. Reportar bugs

Issue en <https://github.com/Sigma-Data-Club/website/issues> con:

- Pasos para reproducir.
- Captura si es visual.
- Navegador + tamaño de viewport (móvil / desktop) si es de layout.
- Rama / commit en que aparece.

---

## 7. Dudas

Pregunta en el canal `#web` del Discord del club, o abre un issue con la etiqueta `question`.
