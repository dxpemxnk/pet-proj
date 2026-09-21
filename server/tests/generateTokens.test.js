const { test } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const generateTokens = require('../utils/generateTokens');

test('generates verifiable access and refresh tokens with distinct lifetimes', () => {
  const previousAccess = process.env.ACCESS_TOKEN;
  const previousRefresh = process.env.REFRESH_TOKEN;
  process.env.ACCESS_TOKEN = 'test-access-secret';
  process.env.REFRESH_TOKEN = 'test-refresh-secret';
  try {
    const user = { id: 1, email: 'test@example.com' };
    const tokens = generateTokens({ user });
    const access = jwt.verify(tokens.accessToken, process.env.ACCESS_TOKEN);
    const refresh = jwt.verify(tokens.refreshToken, process.env.REFRESH_TOKEN);
    assert.deepEqual(access.user, user);
    assert.deepEqual(refresh.user, user);
    assert.equal(access.exp - access.iat, 5 * 60);
    assert.equal(refresh.exp - refresh.iat, 12 * 60 * 60);
    assert.throws(() => jwt.verify(tokens.accessToken, process.env.REFRESH_TOKEN));
  } finally {
    if (previousAccess === undefined) delete process.env.ACCESS_TOKEN;
    else process.env.ACCESS_TOKEN = previousAccess;
    if (previousRefresh === undefined) delete process.env.REFRESH_TOKEN;
    else process.env.REFRESH_TOKEN = previousRefresh;
  }
});
