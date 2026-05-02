# Astro Scaffold Design — Sigma Data Club Website

**Date:** 2026-05-02
**Author:** Brainstormed with Claude
**Status:** Draft, awaiting approval

## Context

The repository currently contains eight hand-written, fully self-contained HTML pages, a single `styles.css`, and a single `app.js` — a static site for the Sigma Data Club at UPV, hosted on GitHub Pages. All user-facing copy is in Spanish.

The current setup has two structural pain points:

1. **Nav and chrome are duplicated across all eight pages.** Adding or renaming a page requires touching every HTML file.
2. **Listings (`blog`, `eventos`, `proyectos`, `equipo`, `recursos`) are hardcoded HTML.** Adding a blog post or a new team member means editing markup, not data. Index page repeats content from listing pages, drifting over time.

This spec migrates the site to **Astro** as a static site generator, with content collections backing every list-shaped section. The visual design and CSS stay unchanged.

## Goals

- Eliminate nav/chrome duplication via Astro layouts and components.
- Make listing content (blog, eventos, proyectos, equipo, recursos) authored as Markdown/MDX with Zod-validated frontmatter.
- Keep the existing terminal/hacker aesthetic exact: `styles.css` ports verbatim to `src/styles/global.css`.
- Preserve current user-facing behaviors: theme toggle (dark default, localStorage `sdc-theme`, pre-paint init, inverted button label), Spanish copy, GitHub Pages hosting.
- Add minimal but real tooling: Prettier, `astro check`, GitHub Actions for build + deploy + PR checks.

## Non-Goals

- No CSS rewrite or component-scoped styles. Global stylesheet stays.
- No client-side JS framework. Astro components only.
- No CMS, no auth, no backend.
- No dynamic features (search, comments, analytics) in scaffold scope.
- No design system overhaul.
- No internationalization beyond current single-locale Spanish.

## Architecture

Static Astro site (`output: 'static'`) deployed to GitHub Pages via the official `withastro/action`. TypeScript strict mode. MDX integration enabled for blog only. Sitemap and RSS integrations enabled.

Build pipeline:

```
src/content/{blog,eventos,proyectos,equipo,recursos}/*.{md,mdx}
  -> Astro content collections (Zod-validated at build)
  -> src/pages/**.astro consume via getCollection() / getEntry()
  -> dist/ (static HTML + CSS + minimal inline JS)
  -> GitHub Pages deploy via Actions
```

No client framework. The only client-side script is the inline pre-paint theme initializer in `BaseLayout`'s `<head>` — same logic as today's `app.js`, but inlined to guarantee execution before first paint.

Active-nav highlighting moves from runtime JS to build-time: `Header.astro` reads `Astro.url.pathname` and applies the `active` class server-side.

## Site Configuration

- `site: 'https://sigma-data-club.github.io'` — confirmed by user.
- No `base` path (user/org Pages, root deploy).
- Node 20 (`.nvmrc`).

## Content Collections

`src/content/config.ts` defines five collections. Only the blog collection renders body content into pages (MDX). The other four collections (`eventos`, `proyectos`, `equipo`, `recursos`) use frontmatter only — body is unused and may be omitted.

Schema syntax below is pseudocode for readability. Actual implementation uses real Zod (`z.string()`, `z.string().optional()`, `z.enum([...])`, `z.array(reference('equipo'))`, etc.) inside `defineCollection({ schema: z.object({...}) })`.

### `blog` (MDX)

```ts
{
  title: string,
  date: Date,                  // ISO date
  authors: reference('equipo')[],   // typed cross-refs
  tags: string[],
  excerpt: string,             // 1-2 sentence summary for cards
  draft: boolean,              // default false
  hero: image().optional()     // hero image, optional
}
```

### `eventos` (md)

```ts
{
  title: string,
  date: Date,                  // ISO datetime; used to split próximos vs pasados
  durationMin: number,         // default 120
  location: string,            // e.g. "Aula 1G 2.4 · ETSINF"
  type: 'workshop' | 'charla' | 'datathon' | 'social',
  description: string,
  signupUrl: string.optional(),
  recap: string.optional()     // post-event link
}
```

### `proyectos` (md)

```ts
{
  title: string,
  status: 'en curso' | 'publicado' | 'archivado',
  category: 'NLP' | 'Visión' | 'ML' | 'Open Data' | 'MLOps' | 'Otro',
  tags: string[],
  summary: string,             // 1-2 sentences for cards
  repoUrl: string.optional(),
  demoUrl: string.optional(),
  contributors: reference('equipo')[]
}
```

### `equipo` (md)

```ts
{
  name: string,
  role: string,                // "presidenta", "vocal · NLP track"
  initials: string,            // "CR" — used as avatar text
  grade: string,               // "4.º GIIC", "Máster en CD"
  bio: string,
  github: string.optional(),
  linkedin: string.optional(),
  period: string,              // "2025/26"
  order: number                // sort key for display
}
```

