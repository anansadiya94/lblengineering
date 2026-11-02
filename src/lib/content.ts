// Loads everything from the content/ folder: site.json, the page .md files and images.
// Components read content through these helpers instead of hard-coding text.
import type { ImageMetadata, MarkdownInstance } from 'astro';
import siteJson from '../../content/site.json';

export type Lang = 'he' | 'en';
export type Localized = Record<Lang, string>;

export interface Project {
  src: string;
  alt: Localized;
  // Optional. TODO(client): add a title and short description for each project in site.json.
  title?: Localized | null;
  description?: Localized | null;
}

export const site = siteJson as typeof siteJson & {
  projects: Project[];
};

// ---------- Images ----------

const images = import.meta.glob<{ default: ImageMetadata }>(
  '/content/images/**/*.{jpg,jpeg,png,webp}',
  { eager: true },
);

/** Look up an image by its path inside content/, e.g. "images/projects/project-01.jpg". */
export function img(path: string): ImageMetadata {
  const mod = images[`/content/${path}`];
  if (!mod) throw new Error(`Image not found: content/${path}`);
  return mod.default;
}

// ---------- Pages (.md files) ----------

const pages = import.meta.glob<MarkdownInstance<Record<string, any>>>('/content/*/*.md', {
  eager: true,
});

export interface PageBase {
  seo_title: string;
  seo_description: string;
}

/** Load content/<lang>/<name>.md: its frontmatter and its rendered body. */
export function page<T extends PageBase>(lang: Lang, name: string) {
  const mod = pages[`/content/${lang}/${name}.md`];
  if (!mod) throw new Error(`Page not found: content/${lang}/${name}.md`);
  return { data: mod.frontmatter as T, Content: mod.Content };
}

// ---------- Formatting ----------

/** "04-6814919" → "+97246814919" for tel: links. */
export function telHref(phone: string): string {
  return 'tel:+972' + phone.replace(/\D/g, '').replace(/^0/, '');
}

/** "04-6814919" → "+972-4-6814919" for structured data and English pages. */
export function intlPhone(phone: string): string {
  const [area, rest] = phone.split('-');
  return `+972-${area.replace(/^0/, '')}-${rest}`;
}
