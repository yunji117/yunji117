import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
const bundle = await build({ entryPoints: ['src/lib/portfolioErrors.ts'], bundle: true, write: false, format: 'esm', platform: 'node' });
const { portfolioErrorMessage } = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
test('plain Supabase errors explain missing tables and columns', () => {
  for (const code of ['PGRST205', 'PGRST204', '42703']) {
    assert.match(portfolioErrorMessage({ code, message: 'missing schema' }, 'fallback'), /업데이트/);
  }
});
test('missing table grants and denied row policies have different remedies', () => {
  assert.match(portfolioErrorMessage({ code: '42501', message: 'permission denied for table projects' }, ''), /접근 권한/);
  assert.match(portfolioErrorMessage({ code: '42501', message: 'new row violates row-level security policy' }, ''), /관리자 등록/);
});
test('ordinary errors retain their messages; unknown errors use fallback', () => {
  assert.equal(portfolioErrorMessage({ message: 'File too large' }, 'fallback'), 'File too large');
  assert.equal(portfolioErrorMessage(new Error('Offline'), 'fallback'), 'Offline');
  assert.equal(portfolioErrorMessage(null, 'fallback'), 'fallback');
});