### `recursos` (md)

```ts
{
  title: string,
  by: string.optional(),       // author/source line
  group: 'fundamentos' | 'machine learning' | 'nlp y llms' | 'datos & sql'
       | 'mlops & producción' | 'datasets' | 'apuntes',
  kind: 'curso' | 'libro' | 'paper' | 'vídeo' | 'guía' | 'repo' | 'dataset',
  url: string,
  order: number
}
```

### Templates

Each collection folder ships a commented `_template.{md,mdx}` that contributors copy. Files with leading underscore are ignored by Astro's `getCollection()` so templates do not appear in lists.

## Layouts and Components

```
src/layouts/
  BaseLayout.astro     # <html>, <head>, theme inline-script, <Header/>, <slot/>, <Footer/>
  PageLayout.astro     # extends Base; adds .page-head with eyebrow + h1 + lead
  PostLayout.astro     # extends Base; blog post chrome (title, date, authors, prose <slot/>)

src/components/
  Header.astro         # site nav; computes active state from Astro.url.pathname
  Nav.astro            # nav links extracted for clarity
  Footer.astro         # static footer
  ThemeToggle.astro    # button only; init/persist logic lives in BaseLayout <script is:inline>
  Eyebrow.astro
  SectionHead.astro    # eyebrow + h2 + .section-num [NN/TOT]
  Card.astro           # generic .card wrapper; bracketed/clickable variants via props
  Stat.astro           # single .stat tile
  Terminal.astro       # .terminal block; slot for body lines
  EventCard.astro      # event row (date column + body + CTA)
  ProjectCard.astro    # proyectos card with tag/status/category meta
  PostCard.astro       # blog index list item
  PersonCard.astro     # equipo .person card
  ResourceItem.astro   # .res-item row
  ResourceGroup.astro  # .res-group wrapper around items of one group
```

`BaseLayout` props: `title`, `description`, `currentPath?` (defaults to `Astro.url.pathname`).

Theme toggle: button is a component; the actual init/persist logic stays as an inline `<script is:inline>` in `BaseLayout`'s `<head>` to guarantee pre-paint execution. Logic is identical to current `app.js` — same localStorage key (`sdc-theme`), same fallback to `prefers-color-scheme`, same inverted button label (`[ light ]` while in dark).

## Pages

```
src/pages/
  index.astro              # hero + manifesto + stats + next event + recent projects
  sobre.astro              # static prose page
  equipo.astro             # getCollection('equipo'), sorted by order
  eventos.astro            # getCollection('eventos'), split: date >= now (próximos) | else pasados
  proyectos.astro          # getCollection('proyectos'), grouped by status
  recursos.astro           # getCollection('recursos'), grouped by group
  unete.astro              # form/contact (current behavior preserved verbatim, decision deferred)
  blog/
    index.astro            # getCollection('blog'), filter !draft, sort by date desc
    [...slug].astro        # dynamic post page using PostLayout
  rss.xml.ts               # @astrojs/rss feed for blog
  404.astro                # custom 404
```

Index page dynamic data:

- **Next event:** `eventos.filter(e => e.data.date >= now).sort(asc)[0]`.
- **Recent projects:** `proyectos.filter(status !== 'archivado').sort(...).slice(0, 4)`.
- **Stats and manifesto:** stay inline in `index.astro` (editorial, not list-shaped).

Pagination is not implemented in the scaffold. Add when blog exceeds ~20 posts.

## Tooling

`package.json` scripts:

```
dev        astro dev
build      astro build
preview    astro preview
check      astro check
lint       prettier --check .
format     prettier --write .
```

Dependencies:

- `astro`
- `@astrojs/mdx`
- `@astrojs/sitemap`
- `@astrojs/rss`
- `@astrojs/check` + `typescript`
- `prettier` + `prettier-plugin-astro`

No ESLint. `astro check` covers TypeScript and content schema validation; Prettier covers formatting.

`tsconfig.json` extends `astro/tsconfigs/strict`.

`.editorconfig`, `.prettierrc.json`, `.prettierignore`, `.gitignore`, `.nvmrc` (node 20) at repo root.

## Deployment

`.github/workflows/deploy.yml`:

- Trigger: `push` to `main`.
- Uses `withastro/action@v2` (wraps install + build + Pages artifact upload + deploy).
- Permissions: `pages: write`, `id-token: write`.
- One-time manual step (documented in README): repo Settings → Pages → Source = "GitHub Actions".

`.github/workflows/ci.yml`:

- Trigger: `pull_request`.
- Steps: install → `astro check` → `prettier --check` → `astro build`.

## File Tree

