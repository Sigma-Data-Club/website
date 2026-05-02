# Astro Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Sigma Data Club static site from eight hand-written HTML pages to an Astro static site with content collections backing every list-shaped section, while keeping the visual design (the existing `styles.css`) byte-for-byte identical and preserving GitHub Pages deployment.

**Architecture:** Astro `output: 'static'`. Single global stylesheet. Six Zod-validated content collections (`blog`, `eventos`, `proyectos`, `equipo`, `tracks`, `recursos`). Theme toggle is an inline pre-paint script in the root layout. Deploy via official `withastro/action` to GitHub Pages.

**Tech Stack:** Astro · TypeScript (strict) · MDX (blog only) · Zod schemas · Prettier · GitHub Actions · Node 20.

**Spec:** `docs/superpowers/specs/2026-05-02-astro-scaffold-design.md`. The spec is the source of truth for schemas, file tree, and decisions; this plan implements it phase-by-phase.

**Verification approach:** Each task ends with running `npm run dev` (or `astro check`) and a visual check against the legacy file at `git show fa6676a:<file>`. The legacy site lives in commit `fa6676a` as the baseline; phase 12 deletes the working-tree copies but git history retains them.

---

## Task 1: Astro Skeleton + Tooling Baseline

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `astro.config.mjs`
- Create: `src/env.d.ts`
- Create: `src/pages/index.astro` (placeholder)
- Create: `.nvmrc`
- Create: `.editorconfig`
- Create: `.prettierrc.json`
- Create: `.prettierignore`
- Modify: `.gitignore`

- [ ] **Step 1.1: Initialize package.json**

Run from repo root:

```bash
npm init -y
```

- [ ] **Step 1.2: Install Astro and integrations**

```bash
npm install astro@^4 @astrojs/mdx@^3 @astrojs/sitemap@^3 @astrojs/rss@^4
npm install -D @astrojs/check@^0.9 typescript@^5 prettier@^3 prettier-plugin-astro@^0.14
```

Expected: dependencies appear in `package.json`. `package-lock.json` created.

Note: Astro is pinned to `^4` because this plan uses the v4 collections API (`type: 'content' | 'data'`, `post.slug`, `defineCollection` with inline schema). Astro 5 introduced the Content Layer API and renamed `.slug` to `.id`; if you upgrade later, expect to update `getStaticPaths` and `rss.xml.ts` accordingly.

- [ ] **Step 1.3: Replace `package.json` scripts**

Open `package.json` and replace the `scripts` object with:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "check": "astro check",
  "lint": "prettier --check .",
  "format": "prettier --write ."
}
```

Also set `"type": "module"` and `"private": true` at the top level.

- [ ] **Step 1.4: Write `tsconfig.json`**

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 1.5: Write `astro.config.mjs`**

Create `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sigma-data-club.github.io',
  output: 'static',
  integrations: [mdx(), sitemap()],
  trailingSlash: 'never',
});
```

- [ ] **Step 1.6: Write `src/env.d.ts`**

Create `src/env.d.ts`:

```ts
/// <reference path="../.astro/types.d.ts" />
```

- [ ] **Step 1.7: Write placeholder `src/pages/index.astro`**

Create `src/pages/index.astro`:

```astro
---
---
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Sigma Data Club</title>
  </head>
  <body>
    <p>scaffold ok</p>
  </body>
</html>
```

- [ ] **Step 1.8: Write `.nvmrc`**

Create `.nvmrc`:

```
20
```

- [ ] **Step 1.9: Write `.editorconfig`**

Create `.editorconfig`:

```
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

- [ ] **Step 1.10: Write `.prettierrc.json`**

Create `.prettierrc.json`:

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    { "files": "*.astro", "options": { "parser": "astro" } }
  ]
}
```

- [ ] **Step 1.11: Write `.prettierignore`**

Create `.prettierignore`:

```
dist
.astro
node_modules
package-lock.json
src/styles/global.css
```

(`global.css` is excluded because it ports verbatim from legacy `styles.css` in Task 2 — preserving formatting matters for visual fidelity.)

- [ ] **Step 1.12: Update `.gitignore`**

Replace contents of `.gitignore`:

```
.DS_Store
node_modules
dist
.astro
.env
.env.production
*.log
```

- [ ] **Step 1.13: Verify dev server**

Run:

```bash
npm run dev
```

Expected: server starts on `http://localhost:4321`, page shows "scaffold ok". Stop the server with Ctrl+C.

- [ ] **Step 1.14: Verify build + check**

```bash
npm run check
npm run build
```

Expected: `astro check` reports 0 errors. `astro build` outputs to `dist/` with no errors.

- [ ] **Step 1.15: Commit**

```bash
git add .gitignore .nvmrc .editorconfig .prettierrc.json .prettierignore \
  package.json package-lock.json tsconfig.json astro.config.mjs src/env.d.ts \
  src/pages/index.astro
git commit -m "chore: scaffold Astro project with TS strict + MDX + sitemap"
```

---

## Task 2: Global Styles + BaseLayout + Header / Footer / ThemeToggle

**Files:**
- Create: `src/styles/global.css` (copy of legacy `styles.css`)
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/ThemeToggle.astro`
- Modify: `src/pages/index.astro` (use BaseLayout)

- [ ] **Step 2.1: Copy legacy stylesheet verbatim**

```bash
mkdir -p src/styles
cp styles.css src/styles/global.css
```

Expected: `src/styles/global.css` is byte-identical to `styles.css`. Do not reformat.

- [ ] **Step 2.2: Write `src/components/Nav.astro`**

```astro
---
const { currentPath } = Astro.props as { currentPath: string };

const links = [
  { href: '/', label: 'inicio', match: '/' },
  { href: '/sobre', label: 'sobre', match: '/sobre' },
  { href: '/equipo', label: 'equipo', match: '/equipo' },
  { href: '/eventos', label: 'eventos', match: '/eventos' },
  { href: '/proyectos', label: 'proyectos', match: '/proyectos' },
  { href: '/blog', label: 'blog', match: '/blog' },
  { href: '/recursos', label: 'recursos', match: '/recursos' },
  { href: '/unete', label: 'únete', match: '/unete' },
];

function isActive(match: string, path: string): boolean {
  if (match === '/') return path === '/' || path === '';
  return path === match || path.startsWith(match + '/');
}
---
<nav class="nav">
  {links.map((l) => (
    <a href={l.href} class={isActive(l.match, currentPath) ? 'active' : undefined}>{l.label}</a>
  ))}
</nav>
```

- [ ] **Step 2.3: Write `src/components/ThemeToggle.astro`**

```astro
<button class="theme-toggle" type="button">[ light ]</button>
```

(The button label is set to `[ light ]` to match the legacy initial server-rendered state. The inline script in BaseLayout overwrites it pre-paint based on the actual current theme.)

- [ ] **Step 2.4: Write `src/components/Header.astro`**

```astro
---
import Nav from './Nav.astro';
import ThemeToggle from './ThemeToggle.astro';
const currentPath = Astro.url.pathname;
---
<header class="site-header">
  <div class="container">
    <a class="brand" href="/">
      <span class="brand-mark">σ</span>
      <span class="brand-name">Sigma <b>Data&nbsp;Club</b></span>
    </a>
    <Nav currentPath={currentPath} />
    <ThemeToggle />
  </div>
</header>
```

- [ ] **Step 2.5: Write `src/components/Footer.astro`**

Port the legacy footer from `index.html` lines 226-265 verbatim, replacing `.html` hrefs with extension-less paths:

```astro
<footer class="site-footer">
  <div class="container">
    <div>
      <div class="brand" style="margin-bottom: 0.6rem;">
        <span class="brand-mark">σ</span>
        <span class="brand-name">Sigma <b>Data&nbsp;Club</b></span>
      </div>
      <p class="muted" style="font-size: 0.85rem; max-width: 38ch;">
        Club estudiantil de ciencia de datos.<br />
        Universidad Politécnica de Valencia.
      </p>
    </div>
    <div>
      <h4>Navegar</h4>
      <ul>
        <li><a href="/sobre">Sobre</a></li>
        <li><a href="/equipo">Equipo</a></li>
        <li><a href="/eventos">Eventos</a></li>
        <li><a href="/proyectos">Proyectos</a></li>
      </ul>
    </div>
    <div>
      <h4>Recursos</h4>
      <ul>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/recursos">Material</a></li>
        <li><a href="/unete">Únete</a></li>
      </ul>
    </div>
    <div>
      <h4>Contacto</h4>
      <ul>
        <li><a href="mailto:hola@sigma-data.upv.es">hola@sigma-data.upv.es</a></li>
        <li><a href="https://github.com/sigma-data-club">github.com/sigma-data-club</a></li>
        <li><a href="https://instagram.com/sigma.dataclub">@sigma.dataclub</a></li>
      </ul>
    </div>
    <div class="bottom">
      <span>© 2025 Sigma Data Club · UPV. Código bajo licencia MIT.</span>
      <span>build 3.2.1 · last deploy 2025-10-21</span>
    </div>
  </div>
