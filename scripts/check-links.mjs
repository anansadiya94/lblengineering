// Checks every internal link, image and asset in the built site (dist/).
// Run after a build:  npm run build && npm run check:links
import { readFile, readdir, access } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = 'dist';

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const exists = (p) => access(p).then(() => true, () => false);

// Resolve a site path the way GitHub Pages serves it: /about/ → about/index.html, / → index.html.
async function resolves(path) {
  const clean = decodeURI(path.split('#')[0].split('?')[0]);
  if (clean === '/' || clean === '') return exists(join(DIST, 'index.html'));
  const p = join(DIST, clean);
  return (await exists(p)) || (await exists(p + '.html')) || (await exists(join(p, 'index.html')));
}

const files = await htmlFiles(DIST);
const problems = [];
let checked = 0;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const refs = [
    ...[...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(' ')[0])),
  ];
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:)/.test(ref) && !ref.startsWith('https://lblengineering.com')) continue;
    checked++;
    if (ref.startsWith('#')) {
      if (ref.length > 1 && !ids.has(ref.slice(1))) problems.push(`${relative(DIST, file)}: missing anchor ${ref}`);
      continue;
    }
    const path = ref.replace('https://lblengineering.com', '') || '/';
    if (!(await resolves(path))) problems.push(`${relative(DIST, file)}: broken ${ref}`);
  }
  if (/<img(?![^>]*\salt[\s=>])[^>]*>/.test(html)) problems.push(`${relative(DIST, file)}: <img> without alt`);
}

console.log(`Checked ${checked} links and images in ${files.length} pages.`);
if (problems.length) {
  console.log(problems.join('\n'));
  process.exit(1);
}
console.log('All good.');