```
.
├── .editorconfig
├── .gitignore
├── .nvmrc
├── .prettierrc.json
├── .prettierignore
├── .github/
│   └── workflows/
│       ├── deploy.yml
│       └── ci.yml
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── README.md
├── CLAUDE.md
├── public/
│   ├── favicon.svg              # placeholder σ glyph
│   └── og-default.png           # placeholder, real asset later
├── src/
│   ├── content/
│   │   ├── config.ts
│   │   ├── blog/
│   │   │   ├── _template.mdx
│   │   │   └── *.mdx
│   │   ├── eventos/
│   │   │   ├── _template.md
│   │   │   └── *.md
│   │   ├── proyectos/
│   │   │   ├── _template.md
│   │   │   └── *.md
│   │   ├── equipo/
│   │   │   ├── _template.md
│   │   │   └── *.md
│   │   └── recursos/
│   │       ├── _template.md
│   │       └── *.md
│   ├── components/                # see Layouts and Components
│   ├── layouts/
│   ├── pages/                     # see Pages
│   └── styles/
│       └── global.css             # current styles.css verbatim
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-05-02-astro-scaffold-design.md
```

## Migration Phases

Each phase is independently verifiable.

1. **Astro skeleton.** Init via `npm create astro@latest` (minimal template). Tune generated `.gitignore`, `tsconfig.json` (strict), `package.json` scripts. Add `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss`, `@astrojs/check`. Verify: `npm run dev` serves blank page.
2. **Global styles + BaseLayout + Header/Footer/ThemeToggle.** Copy `styles.css` to `src/styles/global.css`. Build BaseLayout with theme inline-script. Verify: navigate empty pages, dark/light toggle persists, no FOUC.
3. **Static pages: `sobre`, `unete`.** Port HTML to `.astro` with existing classes. Verify: visual diff vs current pages. `unete` form behavior preserved as-is (decision deferred).
4. **Content schemas + templates.** Write `src/content/config.ts` and `_template.{md,mdx}` per collection. Verify: `astro check` passes with empty collections.
5. **Migrate `equipo`.** Port four entries from current `equipo.html` to `.md`. Build `equipo.astro`. Verify: visual match.
6. **Migrate `recursos`.** Port ~25 entries across 7 groups. Build `recursos.astro` with `ResourceGroup`. Verify: visual match.
7. **Migrate `proyectos`.** Port four entries from `index.html` and any extras from `proyectos.html`. Build `proyectos.astro`. Verify: visual match.
8. **Migrate `eventos`.** Port entries from `eventos.html`. Build `eventos.astro` with próximos/pasados split. Verify: visual match.
9. **Migrate `blog`.** Port nine real post stubs from `blog.html` to `.mdx`. Build `blog/index.astro`, `blog/[...slug].astro`, RSS feed. Verify: feed validates, posts render.
10. **Wire `index.astro`.** Pull next event and recent projects from collections. Verify: visual match against current `index.html`.
11. **Tooling + CI/CD.** Add `.editorconfig`, Prettier config, `.prettierignore`, `.nvmrc`, README contributor guide. Add CI + deploy workflows. Verify: green CI on a dummy PR.
12. **Cutover.** Delete legacy `*.html`, `app.js`, `styles.css` from repo root. Update `CLAUDE.md` for Astro architecture. Enable Pages → Actions in repo settings. Verify: live site equals previous.

## Decisions

- **Stack:** Astro static + MDX (blog only) + sitemap + RSS. TypeScript strict.
- **Styling:** Single global stylesheet, current `styles.css` verbatim. No component-scoped styles. Refactor later if needed.
- **Content scope:** All five list-shaped sections become collections. Stats and manifesto remain inline in `index.astro`.
- **Site URL:** `https://sigma-data-club.github.io`.
- **Hosting target:** User/org Pages site, root path, no `base`.
- **Tooling:** Prettier + `astro check`. No ESLint.
- **Theme toggle:** Logic inline in BaseLayout `<head>`; button is a component.

## Open Items

These are explicitly tracked, not unresolved blockers:

1. **Real site URL:** confirmed `https://sigma-data-club.github.io`. Will switch when org/repo finalized.
2. **`unete` form backend:** preserve current form behavior (mailto / form action). Real form decision deferred.
3. **Blog post archive:** the nine stubs in `blog.html` are real posts — port to MDX in phase 9.
4. **Brand assets:** no real `favicon.svg` / `og-default.png` exist yet. Use placeholders in scaffold; replace when assets land.

## Risks

- **Single-spec scope:** twelve phases is sizable but one cohesive migration. Decomposition would create artificial cuts. Each phase is independently verifiable, mitigating partial-progress risk.
- **Content migration volume:** phases 5-9 are mechanical but heavy (especially `recursos`, ~25 entries). Time, not complexity.
- **Visual fidelity:** keeping `styles.css` verbatim mitigates aesthetic drift, but layout changes from HTML-to-Astro markup must match original DOM structure where CSS depends on it. Visual diff is the verification step in phases 3, 5–10.