</footer>
```

- [ ] **Step 2.6: Write `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description?: string;
}
const { title, description } = Astro.props;
---
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
    <script is:inline>
      (function () {
        var KEY = 'sdc-theme';
        var root = document.documentElement;
        var t = null;
        try { t = localStorage.getItem(KEY); } catch (e) {}
        if (!t) {
          t = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
            ? 'light' : 'dark';
        }
        root.setAttribute('data-theme', t);
        document.addEventListener('DOMContentLoaded', function () {
          var btn = document.querySelector('.theme-toggle');
          if (!btn) return;
          btn.textContent = t === 'light' ? '[ dark ]' : '[ light ]';
          btn.addEventListener('click', function () {
            var cur = root.getAttribute('data-theme') || 'dark';
            var next = cur === 'light' ? 'dark' : 'light';
            root.setAttribute('data-theme', next);
            btn.textContent = next === 'light' ? '[ dark ]' : '[ light ]';
            try { localStorage.setItem(KEY, next); } catch (e) {}
          });
        });
      })();
    </script>
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 2.7: Update `src/pages/index.astro` to use BaseLayout**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Sigma Data Club — UPV">
  <section class="hero">
    <div class="container">
      <h1>scaffold ok</h1>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2.8: Verify visually**

Run `npm run dev`. Open `http://localhost:4321/`. Confirm:
- Background grid + scanlines visible (dark theme by default).
- Header brand `σ Sigma Data Club` appears with nav links.
- Theme toggle button shows `[ light ]`. Click it: page goes light, button shows `[ dark ]`. Reload: light persists.
- No flash of wrong theme on hard reload.
- Footer renders with all four columns.

Stop server.

- [ ] **Step 2.9: Verify check + build**

```bash
npm run check && npm run build
```

Expected: 0 errors.

- [ ] **Step 2.10: Commit**

```bash
git add src/styles/global.css src/layouts/BaseLayout.astro \
  src/components/Header.astro src/components/Nav.astro \
  src/components/Footer.astro src/components/ThemeToggle.astro \
  src/pages/index.astro
git commit -m "feat: add BaseLayout with header, footer, theme toggle"
```

---

## Task 3: Static Pages — `sobre`, `unete`

**Files:**
- Create: `src/layouts/PageLayout.astro`
- Create: `src/components/Eyebrow.astro`
- Create: `src/components/SectionHead.astro`
- Create: `src/pages/sobre.astro`
- Create: `src/pages/unete.astro`

- [ ] **Step 3.1: Write `src/components/Eyebrow.astro`**

```astro
---
const { children } = Astro.slots;
---
<span class="eyebrow"><slot /></span>
```

- [ ] **Step 3.2: Write `src/components/SectionHead.astro`**

```astro
---
interface Props {
  eyebrow: string;
  title: string;
  num?: string; // e.g. "01 / 04"
}
const { eyebrow, title, num } = Astro.props;
---
<div class="section-head">
  <div>
    <span class="eyebrow">{eyebrow}</span>
    <h2>{title}</h2>
  </div>
  {num && <span class="section-num">[ {num} ]</span>}
</div>
```

- [ ] **Step 3.3: Write `src/layouts/PageLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  description?: string;
  eyebrow: string;
  heading: string;
  lead?: string;
}
const { title, description, eyebrow, heading, lead } = Astro.props;
---
<BaseLayout title={title} description={description}>
  <section class="page-head">
    <div class="container">
      <span class="eyebrow">{eyebrow}</span>
      <h1 set:html={heading} />
      {lead && <p class="lead" set:html={lead} />}
    </div>
  </section>
  <slot />
</BaseLayout>
```

(`set:html` is used because legacy headings/leads contain markup like `<br>`, `<em>`, `&nbsp;`. The content is author-controlled, not user input.)

- [ ] **Step 3.4: Port `sobre.html` to `src/pages/sobre.astro`**

Read legacy with `git show fa6676a:sobre.html`. Move every `<section>` inside `<main>` (excluding the `page-head` section, which becomes PageLayout props) into the slot. Replace `.html` hrefs with extension-less paths.

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
---
<PageLayout
  title="Sobre · Sigma Data Club"
  eyebrow="/ sobre"
  heading="Una comunidad de estudiantes<br>que escribe código antes de hablar."
  lead="<!-- paste lead from legacy sobre.html line 41-ish -->"
>
  <!-- paste each remaining <section>...</section> from legacy sobre.html, in order -->
</PageLayout>
```

The implementer reads the legacy file and pastes each section verbatim. Convert `<a href="X.html">` to `<a href="/X">`. Convert self-closing tags as needed for JSX (`<br>` → `<br />`, `<img>` → `<img />`).

- [ ] **Step 3.5: Port `unete.html` to `src/pages/unete.astro`**

Same approach as 3.4, reading from `git show fa6676a:unete.html`. Preserve form markup verbatim, including any `action`/`method`/`name` attributes. The form's backend behavior is explicitly preserved as-is (spec open-item #2).

- [ ] **Step 3.6: Verify visually**

Run `npm run dev`. Open `/sobre` and `/unete`. Open the legacy file in another browser window via `git show fa6676a:sobre.html | python3 -c "import sys,webbrowser,tempfile,os; f=tempfile.NamedTemporaryFile('w',suffix='.html',delete=False); f.write(sys.stdin.read()); f.close(); webbrowser.open('file://'+f.name)"` (or open `sobre.html` directly while still tracked at the working-tree path). Confirm:
- Page chrome (header, footer, theme toggle) consistent with index.
- Page-head eyebrow + h1 + lead match legacy.
- All sections present and visually identical.
- Active nav link is `sobre` (or `únete`).

- [ ] **Step 3.7: Verify check + build**

```bash
npm run check && npm run build
```

- [ ] **Step 3.8: Commit**

```bash
git add src/layouts/PageLayout.astro src/components/Eyebrow.astro \
  src/components/SectionHead.astro src/pages/sobre.astro src/pages/unete.astro
git commit -m "feat: port sobre + unete static pages"
```

---

## Task 4: Content Collections — Schemas + Templates

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/blog/_template.mdx`
- Create: `src/content/eventos/_template.md`
- Create: `src/content/proyectos/_template.md`
- Create: `src/content/equipo/_template.md`
- Create: `src/content/tracks/_template.md`
- Create: `src/content/recursos/_template.md`

- [ ] **Step 4.1: Write `src/content/config.ts`**

```ts
import { defineCollection, reference, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      authors: z.array(reference('equipo')),
      tags: z.array(z.string()).default([]),
      excerpt: z.string(),
      draft: z.boolean().default(false),
      hero: image().optional(),
    }),
});

const eventos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    durationMin: z.number().default(120),
    location: z.string(),
    type: z.enum(['workshop', 'charla', 'datathon', 'social', 'open hack']),
    speaker: z.string(),
    description: z.string(),
    capacity: z.string().optional(),
    attendees: z.number().optional(),
    signupUrl: z.string().url().optional(),
    materialUrl: z.string().url().optional(),
  }),
});

const proyectos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    thumb: z.string(),
    status: z.enum(['en curso', 'publicado', 'archivado']),
    category: z.enum(['NLP', 'Visión', 'ML', 'Open Data', 'MLOps', 'Otro']),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    contribCount: z.number(),
    repoUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    contributors: z.array(reference('equipo')).optional(),
  }),
});

const equipo = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    kind: z.enum(['junta', 'mentor']),
    role: z.string(),
    initials: z.string(),
    bio: z.string(),
    grade: z.string().optional(),
    github: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    period: z.string().optional(),
    order: z.number().default(0),
  }),
});

const tracks = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    lead: z.string(),
    program: z.string(),
    focus: z.string(),
    status: z.enum(['activo', 'en formación', 'vacante']),
    order: z.number().default(0),
  }),
});

const recursos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    by: z.string().optional(),
    group: z.enum([
      'fundamentos',
      'machine learning',
      'nlp y llms',
      'datos & sql',
      'mlops & producción',
      'datasets',
      'apuntes',
    ]),
    kind: z.enum(['curso', 'libro', 'paper', 'vídeo', 'guía', 'repo', 'dataset']),
    url: z.string().url(),
    order: z.number().default(0),
  }),
});

export const collections = { blog, eventos, proyectos, equipo, tracks, recursos };
```

