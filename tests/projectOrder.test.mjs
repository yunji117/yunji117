import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
const result = await build({ entryPoints: ['src/lib/projectOrder.ts'], bundle: true, write: false, format: 'esm', platform: 'node' });
const { moveProject, sortProjects } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
test('dragging reorders both directions without changing the input', () => {
  const ids = ['old', 'new', 'design'];
  assert.deepEqual(moveProject(ids, 'old', 'design'), ['new', 'design', 'old']);
  assert.deepEqual(moveProject(ids, 'design', 'old'), ['design', 'old', 'new']);
  assert.deepEqual(ids, ['old', 'new', 'design']);
  assert.equal(moveProject(ids, 'missing', 'old'), ids);
});
test('persisted order applies to static and database projects and appends new projects', () => {
  const projects = [{ id: '1' }, { id: 'uuid', sortOrder: 8 }, { id: '2' }, { id: 'new', sortOrder: 9 }];
  assert.deepEqual(sortProjects(projects, ['uuid', '2', '1']).map((item) => item.id), ['uuid', '2', '1', 'new']);
});
test('unknown saved IDs and missing numeric orders do not introduce NaN sorting', () => {
  assert.deepEqual(sortProjects([{ id: '2' }, { id: 'uuid' }], ['deleted']).map((item) => item.id), ['uuid', '2']);
});
