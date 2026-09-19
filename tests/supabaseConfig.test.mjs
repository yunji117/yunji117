import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
const bundle = await build({ entryPoints: ['src/lib/supabaseConfig.ts'], bundle: true, write: false, format: 'esm', platform: 'node' });
const { validateSupabaseConfig } = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
const url = 'https://example.supabase.co';
const legacyKey = (role) => `header.${Buffer.from(JSON.stringify({ role })).toString('base64url')}.signature`;
test('server-only keys are rejected before client creation and build', () => {
  assert.match(validateSupabaseConfig(url, 'sb_secret_test-only'), /secret/);
  assert.ok(validateSupabaseConfig(url, legacyKey('service_role')));
  assert.ok(validateSupabaseConfig(url, legacyKey('authenticated')));
});
test('browser publishable and legacy anon keys are accepted', () => {
  assert.equal(validateSupabaseConfig(url, 'sb_publishable_test-only'), null);
  assert.equal(validateSupabaseConfig(url, legacyKey('anon')), null);
});
test('missing and malformed configuration is rejected', () => {
  assert.ok(validateSupabaseConfig('', ''));
  assert.ok(validateSupabaseConfig('invalid-url', 'sb_publishable_test-only'));
  assert.ok(validateSupabaseConfig(url, 'invalid-key'));
});