(Astro 4's `type: 'data'` only accepts JSON/YAML/TOML — not `.md`. Since we author every collection in `.md` for editorial consistency, all six collections use `type: 'content'`. The non-blog collections never call `.render()`, so the empty body costs nothing.)

- [ ] **Step 4.2: Write `src/content/blog/_template.mdx`**

```mdx
---
title: 'Título del post'
date: 2026-01-15
authors: ['clara-reig'] # slug del fichero en src/content/equipo/
tags: ['python', 'ejemplo']
excerpt: 'Una o dos frases que aparecen en la lista del blog.'
draft: true
---

import { Image } from 'astro:assets';

# Cuerpo del post en MDX

Puedes importar componentes Astro y usar Markdown estándar.
```

- [ ] **Step 4.3: Write `src/content/eventos/_template.md`**

```md
---
title: 'Workshop · Tu primer modelo en PyTorch'
date: 2026-02-12T19:00:00+01:00
durationMin: 120
location: 'Aula 1G 2.4 · ETSINF'
type: workshop
speaker: 'Lucía Fuentes'
description: 'Una o dos frases describiendo el contenido.'
capacity: '0 / 50'
signupUrl: 'https://example.com/signup'
---
```

- [ ] **Step 4.4: Write `src/content/proyectos/_template.md`**

```md
---
title: 'nombre-del-proyecto'
thumb: 'NLP'
status: 'en curso'
category: 'NLP'
tags: ['polars', 'spacy']
summary: 'Dos a cuatro frases que aparecen en la card de la lista.'
contribCount: 3
repoUrl: 'https://github.com/sigma-data-club/repo'
---
```

- [ ] **Step 4.5: Write `src/content/equipo/_template.md`**

```md
---
name: 'Nombre Apellidos'
kind: 'junta' # 'junta' | 'mentor'
role: 'presidenta'
initials: 'NA'
bio: 'Frase corta describiendo a la persona.'
grade: '4.º GIIC'
github: 'https://github.com/usuario'
linkedin: 'https://linkedin.com/in/usuario'
period: '2025/26'
order: 1
---
```

- [ ] **Step 4.6: Write `src/content/tracks/_template.md`**

```md
---
name: 'NLP'
lead: 'Pablo Esteve Roig'
program: 'Máster IA'
focus: 'RAG sobre actas UPV'
status: 'activo'
order: 1
---
```

- [ ] **Step 4.7: Write `src/content/recursos/_template.md`**

```md
---
title: 'Hands-On Machine Learning (3.ª ed.)'
by: 'Aurélien Géron · libro de referencia del club'
group: 'machine learning'
kind: 'libro'
url: 'https://example.com'
order: 1
---
```

- [ ] **Step 4.8: Verify schemas validate with empty collections**

```bash
npm run check
```

Expected: 0 errors. Astro generates `.astro/types.d.ts` containing typed `getCollection()` signatures.

- [ ] **Step 4.9: Commit**

```bash
git add src/content/
git commit -m "feat: add content collection schemas + templates"
```

---

## Task 5: Migrate `equipo` + `tracks`

**Files:**
- Create: `src/content/equipo/{slug}.md` × 10 (6 junta + 4 mentor)
- Create: `src/content/tracks/{slug}.md` × 6
- Create: `src/components/PersonCard.astro`
- Create: `src/components/TrackTable.astro`
- Create: `src/pages/equipo.astro`

Reference data lives in commit `fa6676a`, file `equipo.html`.

- [ ] **Step 5.1: Create six junta entries**

For each `<article class="person">` in the first `.grid.grid-3` (legacy lines 55-110), create one file under `src/content/equipo/` whose name is the kebab-case slug of the person's first+last name. Example: `clara-reig.md`:

```md
---
name: 'Clara Reig Navarro'
kind: 'junta'
role: 'presidenta'
initials: 'CR'
bio: '4.º GIIC. Le interesa el procesamiento del lenguaje y los sistemas distribuidos. Antes lideró el track de NLP. Programa en Rust por gusto.'
grade: '4.º GIIC'
period: '2025/26'
order: 1
---
```

Repeat for: Joan Martí Bonet (order 2, vicepresidente · técnico), Andrea Soler Pérez (3, secretaria · comunicación), Diego Vidal Marqués (4, tesorero), Lucía Fuentes Aguilar (5, vocal · formación), Marc Olcina Ribera (6, vocal · proyectos). Use exact bio text from the legacy file. Omit `github`/`linkedin` fields when the legacy `href="#"` (placeholder).

- [ ] **Step 5.2: Create four mentor entries**

For each `<article class="person">` in the third `.grid.grid-2` (legacy lines 192-225), create one file with `kind: 'mentor'`, no `period`, no `grade`. Example `pilar-guzman.md`:

```md
---
name: 'Dra. Pilar Guzmán Ortí'
kind: 'mentor'
role: 'profesora · DSIC'
initials: 'PG'
bio: 'Profesora titular del Departamento de Sistemas Informáticos y Computación. Mentora académica del club desde 2022. Especialista en sistemas de recomendación.'
order: 1
---
```

Repeat for: Vicent Climent Asensi (alumni · 2018, order 2), Elena Mompó Sanchís (alumni · 2020, order 3), Dr. Ramón Talens Mira (profesor · IUMPA, order 4).

- [ ] **Step 5.3: Create six track entries**

For each `<tr>` in the legacy table (lines 134-176), create `src/content/tracks/{slug}.md`. Example `nlp.md`:

```md
---
name: 'NLP'
lead: 'Pablo Esteve Roig'
program: 'Máster IA'
focus: 'RAG sobre actas UPV'
status: 'activo'
order: 1
---
```

Continue for: `vision.md` (Nuria Pastor Llopis, 4.º GIIC, Detección de aforo v2, activo, 2), `mlops.md` (Iván Costa Beltrán, 5.º GIIC, Pipeline interno con Prefect, activo, 3), `open-data.md` (Helena Tormo Vives, 3.º ADE, Visualización Valenbisi, activo, 4), `estadistica.md` (Roberto Llinares Gil, 4.º Matemáticas, Causal inference workshop, en formación, 5), `bio.md` (Sofía Ramírez Cano, 4.º Biotecnología, "—", vacante, 6).

- [ ] **Step 5.4: Write `src/components/PersonCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props {
  person: CollectionEntry<'equipo'>;
}
const { person } = Astro.props;
const { name, role, initials, bio, github, linkedin } = person.data;
---
<article class="person">
  <div class="avatar">{initials}</div>
  <div>
    <div class="name">{name}</div>
    <div class="role">{role}</div>
  </div>
  <div class="bio">{bio}</div>
  {(github || linkedin) && (
    <div class="links">
      {github && <a href={github}>github</a>}
      {linkedin && <a href={linkedin}>linkedin</a>}
    </div>
  )}
</article>
```

- [ ] **Step 5.5: Write `src/components/TrackTable.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props {
  tracks: CollectionEntry<'tracks'>[];
}
const { tracks } = Astro.props;

const pillClass = (s: string) =>
  s === 'activo' ? 'pill' : s === 'en formación' ? 'pill warn' : 'pill dim';
---
<table class="tbl">
  <thead>
    <tr>
      <th>track</th>
      <th>lead</th>
      <th>grado / programa</th>
      <th>foco 2025/26</th>
      <th>estado</th>
    </tr>
  </thead>
  <tbody>
    {tracks.map((t) => (
      <tr>
        <td><strong>{t.data.name}</strong></td>
        <td>{t.data.lead}</td>
        <td>{t.data.program}</td>
        <td>{t.data.focus}</td>
        <td><span class={pillClass(t.data.status)}>{t.data.status}</span></td>
      </tr>
    ))}
  </tbody>
</table>
```

- [ ] **Step 5.6: Write `src/pages/equipo.astro`**

```astro
---
import { getCollection } from 'astro:content';
import PageLayout from '../layouts/PageLayout.astro';
import SectionHead from '../components/SectionHead.astro';
import PersonCard from '../components/PersonCard.astro';
import TrackTable from '../components/TrackTable.astro';

const all = await getCollection('equipo');
const junta = all.filter((p) => p.data.kind === 'junta').sort((a, b) => a.data.order - b.data.order);
const mentores = all
  .filter((p) => p.data.kind === 'mentor')
  .sort((a, b) => a.data.order - b.data.order);
const tracks = (await getCollection('tracks')).sort((a, b) => a.data.order - b.data.order);
---
<PageLayout
  title="Equipo · Sigma Data Club"
  eyebrow="/ equipo"
  heading="Quién mantiene esto en marcha."
  lead="La junta es rotativa: se renueva cada curso académico en asamblea abierta. Los <em>track leads</em> coordinan los grupos de trabajo. Cualquier socio puede proponerse para los dos roles."
>
  <section>
    <div class="container">
      <SectionHead eyebrow="Junta directiva" title="Curso 2025/26." num="01 / 03" />
      <div class="grid grid-3">
        {junta.map((p) => <PersonCard person={p} />)}
      </div>
    </div>
  </section>

  <section>
    <div class="container">
      <SectionHead eyebrow="Track leads" title="Coordinan los grupos de trabajo." num="02 / 03" />
      <TrackTable tracks={tracks} />
    </div>
  </section>

  <section>
    <div class="container">
      <SectionHead eyebrow="Mentores" title="Alumni y profesorado que echan una mano." num="03 / 03" />
      <div class="grid grid-2">
        {mentores.map((p) => <PersonCard person={p} />)}
      </div>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="ascii-rule" />
      <div class="row" style="justify-content: space-between;">
        <div>
          <h2 style="margin-bottom: 0.5rem;">¿Quieres entrar en la junta el curso que viene?</h2>
          <p class="muted">Las elecciones se celebran cada mayo, en asamblea abierta. Cualquier socio activo puede presentarse.</p>
        </div>
        <a href="/unete" class="btn btn-ghost">hazte socio primero</a>
      </div>
    </div>
  </section>
</PageLayout>
```

- [ ] **Step 5.7: Verify visually**

Run `npm run dev`. Open `/equipo`. Compare against `git show fa6676a:equipo.html` (open in another tab). Confirm:
- Three sections in correct order with correct `[ NN / 03 ]` labels.
- Junta: 6 cards, names + roles + bios match.
- Tracks table: 6 rows, status pills color correctly (`activo`/`en formación`/`vacante`).
- Mentores: 4 cards, no github/linkedin links rendered.

- [ ] **Step 5.8: Verify check + build**

```bash
npm run check && npm run build
```

- [ ] **Step 5.9: Commit**

```bash
git add src/content/equipo/ src/content/tracks/ \
  src/components/PersonCard.astro src/components/TrackTable.astro \
  src/pages/equipo.astro
git commit -m "feat: migrate equipo + tracks to content collections"
```

---

## Task 6: Migrate `recursos`

**Files:**
- Create: `src/content/recursos/{slug}.md` × ~25
- Create: `src/components/ResourceItem.astro`
- Create: `src/components/ResourceGroup.astro`
- Create: `src/pages/recursos.astro`

Source: `git show fa6676a:recursos.html`. The legacy file has 7 `.res-group` blocks. Each contains 3-4 `.res-item` rows.

- [ ] **Step 6.1: Inventory legacy resources**

Run:

```bash
git show fa6676a:recursos.html > /tmp/recursos.html
grep -c 'class="res-item"' /tmp/recursos.html
```

Note the count. Open `/tmp/recursos.html` (or read it) and list every resource per group. The seven groups are: `fundamentos`, `machine learning`, `nlp y llms`, `datos & sql`, `mlops & producción`, `datasets`, `apuntes` (legacy heading "nuestros propios apuntes" maps to `apuntes`).

- [ ] **Step 6.2: Create one `.md` per resource**

For each `.res-item`, create a file. Slug = kebab-case of title, prefixed with two-digit group order to control sort within group. Example `src/content/recursos/01-fund-cs50p.md`:

```md
---
title: 'CS50P · Introduction to Programming with Python'
by: 'David Malan, Harvard'
group: 'fundamentos'
kind: 'curso'
url: 'https://cs50.harvard.edu/python/'
order: 1
---
```

If the legacy file has no real URL (placeholder `#`), use a real URL only if the implementer can verify it; otherwise omit and ask the user. **Do not invent URLs.**

Repeat for every entry. `kind` values appear verbatim in legacy `<span class="kind">` and must match the schema enum (`curso`, `libro`, `paper`, `vídeo`, `guía`, `repo`, `dataset`). The legacy file uses `vídeo` with the accent.

- [ ] **Step 6.3: Write `src/components/ResourceItem.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props {
  item: CollectionEntry<'recursos'>;
}
const { item } = Astro.props;
const { title, by, kind, url } = item.data;
---
<a class="res-item" href={url} target="_blank" rel="noopener">
  <span class="kind">{kind}</span>
  <div>
    <span class="title">{title}</span>
    {by && <span class="by">— {by}</span>}
  </div>
  <span class="arrow">→</span>
</a>
```

(Note: legacy markup wraps each `.res-item` in a `<div>`, not an `<a>`. Wrapping in `<a>` here is a small UX upgrade — the whole row becomes clickable. CSS does not need to change because `.res-item` selectors do not depend on element type.)

If the implementer prefers byte-identical markup, swap `<a class="res-item">` for `<div class="res-item">` and wrap only the title in an anchor.

- [ ] **Step 6.4: Write `src/components/ResourceGroup.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import ResourceItem from './ResourceItem.astro';

interface Props {
  heading: string;
  items: CollectionEntry<'recursos'>[];
}
const { heading, items } = Astro.props;
---
<div class="res-group">
  <h3>{heading}</h3>
  <div class="res-list">
    {items.map((it) => <ResourceItem item={it} />)}
  </div>
</div>
```

- [ ] **Step 6.5: Write `src/pages/recursos.astro`**

```astro
---
import { getCollection } from 'astro:content';
import PageLayout from '../layouts/PageLayout.astro';
import ResourceGroup from '../components/ResourceGroup.astro';

const groupOrder = [
  'fundamentos',
  'machine learning',
  'nlp y llms',
  'datos & sql',
  'mlops & producción',
  'datasets',
  'apuntes',
] as const;

const groupHeadings: Record<(typeof groupOrder)[number], string> = {
  fundamentos: 'fundamentos',
  'machine learning': 'machine learning',
  'nlp y llms': 'nlp y llms',
  'datos & sql': 'datos & sql',
  'mlops & producción': 'mlops & producción',
  datasets: 'datasets abiertos (recomendados)',
  apuntes: 'nuestros propios apuntes',
};

const all = await getCollection('recursos');
const grouped = groupOrder.map((g) => ({
  group: g,
  heading: groupHeadings[g],
  items: all.filter((r) => r.data.group === g).sort((a, b) => a.data.order - b.data.order),
}));
---
<PageLayout
  title="Recursos · Sigma Data Club"
  eyebrow="/ recursos"
  heading="Material curado por la comunidad."
  lead="Lo que el club recomienda — no lo que sale en SEO. Lista mantenida por los track leads, revisada cada semestre. Si crees que falta algo, manda un PR."
>
  <section>
    <div class="container">
      {grouped.map(({ heading, items }) => (
        items.length > 0 && <ResourceGroup heading={heading} items={items} />
      ))}
    </div>
  </section>
</PageLayout>
```

- [ ] **Step 6.6: Verify visually**

`npm run dev`. Open `/recursos`. Compare against legacy. Confirm:
- 7 groups in correct order, with the legacy headings (note `datasets` heading is `datasets abiertos (recomendados)`, `apuntes` is `nuestros propios apuntes`).
- Every legacy entry present with same kind label, title, by line.
- Arrow `→` renders.

- [ ] **Step 6.7: Verify check + build**

```bash
npm run check && npm run build
```

- [ ] **Step 6.8: Commit**

```bash
git add src/content/recursos/ src/components/ResourceItem.astro \
  src/components/ResourceGroup.astro src/pages/recursos.astro
git commit -m "feat: migrate recursos to content collection"
```

---

## Task 7: Migrate `proyectos`

**Files:**
- Create: `src/content/proyectos/{slug}.md` × N (4 destacados from `index.html` + entries from `proyectos.html`)
- Create: `src/components/ProjectCard.astro`
- Create: `src/pages/proyectos.astro`

Source: `git show fa6676a:proyectos.html` and `git show fa6676a:index.html` (last section). `proyectos.html` has three sections: destacados, archivo, "cómo proponer un proyecto" (static prose).

- [ ] **Step 7.1: Inventory legacy projects**

```bash
git show fa6676a:proyectos.html > /tmp/proyectos.html
grep -c 'class="project"' /tmp/proyectos.html
```

For each `<article class="project">`, capture: title (`<h3>`), thumb (`.thumb` text), meta line (`status · category · N contribs`), summary `<p>`, tags array, and CTA href if present.

- [ ] **Step 7.2: Create one `.md` per project**

Slug = the title (already kebab-case, e.g. `actas-senado-upv`). File path: `src/content/proyectos/{slug}.md`. Example `actas-senado-upv.md`:

```md
---
title: 'actas-senado-upv'
thumb: 'NLP'
status: 'en curso'
category: 'NLP'
tags: ['polars', 'spacy', 'quarto', 'duckdb']
summary: 'Pipeline en Polars + spaCy para extraer temas, votaciones y citas de las actas públicas del claustro UPV (2018→2024). 1.2M tokens procesados, modelo de clasificación temática con accuracy 0.84.'
contribCount: 6
---
```

`category` must be one of the schema's enum values: `'NLP' | 'Visión' | 'ML' | 'Open Data' | 'MLOps' | 'Otro'`. Map legacy lowercase strings (e.g. `nlp`, `visión`, `open data`) to the enum capitalisation.

If the legacy `repo` link is `href="#"`, omit `repoUrl`.

Repeat for every `.project` in destacados and archivo. Mark archivo entries `status: 'archivado'`.

- [ ] **Step 7.3: Write `src/components/ProjectCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props {
  project: CollectionEntry<'proyectos'>;
}
const { project } = Astro.props;
const { title, thumb, status, category, summary, contribCount, tags, repoUrl } = project.data;
const categoryLower = category.toLowerCase();
---
<article class="project">
  <div class="thumb">{thumb}</div>
  <div>
    <div class="meta">{status} · {categoryLower} · {contribCount} contribs</div>
    <h3>{title}</h3>
    <p>{summary}</p>
    {tags.length > 0 && (
      <div class="tags">
        {tags.map((t) => <span>{t}</span>)}
      </div>
    )}
  </div>
  {repoUrl && <a class="btn btn-ghost" href={repoUrl}>repo</a>}
</article>
```

- [ ] **Step 7.4: Write `src/pages/proyectos.astro`**

```astro
---
import { getCollection } from 'astro:content';
import PageLayout from '../layouts/PageLayout.astro';
import SectionHead from '../components/SectionHead.astro';
import ProjectCard from '../components/ProjectCard.astro';

const all = await getCollection('proyectos');
const destacados = all.filter((p) => p.data.status !== 'archivado');
const archivo = all.filter((p) => p.data.status === 'archivado');
---
<PageLayout
  title="Proyectos · Sigma Data Club"
  eyebrow="/ proyectos"
  heading="31&nbsp;repos.<br>Open source. <span class='accent'>MIT.</span>"
>
  <section>
    <div class="container">
      <SectionHead eyebrow="Destacados" title="En curso ahora." num="01 / 03" />
      <div class="grid" style="gap: 1.25rem;">
        {destacados.map((p) => <ProjectCard project={p} />)}
      </div>
    </div>
  </section>

  <section>
    <div class="container">
      <SectionHead eyebrow="Archivo" title="Cosas terminadas o congeladas." num="02 / 03" />
      <div class="grid" style="gap: 1.25rem;">
        {archivo.map((p) => <ProjectCard project={p} />)}
      </div>
    </div>
  </section>

  <section>
    <div class="container">
      <SectionHead eyebrow="Cómo proponer un proyecto" title="Tres pasos." num="03 / 03" />
      <!-- paste the three .card.bracketed blocks (// 01, // 02, // 03) from legacy proyectos.html lines ~190-220 -->
    </div>
  </section>
</PageLayout>
```

The implementer reads legacy lines around 184-227 and pastes the three "Cómo proponer un proyecto" cards verbatim, since they are static prose, not collection data.

- [ ] **Step 7.5: Verify visually**

Compare `/proyectos` against legacy. All cards present, status/category formatting matches.

- [ ] **Step 7.6: Verify check + build**

```bash
npm run check && npm run build
```

- [ ] **Step 7.7: Commit**

```bash
git add src/content/proyectos/ src/components/ProjectCard.astro \
  src/pages/proyectos.astro
git commit -m "feat: migrate proyectos to content collection"
```

---

## Task 8: Migrate `eventos`

**Files:**
- Create: `src/content/eventos/{slug}.md` × ~10 (próximos table + archivo table)
- Create: `src/components/EventCard.astro`
- Create: `src/components/EventTable.astro`
- Create: `src/pages/eventos.astro`

Source: `git show fa6676a:eventos.html`. Three sections: próximo evento (single card), calendario (table), archivo (table).

- [ ] **Step 8.1: Inventory legacy events**

Read the calendario `<tbody>` rows (legacy ~95-160) and archivo rows (~190-end). Capture date, type, title, speaker, location, capacity. Featured "próximo" card has additional description prose.

- [ ] **Step 8.2: Create one `.md` per event**

Slug = `{YYYY-MM-DD}-{kebab-title}`. Example `src/content/eventos/2025-10-23-pytorch-mlp.md`:

```md
---
title: 'Tu primer modelo en PyTorch'
date: 2025-10-23T19:00:00+02:00
durationMin: 120
location: 'Aula 1G 2.4 · ETSINF'
type: workshop
speaker: 'Lucía Fuentes'
description: 'Sesión práctica para construir, entrenar y depurar un MLP desde cero usando el dataset MNIST. Todo el código en vivo, sin slides. Trae el portátil con Python 3.11 y un entorno limpio.'
capacity: '40 / 50'
---
```

Repeat for every row in calendario + archivo. For archivo entries set `attendees` (parse the legacy "asistentes" column as integer) and `materialUrl` if present. Use the `description` from the next-event card only for that one event; for table-only rows, use the `<title>` text as description fallback (or write a one-line description from context if the implementer can).

- [ ] **Step 8.3: Write `src/components/EventCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props {
  event: CollectionEntry<'eventos'>;
}
const { event } = Astro.props;
const { title, date, durationMin, location, description, signupUrl } = event.data;

const day = String(date.getDate()).padStart(2, '0');
const monthShort = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }).toUpperCase().replace('.', '');
const startTime = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
const end = new Date(date.getTime() + durationMin * 60_000);
const endTime = end.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
---
<article class="event-next">
  <div class="when">
    <div class="day">{day}</div>
    <div class="month">{monthShort}</div>
    <div class="time">{startTime} — {endTime}</div>
  </div>
  <div>
    <h3>{title}</h3>
    <p>{description}</p>
    <div class="where">→ {location}</div>
  </div>
  <div>
    <a class="btn btn-primary" href={signupUrl ?? '/eventos'}>apuntarme</a>
  </div>
</article>
```

- [ ] **Step 8.4: Write `src/components/EventTable.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props {
  events: CollectionEntry<'eventos'>[];
  mode: 'upcoming' | 'archive';
}
const { events, mode } = Astro.props;

const pillClass = (t: string) =>
  t === 'datathon' ? 'pill warn' : 'pill';

const fmtDate = (d: Date) => d.toISOString().slice(0, 10);
---
<table class="tbl">
  <thead>
    <tr>
      <th>fecha</th>
      <th>tipo</th>
      <th>título</th>
      <th>ponente</th>
      <th>lugar</th>
      <th>{mode === 'upcoming' ? 'plazas' : 'asistentes'}</th>
      {mode === 'archive' && <th>material</th>}
    </tr>
  </thead>
  <tbody>
    {events.map((e) => (
      <tr>
        <td>{fmtDate(e.data.date)}</td>
        <td><span class={pillClass(e.data.type)}>{e.data.type}</span></td>
        <td><strong>{e.data.title}</strong></td>
        <td>{e.data.speaker}</td>
        <td>{e.data.location}</td>
        <td>{mode === 'upcoming' ? (e.data.capacity ?? '—') : (e.data.attendees ?? '—')}</td>
        {mode === 'archive' && (
          <td>{e.data.materialUrl ? <a href={e.data.materialUrl}>ver</a> : '—'}</td>
        )}
      </tr>
    ))}
  </tbody>
</table>
```

- [ ] **Step 8.5: Write `src/pages/eventos.astro`**

```astro
---
import { getCollection } from 'astro:content';
import PageLayout from '../layouts/PageLayout.astro';
import SectionHead from '../components/SectionHead.astro';
import EventCard from '../components/EventCard.astro';
import EventTable from '../components/EventTable.astro';

const now = new Date();
const all = (await getCollection('eventos')).sort(
  (a, b) => a.data.date.getTime() - b.data.date.getTime(),
);
const upcoming = all.filter((e) => e.data.date >= now);
const archive = all.filter((e) => e.data.date < now).reverse();
const next = upcoming[0];
---
<PageLayout
  title="Eventos · Sigma Data Club"
  eyebrow="/ eventos"
  heading="Cada jueves, 19:00.<br>Aula 1G&nbsp;2.4 · ETSINF."
>
  {next && (
    <section>
      <div class="container">
        <SectionHead eyebrow="Próximo evento" title="Esta semana." num="01 / 03" />
        <EventCard event={next} />
      </div>
    </section>
  )}

  <section>
    <div class="container">
      <SectionHead eyebrow="Calendario" title="Próximas sesiones." num="02 / 03" />
      <EventTable events={upcoming} mode="upcoming" />
    </div>
  </section>

  <section>
    <div class="container">
      <SectionHead eyebrow="Archivo" title="Eventos pasados." num="03 / 03" />
      <EventTable events={archive} mode="archive" />
    </div>
  </section>
</PageLayout>
```

- [ ] **Step 8.6: Verify visually**

`/eventos` matches legacy. Próximo card shows correct date breakdown. Tables match.

- [ ] **Step 8.7: Verify check + build**

```bash
npm run check && npm run build
```

- [ ] **Step 8.8: Commit**

```bash
git add src/content/eventos/ src/components/EventCard.astro \
  src/components/EventTable.astro src/pages/eventos.astro
git commit -m "feat: migrate eventos to content collection"
```

---

## Task 9: Migrate `blog` + RSS

**Files:**
- Create: `src/content/blog/{slug}.mdx` × 9 (the nine real post stubs)
- Create: `src/layouts/PostLayout.astro`
- Create: `src/components/PostCard.astro`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[...slug].astro`
- Create: `src/pages/rss.xml.ts`

Source: `git show fa6676a:blog.html`.

- [ ] **Step 9.1: Inventory legacy blog**

Read each `<article class="post-row">`. Capture title, date, author(s), tags, excerpt. Body content for MDX is whatever existed in legacy — if legacy only has title+excerpt+date+author, the MDX body can begin with a one-paragraph placeholder until the full text is written. **Do not invent post content.** Write the front-matter + a single placeholder paragraph: "{ Cuerpo del post pendiente. }"

- [ ] **Step 9.2: Create nine MDX posts**

Slug = kebab-case of title. Example `src/content/blog/polars-vs-pandas.mdx`:

```mdx
---
title: 'Por qué dejé pandas en favor de Polars (y cuándo todavía vuelvo)'
date: 2025-09-18
authors: ['joan-marti']
tags: ['polars', 'pandas', 'performance']
excerpt: '<one-line excerpt from legacy>'
draft: false
---

{ Cuerpo del post pendiente. }
```

The `authors` array references slugs from `src/content/equipo/`. The legacy "by" line in `blog.html` says e.g. "por Joan Martí" — map to the equipo slug `joan-marti`. If the legacy author is not in the equipo collection, leave `authors: []`.

- [ ] **Step 9.3: Write `src/layouts/PostLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';
import { getEntries } from 'astro:content';

interface Props {
  title: string;
  description?: string;
  date: Date;
  authors: { collection: 'equipo'; slug: string }[];
  tags: string[];
}
const { title, description, date, authors, tags } = Astro.props;
const authorEntries = await getEntries(authors);
const fmtDate = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
---
<BaseLayout title={`${title} · Sigma Data Club`} description={description}>
  <section class="page-head">
    <div class="container">
      <span class="eyebrow">/ blog</span>
      <h1>{title}</h1>
      <p class="lead">
        {fmtDate}
        {authorEntries.length > 0 && (
          <>
            {' · por '}
            {authorEntries.map((a, i) => (
              <>
                {i > 0 && ', '}
                {a.data.name}
              </>
            ))}
          </>
        )}
      </p>
      {tags.length > 0 && (
        <p class="muted">{tags.map((t) => `#${t}`).join(' ')}</p>
      )}
    </div>
  </section>
  <section>
    <div class="container">
      <article class="prose">
        <slot />
      </article>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 9.4: Write `src/components/PostCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import { getEntries } from 'astro:content';

interface Props {
  post: CollectionEntry<'blog'>;
}
const { post } = Astro.props;
const authors = await getEntries(post.data.authors);
const fmtDate = post.data.date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
---
<article class="post-row">
  <div class="meta">
    <span>{fmtDate}</span>
    {authors.length > 0 && <span>· por {authors.map((a) => a.data.name).join(', ')}</span>}
    {post.data.tags.length > 0 && <span>· {post.data.tags.map((t) => `#${t}`).join(' ')}</span>}
  </div>
  <h3><a href={`/blog/${post.slug}`}>{post.data.title}</a></h3>
  <p>{post.data.excerpt}</p>
</article>
```

- [ ] **Step 9.5: Write `src/pages/blog/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import PageLayout from '../../layouts/PageLayout.astro';
import PostCard from '../../components/PostCard.astro';

const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime(),
);
---
<PageLayout
  title="Blog · Sigma Data Club"
  eyebrow="/ blog"
  heading="Notas técnicas escritas<br>por miembros del club."
