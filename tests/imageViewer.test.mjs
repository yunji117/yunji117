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
const { getImageSwipeAction, moveImageViewer } = await import(moduleUrl);

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

test('maps requested swipe directions to previous and next images', () => {
  assert.equal(getImageSwipeAction({ x: 240, y: 200 }, { x: 140, y: 205 }, 390), 'previous');
  assert.equal(getImageSwipeAction({ x: 140, y: 200 }, { x: 240, y: 195 }, 390), 'next');
  assert.equal(getImageSwipeAction({ x: 200, y: 100 }, { x: 205, y: 220 }, 390), null);
});

test('prioritizes a left swipe from the right screen edge as modal exit', () => {
  assert.equal(getImageSwipeAction({ x: 380, y: 200 }, { x: 270, y: 202 }, 390), 'exit');
});
