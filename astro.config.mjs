import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sigma-data-club.github.io',
  base: '/website',
  output: 'static',
  integrations: [mdx(), sitemap()],
  trailingSlash: 'never',
});