>
  <section>
    <div class="container">
      <div class="post-list">
        {posts.map((p) => <PostCard post={p} />)}
      </div>
    </div>
  </section>
</PageLayout>
```

- [ ] **Step 9.6: Write `src/pages/blog/[...slug].astro`**

```astro
---
import { getCollection } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---
<PostLayout
  title={post.data.title}
  description={post.data.excerpt}
  date={post.data.date}
  authors={post.data.authors}
  tags={post.data.tags}
>
  <Content />
</PostLayout>
```

- [ ] **Step 9.7: Write `src/pages/rss.xml.ts`**

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  return rss({
    title: 'Sigma Data Club',
    description: 'Notas técnicas del club de ciencia de datos de la UPV.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: `/blog/${post.slug}/`,
    })),
  });
}
```

- [ ] **Step 9.8: Verify**

```bash
npm run check && npm run build
```

Run `npm run dev`. Open `/blog`. Confirm 9 posts listed, sorted newest first. Click one — post renders with title, date, authors, body placeholder. Open `/rss.xml` — feed validates as XML.

- [ ] **Step 9.9: Commit**

```bash
git add src/content/blog/ src/layouts/PostLayout.astro \
  src/components/PostCard.astro src/pages/blog/ src/pages/rss.xml.ts
git commit -m "feat: migrate blog to content collection with MDX + RSS"
```

