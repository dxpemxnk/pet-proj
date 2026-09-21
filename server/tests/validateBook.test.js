const { test } = require('node:test');
const assert = require('node:assert/strict');
const modelsPath = require.resolve('../db/models');
require.cache[modelsPath] = { id: modelsPath, filename: modelsPath, loaded: true, exports: {
  Category: { findByPk: async (id) => id === 1 ? { id } : null },
} };
const validateBook = require('../middleware/validateBook');

async function validate(body) {
  const req = { body };
  const result = { next: false, status: 200 };
  const res = { status(code) { result.status = code; return this; }, json(data) { result.data = data; return this; } };
  await validateBook(req, res, () => { result.next = true; });
  return { ...result, body: req.body };
}
const valid = { title: ' Book ', author: ' Author ', pages: 100, category_id: 1 };
test('accepts valid books, trims text and discards ownership supplied by client', async () => {
  const result = await validate({ ...valid, user_id: 999 });
  assert.equal(result.next, true);
  assert.deepEqual(result.body, { title: 'Book', author: 'Author', pages: 100, category_id: 1 });
});
test('rejects missing fields, blank text and invalid page counts', async () => {
  for (const body of [undefined, {}, { ...valid, title: ' ' }, { ...valid, author: 42 }, ...[0, -1, 1.5, '100', 2147483648].map(pages => ({ ...valid, pages }))]) {
    const result = await validate(body);
    assert.equal(result.status, 400);
    assert.equal(result.next, false);
  }
});
test('rejects unknown or malformed categories', async () => {
  for (const category_id of [2, 0, -1, 1.5, '1']) {
    const result = await validate({ ...valid, category_id });
    assert.equal(result.status, 400);
    assert.equal(result.next, false);
  }
});
