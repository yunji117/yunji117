import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const result = await build({
  entryPoints: ['src/lib/projectCollection.ts'],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
});
const { mergePortfolioProjects } = await import(
  `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`
);

const project = (id, image, extra = {}) => ({
  id,
  title: id,
  description: '',
  shortDesc: '',
  image,
  category: 'personal',
  stack: [],
  overview: '',
  goal: '',
  difficulties: [],
  ...extra,
});

test('admin and public collections retain bundled projects missing from the database', () => {
  const fallback = [project('1', '/one.svg'), project('2', '/two.svg')];
  const database = [project('1', 'https://cdn.example/one.webp'), project('custom', 'https://cdn.example/custom.webp')];

  assert.deepEqual(
    mergePortfolioProjects(fallback, database).map(({ id }) => id),
    ['1', '2', 'custom'],
  );
});

test('database content wins while an invalid empty cover falls back to the bundled image', () => {
  const fallback = project('1', '/one.svg', { title: 'Bundled', thumbnailUrl: '/one-thumb.webp' });

  const updated = mergePortfolioProjects([fallback], [project('1', 'https://cdn.example/new.webp', { title: 'Saved' })])[0];
  assert.equal(updated.title, 'Saved');
  assert.equal(updated.image, 'https://cdn.example/new.webp');
  assert.equal(updated.thumbnailUrl, undefined);

  const incomplete = mergePortfolioProjects([fallback], [project('1', '', { title: 'Saved' })])[0];
  assert.equal(incomplete.image, '/one.svg');
  assert.equal(incomplete.thumbnailUrl, '/one-thumb.webp');
});