---

## Task 10: Wire `index.astro` Dynamic Sections

**Files:**
- Modify: `src/pages/index.astro` (full rewrite)
- Create: `src/components/Stat.astro`
- Create: `src/components/Terminal.astro`

- [ ] **Step 10.1: Write `src/components/Stat.astro`**

```astro
---
interface Props {
  label: string;
  value: string | number;
  foot: string;
}
const { label, value, foot } = Astro.props;
---
<div class="stat">
  <div class="stat-label">{label}</div>
  <div class="stat-value">{value}</div>
  <div class="stat-foot">{foot}</div>
</div>
```

- [ ] **Step 10.2: Write `src/components/Terminal.astro`**

```astro
---
interface Props {
  title?: string;
}
const { title = '~/sigma-data-club — bash' } = Astro.props;
---
<div class="terminal" aria-label="Terminal de bienvenida">
  <div class="terminal-bar">
    <span class="terminal-dot" />
    <span class="terminal-dot" />
    <span class="terminal-dot" />
    <span class="terminal-title">{title}</span>
  </div>
  <div class="terminal-body">
    <slot />
  </div>
</div>
```

- [ ] **Step 10.3: Rewrite `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import SectionHead from '../components/SectionHead.astro';
import Stat from '../components/Stat.astro';
import Terminal from '../components/Terminal.astro';
import EventCard from '../components/EventCard.astro';
import ProjectCard from '../components/ProjectCard.astro';

const now = new Date();
const upcoming = (await getCollection('eventos'))
  .filter((e) => e.data.date >= now)
  .sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
const nextEvent = upcoming[0];

const allProjects = await getCollection('proyectos');
const recentProjects = allProjects
  .filter((p) => p.data.status !== 'archivado')
  .sort((a, b) => a.data.title.localeCompare(b.data.title))
  .slice(0, 4);
---
<BaseLayout
  title="Sigma Data Club — UPV"
  description="Club de ciencia de datos de la Universidad Politécnica de Valencia. Talleres, proyectos y comunidad."
>
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <span class="eyebrow">v3.2.1 · curso 2025/26 · UPV</span>
        <h1 set:html="Construimos <span class='accent'>data&nbsp;science</span> en la universidad,<br>línea&nbsp;a&nbsp;línea." />
        <p class="lead">Sigma Data Club es la comunidad de estudiantes de la Politécnica de Valencia que entrena modelos, publica análisis y rompe datasets cada jueves a las&nbsp;19:00 en el aula 1G&nbsp;2.4.</p>
        <div class="hero-cta">
          <a href="/unete" class="btn btn-primary">únete al club</a>
          <a href="/eventos" class="btn btn-ghost">próximos eventos</a>
        </div>
        <div class="hero-meta">
          <div class="row"><span class="key">status</span><span class="val accent">● activo · aceptando miembros</span></div>
          <div class="row"><span class="key">cuota</span><span class="val">0 € · gratis para alumnos UPV</span></div>
          <div class="row"><span class="key">stack</span><span class="val">Python · PyTorch · DuckDB · Polars · Quarto</span></div>
        </div>
      </div>
      <aside>
        <Terminal>
          <span class="prompt">sigma@upv:~$</span> whoami
          <span class="out">→ club universitario de ciencia de datos</span>
          <span class="prompt">sigma@upv:~$</span> cat manifesto.txt
          <span class="cmt"># aprender haciendo, no leyendo slides</span>
          <span class="cmt"># compartir el código, no la pantalla</span>
          <span class="cmt"># proyectos reales con datos reales</span>
          <span class="prompt">sigma@upv:~$</span> ./join.sh
          <span class="out">→ formulario en /unete</span><span class="cursor" />
        </Terminal>
      </aside>
    </div>
  </section>

  <section>
    <div class="container">
      <SectionHead eyebrow="Manifesto" title="Aprender haciendo, no leyendo slides." num="01 / 04" />
      <div class="grid grid-3">
        <article class="card bracketed">
          <div class="card-meta"><span class="tag">// 01</span><span>código</span></div>
          <h3>git push antes de hablar</h3>
          <p>Cada sesión termina con un repo público. No hay diapositiva que sustituya un Jupyter notebook abierto en GitHub.</p>
        </article>
        <article class="card bracketed">
          <div class="card-meta"><span class="tag">// 02</span><span>datos</span></div>
          <h3>datasets reales, no toy</h3>
          <p>Trabajamos con datos abiertos del Ayuntamiento, RENFE, AEMET y la propia UPV. Lo que aprendes aquí se parece a lo que hace un científico de datos un martes.</p>
        </article>
        <article class="card bracketed">
          <div class="card-meta"><span class="tag">// 03</span><span>comunidad</span></div>
          <h3>senior ↔ junior, sin barrera</h3>
          <p>Si llevas tres años con PyTorch o estás compilando tu primer pandas, hay sitio. La regla es ayudar a la persona de la fila de detrás.</p>
        </article>
      </div>
    </div>
  </section>

  <section>
    <div class="container">
      <SectionHead eyebrow="Datos del club" title="Por qué medimos todo." num="02 / 04" />
      <div class="stats">
        <Stat label="Miembros activos" value="187" foot="+42 vs. curso anterior" />
        <Stat label="Eventos / semestre" value="24" foot="talleres · charlas · datathons" />
        <Stat label="Proyectos publicados" value="31" foot="en GitHub · MIT · open" />
        <Stat label="Grados representados" value="9" foot="ETSINF · ETSII · ADE · BIO …" />
      </div>
    </div>
  </section>

  {nextEvent && (
    <section>
      <div class="container">
        <SectionHead eyebrow="Próximo evento" title="Nos vemos el jueves." num="03 / 04" />
        <EventCard event={nextEvent} />
      </div>
    </section>
  )}

  <section>
    <div class="container">
      <SectionHead eyebrow="Última hornada" title="Lo que estamos construyendo." num="04 / 04" />
      <div class="grid grid-2">
        {recentProjects.map((p) => <ProjectCard project={p} />)}
      </div>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="ascii-rule" />
      <div class="row" style="justify-content: space-between; gap: 2rem;">
        <div>
          <h2 style="margin-bottom: 0.75rem;">¿Estudias en la UPV?<br><span class="accent">Te queremos en el club.</span></h2>
          <p class="muted">Sin examen de entrada. Sin prerequisitos. Solo curiosidad y un portátil.</p>
        </div>
        <div>
          <a href="/unete" class="btn btn-primary">./join.sh</a>
        </div>
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 10.4: Verify visually**

`npm run dev`. Open `/`. Compare against legacy index. Confirm:
- Hero, manifesto, stats, próximo evento, recent projects, CTA — all six sections present in correct order with correct numbering.
- Próximo evento renders the actual next-upcoming event from the eventos collection (date after today).
- Recent projects shows up to 4 non-archived projects.
- Hero terminal renders identically.

- [ ] **Step 10.5: Verify check + build**

```bash
npm run check && npm run build
```

- [ ] **Step 10.6: Commit**

```bash
git add src/pages/index.astro src/components/Stat.astro src/components/Terminal.astro
git commit -m "feat: wire index page to content collections"
```

---

## Task 11: Tooling — README, CI, Deploy Workflow, 404

**Files:**
- Create: `README.md`
- Create: `src/pages/404.astro`
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/deploy.yml`
- Create: `public/favicon.svg`
- Create: `public/og-default.png` (placeholder, user replaces later)

