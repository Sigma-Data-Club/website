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

Static Astro site (Astro 4, pinned). No client framework — only `.astro` components plus one inline pre-paint theme script. Visual design is driven by a single global stylesheet (`src/styles/global.css`) imported once in `BaseLayout`. The CSS file is the same terminal/hacker aesthetic that pre-dates the Astro migration; do not refactor it without explicit reason.

### Layouts

- `src/layouts/BaseLayout.astro` — owns `<html>`, `<head>`, the inline theme script, header, footer, and a content slot. Always wrap pages in this (directly or via PageLayout / PostLayout).
- `src/layouts/PageLayout.astro` — wraps Base, renders the `.page-head` section (eyebrow + h1 + lead), then a slot. Use for content pages.
- `src/layouts/PostLayout.astro` — wraps Base for blog posts; renders title/date/authors and a `<article class="prose">` slot for MDX content.

### Theme toggle

Initialization is an inline `<script is:inline>` in `BaseLayout`'s `<head>` so it runs before first paint (avoids FOUC). LocalStorage key: `sdc-theme`. Falls back to `prefers-color-scheme`, then to `dark`. The button label shows the **target** theme, not the current one (`[ light ]` while in dark mode) — keep this convention.

### Content collections

Five collections, all defined in `src/content/config.ts` with Zod schemas. `_template.{md,mdx}` files in each folder are ignored (Astro skips files starting with `_`).

| Collection  | Format | Body used? | Purpose                                  |
| ----------- | ------ | ---------- | ---------------------------------------- |
| `blog`      | MDX    | yes        | Blog posts                               |
| `eventos`   | md     | no         | Events (calendario + archivo)            |
| `proyectos` | md     | no         | Projects (destacados + archivo)          |
| `equipo`    | md     | no         | People — `kind: 'junta' \| 'mentor'`     |
| `recursos`  | md     | no         | Curated learning resources               |

Cross-references: `blog.authors` and `proyectos.contributors` use `reference('equipo')` for typed slug refs. (Note: Astro 4 only supports `.md` files inside collections marked `type: 'content'`; the schemas reflect that.)

### Active nav

Header computes the active nav link from `Astro.url.pathname` at build time — no runtime JS for this.

### Whitespace-sensitive blocks (terminal)

`.terminal-body` uses `white-space: pre`. Avoid putting raw markup inside JSX inside the terminal — JSX template indentation will leak as leading spaces on each line. Pattern used elsewhere: declare a string constant with the verbatim markup and inject via `set:html` on the `<div class="terminal-body">`. See `src/pages/index.astro` and `src/pages/unete.astro` for examples.

### Date and time formatting

Event dates render via `toLocaleDateString` / `toLocaleTimeString`. Always pass `timeZone: 'Europe/Madrid'` to the locale call — without it, the build environment's TZ (UTC on GitHub Actions) is used and shifts all displayed times by 1-2 hours. See `src/components/EventCard.astro` and `src/components/EventTable.astro`.

## Adding content

Copy the relevant `_template.{md,mdx}` and fill the frontmatter. Slug is the filename. To hide a draft blog post, set `draft: true`. Validation happens on `npm run check` and on every CI run.

## Deployment

Push to `main` triggers `.github/workflows/deploy.yml`, which uses `withastro/action@v3` to build and deploy to GitHub Pages. Settings → Pages → Source must be set to "GitHub Actions" (one-time manual configuration). Site URL is `https://sigma-data-club.github.io` (configured in `astro.config.mjs`).

## Conventions

- Editorial voice: Spanish, lowercase eyebrows, terminal/CLI metaphors (`./join.sh`, `git push antes de hablar`).
- Section numbering: each top-level `<section>` on a content page gets a `.section-num` like `[ 02 / 04 ]`. Updating the count means updating every section on that page.
- The brand mark is the literal character `σ` inside `<span class="brand-mark">`.
- Event type pills in `EventTable.astro` are driven by the `color` field on each event frontmatter. Three options, mapped to vars `--pill-blue`, `--pill-yellow`, `--pill-orange` in `global.css`:
  - `blue` → azul. Default. Workshops, charlas, sociales, open hack.
  - `yellow` → amarillo. Datathon o evento especial.
  - `orange` → naranja. Hack night o evento experimental.
  Older `.pill.warn` and `.pill.dim` variants remain available for other tables but are not used at the moment.

## Spec history

The migration from hand-written HTML to Astro is documented in `docs/superpowers/specs/2026-05-02-astro-scaffold-design.md` and implemented per `docs/superpowers/plans/2026-05-02-astro-scaffold.md`.
