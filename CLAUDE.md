# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static marketing site for **Sigma Data Club**, the data science student club at Universidad Politécnica de Valencia (UPV). Hosted on GitHub Pages. All user-facing copy is in Spanish (`<html lang="es">`).

## Stack & Build

- Pure static: HTML + one CSS file + one JS file. No bundler, no package manager, no dependencies.
- No build, lint, or test commands exist. Do not invent them.
- Local preview: `python3 -m http.server 8000` from the repo root, then open `http://localhost:8000/`.
- Deploy: GitHub Pages serves the repo root directly. A push to `main` is the deploy.

## Architecture

Eight standalone HTML pages, each fully self-contained:

```
index.html  sobre.html  equipo.html  eventos.html
proyectos.html  blog.html  recursos.html  unete.html
```

Every page hard-codes the same `<header class="site-header">` (with the full nav) and `<footer class="site-footer">`. There is no templating layer — **adding or renaming a page requires editing the nav block in all eight HTML files**.

Each page links the same two assets:
- `styles.css` — single stylesheet, terminal/hacker aesthetic, OKLCH color tokens.
- `app.js` — runs as a single IIFE; handles theme toggle and active-nav highlighting.

### `app.js` behavior worth knowing

- Theme is persisted in `localStorage` under key `sdc-theme`. Falls back to `prefers-color-scheme`, then to `dark`.
- `initTheme()` runs **before** `DOMContentLoaded` to prevent a flash of the wrong theme. Keep `<script src="app.js">` in `<head>` (not deferred) so this guarantee holds.
- The toggle button label shows the **target** theme, not the current one (`[ light ]` while in dark mode). Don't "fix" this.
- `markActiveNav()` matches the current `location.pathname`'s filename (lowercased) against each `.nav a[href]`. New nav entries must use plain filenames like `eventos.html` — not `/eventos.html` or `./eventos.html` — or the active state breaks.

### `styles.css` conventions

- Theming via CSS custom properties on `:root` (dark, default) and `[data-theme="light"]`. Add new colors as `--vars`, not hardcoded values.
- Background grid + CRT scanlines are drawn with `body::before` / `body::after`. The `mix-blend-mode: multiply` scanline overlay is intentional; don't replace with opacity.
- Reusable utility/component classes already exist — reuse before inventing:
  - Layout: `.container`, `.grid.grid-2|grid-3|grid-4`, `.section-head`
  - Typography: `.eyebrow` (auto-prepends `// `), `.section-num` (e.g. `[ 01 / 04 ]`), `.ascii-rule`, `.muted`, `.accent`
  - Components: `.card` (+ `.card.bracketed`, `.card.clickable`), `.btn.btn-primary|btn-ghost`, `.terminal` + `.terminal-body` (with `.prompt`, `.out`, `.key`, `.val`, `.cmt` spans), `.stats` / `.stat`
- Section numbering convention: each top-level `<section>` on a page gets a `.section-num` like `[ 02 / 04 ]`. Updating the count means updating every section on that page.

## Editorial conventions

- Spanish copy throughout. Match the existing voice (terse, lowercase eyebrows, terminal/CLI metaphors like `./join.sh`, `git push antes de hablar`).
- Page heads use `<title>… · Sigma Data Club</title>` and an eyebrow shaped `/ <pagename>`.
- Brand mark is the literal character `σ` inside `<span class="brand-mark">`.