- [ ] **Step 11.1: Write `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="404 · Sigma Data Club">
  <section class="page-head">
    <div class="container">
      <span class="eyebrow">/ 404</span>
      <h1><span class="accent">$</span> not found</h1>
      <p class="lead">La página no existe. <a href="/">Volver al inicio.</a></p>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 11.2: Write `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#0a1418" />
  <text x="50%" y="58%" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="22" font-weight="700" fill="#5fc7c7">σ</text>
</svg>
```

Add favicon link in `BaseLayout.astro`'s `<head>` (insert after the title line):

```astro
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

- [ ] **Step 11.3: Stub `public/og-default.png`**

Create a 1200×630 placeholder PNG (any image tool, or a 1×1 transparent PNG renamed). The README will note this is a placeholder.

- [ ] **Step 11.4: Write `README.md`**

```md
# Sigma Data Club — sitio web

Sitio estático del club de ciencia de datos de la Universitat Politècnica de València.
Desplegado en GitHub Pages desde `main`.

## Stack

- [Astro](https://astro.build) (estático)
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

| Comando            | Qué hace                              |
|--------------------|---------------------------------------|
| `npm run dev`      | Servidor de desarrollo                |
| `npm run build`    | Build estático en `dist/`             |
| `npm run preview`  | Sirve `dist/` localmente              |
| `npm run check`    | Type-check + validación de schemas    |
| `npm run lint`     | Prettier en modo check                |
| `npm run format`   | Prettier en modo escritura            |

## Cómo añadir contenido

Cada lista del sitio se alimenta de una *content collection* de Astro. Para añadir
una entrada nueva, copia la plantilla y rellena el frontmatter:

| Sección       | Carpeta                    | Plantilla                         |
|---------------|----------------------------|-----------------------------------|
| Post de blog  | `src/content/blog/`        | `src/content/blog/_template.mdx`  |
| Evento        | `src/content/eventos/`     | `src/content/eventos/_template.md`|
| Proyecto      | `src/content/proyectos/`   | `src/content/proyectos/_template.md` |
| Persona       | `src/content/equipo/`      | `src/content/equipo/_template.md` |
| Track lead    | `src/content/tracks/`      | `src/content/tracks/_template.md` |
| Recurso       | `src/content/recursos/`    | `src/content/recursos/_template.md` |

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
```

