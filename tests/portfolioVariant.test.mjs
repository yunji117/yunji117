import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const isRealProfilePath = (pathname) => {
  const normalizedPath = pathname.replace(/\/+$/, '');
  return normalizedPath.endsWith('/realyunji');
};

describe('portfolio profile variant', () => {
  it('uses the real portrait on the realyunji entry path', () => {
    assert.equal(isRealProfilePath('/yunji117/realyunji/'), true);
    assert.equal(isRealProfilePath('/realyunji'), true);
  });

  it('keeps the character portrait on the default portfolio path', () => {
    assert.equal(isRealProfilePath('/yunji117/'), false);
    assert.equal(isRealProfilePath('/'), false);
  });
});
