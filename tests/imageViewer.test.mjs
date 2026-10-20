import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result = await build({
  entryPoints: ['./src/lib/imageViewer.ts'],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
});
const moduleUrl = `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`;
const { moveImageViewer } = await import(moduleUrl);

test('moves to the previous and next gallery image', () => {
  const images = ['first.png', 'second.png', 'third.png'];
  assert.deepEqual(moveImageViewer(images, 'second.png', -1), { image: 'first.png' });
  assert.deepEqual(moveImageViewer(images, 'second.png', 1), { image: 'third.png' });
});

test('keeps the current image and reports gallery boundaries', () => {
  const images = ['first.png', 'last.png'];
  assert.deepEqual(moveImageViewer(images, 'first.png', -1), { image: 'first.png', boundary: 'first' });
  assert.deepEqual(moveImageViewer(images, 'last.png', 1), { image: 'last.png', boundary: 'last' });
});