- [ ] **Step 11.5: Write `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run check
      - run: npm run lint
      - run: npm run build
```

- [ ] **Step 11.6: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
        with:
          node-version: 20

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 11.7: Run lint to verify formatting**

```bash
npm run format
npm run lint
```

Expected: `format` writes any pending changes; `lint` then exits 0.

- [ ] **Step 11.8: Verify build still passes**

```bash
npm run check && npm run build
```

- [ ] **Step 11.9: Commit**

```bash
git add README.md src/pages/404.astro public/ \
  .github/workflows/ci.yml .github/workflows/deploy.yml \
  src/layouts/BaseLayout.astro
git commit -m "chore: add CI, deploy workflow, README, 404, favicon"
```

---

## Task 12: Cutover — Remove Legacy Files, Update CLAUDE.md, Enable Pages

**Files:**
- Delete: `index.html`, `sobre.html`, `equipo.html`, `eventos.html`, `proyectos.html`, `blog.html`, `recursos.html`, `unete.html`, `app.js`, `styles.css`
- Modify: `CLAUDE.md`

- [ ] **Step 12.1: Confirm Astro site renders every legacy route**

`npm run dev`. Visit each route and confirm it loads:
- `/`
- `/sobre`
- `/equipo`
- `/eventos`
- `/proyectos`
- `/blog`
- `/blog/<some-slug>` (one of the post slugs from Task 9)
- `/recursos`
- `/unete`
- `/rss.xml`
- `/404` (visit a non-existent path; Astro serves 404.html)

