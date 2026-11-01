// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Hosted on GitHub Pages at lblengineering.com. Pages are built as folders
// (about/index.html), so every URL ends with a slash: /about/, /en/.
export default defineConfig({
  site: 'https://lblengineering.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      i18n: {
        defaultLocale: 'he',
        locales: { he: 'he-IL', en: 'en-US' },
      },
    }),
  ],
});
