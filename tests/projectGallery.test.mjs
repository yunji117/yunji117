import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result = await build({ entryPoints: ['src/lib/projectGallery.ts'], bundle: true, write: false, format: 'esm', platform: 'node' });
const { moveGalleryImage } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);

test('moves a dragged image to the target position without mutating the original gallery', () => {
  const images = ['cover.png', 'details.png', 'mobile.png'];

  assert.deepEqual(moveGalleryImage(images, 1, 0), ['details.png', 'cover.png', 'mobile.png']);
  assert.deepEqual(moveGalleryImage(images, 0, 2), ['details.png', 'mobile.png', 'cover.png']);
  assert.deepEqual(images, ['cover.png', 'details.png', 'mobile.png']);
});

test('keeps the gallery unchanged for invalid selections or target positions', () => {
  const images = ['cover.png', 'details.png'];

  assert.equal(moveGalleryImage(images, 0, 0), images);
  assert.equal(moveGalleryImage(images, 1, 2), images);
  assert.equal(moveGalleryImage(images, -1, 1), images);
  assert.equal(moveGalleryImage(images, 2, -1), images);
});