If any route fails, fix before deleting legacy files. Stop server.

- [ ] **Step 12.2: Delete legacy files**

```bash
git rm index.html sobre.html equipo.html eventos.html \
       proyectos.html blog.html recursos.html unete.html \
       app.js styles.css
```

- [ ] **Step 12.3: Verify build still passes**

```bash
npm run build
```

- [ ] **Step 12.4: Rewrite `CLAUDE.md`**

Replace the existing `CLAUDE.md` with:

````md
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static marketing site for **Sigma Data Club**, the data science student club at Universidad Politécnica de Valencia (UPV). Built with **Astro** (static output), deployed to GitHub Pages. All user-facing copy is in Spanish (`<html lang="es">`).

## Commands

```bash
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview    # serve dist/ locally
npm run check      # astro check (TS + content schema validation)
npm run lint       # prettier --check .
npm run format     # prettier --write .
```

Node 20 (`.nvmrc`).

## Architecture

Static Astro site. No client framework — only `.astro` components plus one inline pre-paint theme script. Visual design is driven by a single global stylesheet (`src/styles/global.css`) imported once in `BaseLayout`. The CSS file is the same terminal/hacker aesthetic that pre-dates the Astro migration; do not refactor it without explicit reason.

### Layouts

- `src/layouts/BaseLayout.astro` — owns `<html>`, `<head>`, the inline theme script, header, footer, and a content slot. Always wrap pages in this (directly or via PageLayout / PostLayout).
- `src/layouts/PageLayout.astro` — wraps Base, renders the `.page-head` section (eyebrow + h1 + lead), then a slot. Use for content pages.
- `src/layouts/PostLayout.astro` — wraps Base for blog posts; renders title/date/authors and a `<article class="prose">` slot for MDX content.

### Theme toggle

Initialization is an inline `<script is:inline>` in `BaseLayout`'s `<head>` so it runs before first paint (avoids FOUC). LocalStorage key: `sdc-theme`. Falls back to `prefers-color-scheme`, then to `dark`. The button label shows the **target** theme, not the current one (`[ light ]` while in dark mode) — keep this convention.

### Content collections

Six collections, all defined in `src/content/config.ts` with Zod schemas. `_template.{md,mdx}` files in each folder are ignored (Astro skips files starting with `_`).

| Collection   | Format | Body used? | Purpose                                  |
|--------------|--------|------------|------------------------------------------|
| `blog`       | MDX    | yes        | Blog posts                               |
| `eventos`    | md     | no         | Events (calendario + archivo)            |
| `proyectos`  | md     | no         | Projects (destacados + archivo)          |
| `equipo`     | md     | no         | People — `kind: 'junta' \| 'mentor'`     |
| `tracks`     | md     | no         | Track leads (table-shaped)               |
| `recursos`   | md     | no         | Curated learning resources               |

Cross-references: `blog.authors` and `proyectos.contributors` use `reference('equipo')` for typed slug refs.

### Active nav

Header computes the active nav link from `Astro.url.pathname` at build time — no runtime JS for this.

## Adding content

Copy the relevant `_template.{md,mdx}` and fill the frontmatter. Slug is the filename. To hide a draft blog post, set `draft: true`. Validation happens on `npm run check` and on every CI run.

## Deployment

Push to `main` triggers `.github/workflows/deploy.yml`, which uses `withastro/action@v3` to build and deploy to GitHub Pages. Settings → Pages → Source must be set to "GitHub Actions" (one-time manual configuration). Site URL is `https://sigma-data-club.github.io` (configured in `astro.config.mjs`).

## Conventions

- Editorial voice: Spanish, lowercase eyebrows, terminal/CLI metaphors (`./join.sh`, `git push antes de hablar`).
- Section numbering: each top-level `<section>` on a content page gets a `.section-num` like `[ 02 / 04 ]`. Updating the count means updating every section on that page.
- The brand mark is the literal character `σ` inside `<span class="brand-mark">`.

## Spec history

The migration from hand-written HTML to Astro is documented in `docs/superpowers/specs/2026-05-02-astro-scaffold-design.md` and implemented per `docs/superpowers/plans/2026-05-02-astro-scaffold.md`.
````

- [ ] **Step 12.5: Final lint + build**

```bash
npm run format
npm run lint
npm run check
npm run build
```

All exit 0.

- [ ] **Step 12.6: Commit cutover**

```bash
git add -A
git commit -m "chore: cutover — remove legacy HTML/CSS/JS, update CLAUDE.md"
```

- [ ] **Step 12.7: Manual repo configuration (user task)**

Document for the user (do not run automatically):

> After merging this work, in GitHub repo settings:
> 1. Settings → Pages → Source → "GitHub Actions".
> 2. Push to `main` (or re-run the deploy workflow) to trigger the first deploy.
> 3. Verify the live site at `https://sigma-data-club.github.io` matches local `npm run preview`.

If the repo is currently `LaiqianDS/website` (project pages, would deploy at `laiqiands.github.io/website/`), the user must either:
- Move/rename the repo to `<owner>.github.io` to use the configured `site` URL, or
- Update `astro.config.mjs` `site` and add `base: '/website/'` before the first deploy.

---

## Self-Review Notes

(Author-only — completed before handoff.)

**Spec coverage:** All twelve phases in the spec map to Tasks 1-12. The amended spec sections (`tracks` collection, extended `eventos` schema, extended `proyectos` schema, `equipo.kind`) are all covered: schemas in Task 4, content + components in Tasks 5/7/8, page consumers in Tasks 5/7/8/10.

**Type consistency:** Component prop names match collection field names throughout (`event.data.title`, `project.data.thumb`, `person.data.kind`, `track.data.lead`). Slug references in blog frontmatter (`authors: ['joan-marti']`) match the equipo file naming convention used in Task 5.

**No placeholders:** Every step shows actual code or an exact command. Steps that ask the implementer to read a legacy file (Tasks 5-9) cite the legacy commit `fa6676a` and specify which lines / which sections to extract.

**Open items handled:** Site URL placeholder is documented in Task 12.7 with two paths. Form behavior in `unete` is preserved verbatim per spec open-item #2. Brand assets in Task 11.2/11.3 are flagged as placeholders. Blog body content uses an explicit "Cuerpo del post pendiente." placeholder rather than inventing text.
