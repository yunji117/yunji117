import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bundle = await build({ entryPoints: ['src/lib/portfolioAuth.ts'], bundle: true, write: false, format: 'esm', platform: 'node' });
const { observePortfolioAuth } = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
const flush = () => new Promise((resolve) => setImmediate(resolve));
const session = (id = 'owner', token = 'token') => ({ user: { id, email: `${id}@example.com` }, access_token: token });
const deferred = () => {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
};
function fixture({ stored = null, rpc = () => Promise.resolve({ data: true, error: null }), initialize = () => Promise.resolve({ error: null }), getSession } = {}) {
  let callback;
  let unsubscribed = false;
  let calls = 0;
  const states = [];
  const client = {
    auth: {
      initialize,
      getSession: getSession ?? (() => Promise.resolve({ data: { session: stored }, error: null })),
      onAuthStateChange: (cb) => { callback = cb; return { data: { subscription: { unsubscribe: () => { unsubscribed = true; } } } }; },
    },
    rpc: () => { calls++; return { abortSignal: () => rpc() }; },
  };
  const controller = observePortfolioAuth(client, (next) => states.push(next));
  return { controller, states, emit: (next) => callback('SIGNED_IN', next), last: () => states.at(-1), calls: () => calls, unsubscribed: () => unsubscribed };
}

test('restores saved login on reload even without an auth event; admin plus card is enabled', async () => {
  const f = fixture({ stored: session() });
  await flush();
  assert.equal(f.last().phase, 'admin');
  assert.equal(f.last().session.user.id, 'owner');
  f.controller.dispose();
});

test('OAuth SIGNED_IN recognizes admin and repeated focus events do not reset access', async () => {
  const f = fixture(); await flush();
  assert.equal(f.last().phase, 'signed-out');
  f.emit(session()); await flush();
  assert.equal(f.last().phase, 'admin');
  f.emit(session()); await flush();
  assert.equal(f.calls(), 1);
  f.controller.dispose();
});

test('a failed permission RPC preserves login and retry recovers the admin state', async () => {
  let failed = true;
  const f = fixture({ stored: session(), rpc: () => Promise.resolve(failed ? { data: null, error: { code: 'PGRST202', message: 'function missing' } } : { data: true, error: null }) });
  await flush();
  assert.equal(f.last().phase, 'error');
  assert.equal(f.last().session.user.id, 'owner');
  assert.match(f.last().message, /PGRST202/);
  failed = false; f.controller.retry(); await flush();
  assert.equal(f.last().phase, 'admin');
  f.controller.dispose();
});

test('non-admin users remain logged in, with no admin access granted', async () => {
  const f = fixture({ stored: session('visitor'), rpc: () => Promise.resolve({ data: false, error: null }) });
  await flush();
  assert.equal(f.last().phase, 'member');
  assert.equal(f.last().session.user.id, 'visitor');
  f.controller.dispose();
});

test('sign-out invalidates a pending permission request', async () => {
  const pending = deferred();
  const f = fixture({ stored: session(), rpc: () => pending.promise });
  await flush(); f.emit(null); await flush();
  pending.resolve({ data: true, error: null }); await flush();
  assert.equal(f.last().phase, 'signed-out');
  assert.equal(f.last().session, null);
  f.controller.dispose();
});

test('old account permission result cannot authorize a newly signed-in account', async () => {
  const pending = deferred(); let first = true;
  const f = fixture({ stored: session(), rpc: () => { if (first) { first = false; return pending.promise; } return Promise.resolve({ data: false, error: null }); } });
  await flush(); f.emit(session('visitor', 'different')); await flush();
  pending.resolve({ data: true, error: null }); await flush();
  assert.equal(f.last().phase, 'member');
  assert.equal(f.last().session.user.id, 'visitor');
  f.controller.dispose();
});

test('late initial session read cannot overwrite a newer OAuth event', async () => {
  const pending = deferred();
  const f = fixture({ getSession: () => pending.promise });
  await flush(); f.emit(session()); await flush();
  pending.resolve({ data: { session: null }, error: null }); await flush();
  assert.equal(f.last().phase, 'admin');
  f.controller.dispose();
});

test('OAuth callback errors are reported instead of showing a new login prompt', async () => {
  const f = fixture({ initialize: () => Promise.resolve({ error: { message: 'OAuth callback failed' } }) });
  await flush();
  assert.equal(f.last().phase, 'error');
  assert.match(f.last().message, /OAuth callback failed/);
  f.controller.dispose();
});

test('unmount cancels late updates and unsubscribes (StrictMode cleanup)', async () => {
  const pending = deferred();
  const f = fixture({ stored: session(), rpc: () => pending.promise });
  await flush(); f.controller.dispose(); const count = f.states.length;
  pending.resolve({ data: true, error: null }); await flush();
  assert.equal(f.states.length, count);
  assert.equal(f.unsubscribed(), true);
});
