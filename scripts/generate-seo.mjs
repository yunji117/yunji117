import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { siteConfig } from '../site.config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const indexPath = path.join(root, 'index.html');
const startMarker = '    <!-- seo:start -->';
const endMarker = '    <!-- seo:end -->';
const siteUrl = siteConfig.siteUrl.replace(/\/$/, '');
const canonicalUrl = `${siteUrl}/`;
const imageUrl = `${siteUrl}${siteConfig.imagePath}`;

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${canonicalUrl}#profile-page`,
  url: canonicalUrl,
  name: siteConfig.title,
  description: siteConfig.description,
  inLanguage: 'ko-KR',
  primaryImageOfPage: imageUrl,
  mainEntity: {
    '@type': 'Person',
    '@id': `${canonicalUrl}#person`,
    name: 'Kim Yun Ji',
    alternateName: '김윤지',
    url: canonicalUrl,
    image: imageUrl,
    jobTitle: ['Frontend Developer', 'Full Stack Developer', 'Web Designer'],
    sameAs: [siteConfig.githubUrl],
    knowsAbout: ['React', 'TypeScript', 'Next.js', 'JavaScript', 'Figma'],
  },
};

const seoBlock = `${startMarker}
    <title>${escapeHtml(siteConfig.title)}</title>
    <meta name="description" content="${escapeHtml(siteConfig.description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(siteConfig.title)}" />
    <meta property="og:description" content="${escapeHtml(siteConfig.description)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:type" content="${siteConfig.imageType}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(siteConfig.imageAlt)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="${escapeHtml(siteConfig.siteName)}" />
    <meta property="og:locale" content="${siteConfig.locale}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(siteConfig.title)}" />
    <meta name="twitter:description" content="${escapeHtml(siteConfig.description)}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:image:alt" content="${escapeHtml(siteConfig.imageAlt)}" />

    <script type="application/ld+json">
${JSON.stringify(structuredData, null, 2).split('\n').map((line) => `      ${line}`).join('\n')}
    </script>
${endMarker}`;

const indexHtml = await readFile(indexPath, 'utf8');
const markerPattern = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`);
if (!markerPattern.test(indexHtml)) {
  throw new Error('index.html에서 SEO 관리 영역을 찾을 수 없습니다.');
}

await mkdir(publicDir, { recursive: true });
await Promise.all([
  writeFile(indexPath, indexHtml.replace(markerPattern, seoBlock)),
  writeFile(
    path.join(publicDir, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
  ),
  writeFile(
    path.join(publicDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${canonicalUrl}</loc>\n  </url>\n</urlset>\n`,
  ),
]);

console.log(`SEO files generated for ${canonicalUrl}`);
