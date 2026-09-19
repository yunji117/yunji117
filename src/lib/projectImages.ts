// Store bundled images by source name so editing a built-in project on localhost
// never saves a localhost-only image URL to the shared database.
const assets = import.meta.glob('../assets/img/*', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const entries = Object.entries(assets).map(([path, url]) => ({ name: path.split('/').pop()!, url }));
export function encodeProjectImage(value: string): string {
  if (!value || value.startsWith('asset:')) return value;
  const base = typeof window === 'undefined' ? 'http://localhost' : window.location.origin;
  const found = entries.find((item) => new URL(item.url, base).href === new URL(value, base).href);
  return found ? `asset:${found.name}` : value;
}
export function decodeProjectImage(value: string): string {
  if (!value.startsWith('asset:')) return value;
  return entries.find((item) => item.name === value.slice(6))?.url ?? '';
}
