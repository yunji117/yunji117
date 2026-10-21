import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { siteConfig } from '../site.config.mjs';

const distDir = path.resolve('dist');
const realProfileDir = path.join(distDir, 'realyunji');
const siteUrl = `${siteConfig.siteUrl.replace(/\/$/, '')}/`;
const realProfileUrl = `${siteUrl}realyunji/`;

await mkdir(realProfileDir, { recursive: true });
const indexHtml = await readFile(path.join(distDir, 'index.html'), 'utf8');
const realProfileHtml = indexHtml
  .replace(`<link rel="canonical" href="${siteUrl}" />`, `<link rel="canonical" href="${realProfileUrl}" />`)
  .replace(`<meta property="og:url" content="${siteUrl}" />`, `<meta property="og:url" content="${realProfileUrl}" />`)
  .replaceAll(`${siteUrl}#profile-page`, `${realProfileUrl}#profile-page`)
  .replaceAll(`${siteUrl}#person`, `${realProfileUrl}#person`)
  .replaceAll(`"url": "${siteUrl}"`, `"url": "${realProfileUrl}"`);

await writeFile(path.join(realProfileDir, 'index.html'), realProfileHtml);

console.log('Created GitHub Pages entry: dist/realyunji/index.html');
