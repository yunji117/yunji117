import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result = await build({
  entryPoints: ['src/lib/projectThumbnail.ts'],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
});
const { resolveProjectThumbnail } = await import(
  `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`
);

test('bundled thumbnail is reused only while the cover image is unchanged', () => {
  assert.equal(resolveProjectThumbnail('/cover.svg', undefined, '/cover.svg', '/thumb.webp'), '/thumb.webp');
  assert.equal(resolveProjectThumbnail('https://cdn.example/new.webp', undefined, '/cover.svg', '/thumb.webp'), undefined);
});

test('an explicitly supplied thumbnail remains authoritative', () => {
  assert.equal(resolveProjectThumbnail('/new.svg', '/custom.webp', '/old.svg', '/old-thumb.webp'), '/custom.webp');
});
