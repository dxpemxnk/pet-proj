const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  selectTableRows,
} = require("../src/components/table/selectTableRows.ts");
const rows = Object.freeze([
  Object.freeze({
    id: 1,
    name: "Бета",
    author: "Анна",
    pages: 100,
    category: "a",
  }),
  Object.freeze({
    id: 2,
    name: "Альфа",
    author: "Анна",
    pages: 9,
    category: "b",
  }),
  Object.freeze({
    id: 3,
    name: "Гамма",
    author: "Борис",
    pages: 20,
    category: "a",
  }),
]);
const config = {
  rows,
  columns: [
    { id: "name", sortValue: (row) => row.name },
    { id: "pages", sortValue: (row) => row.pages },
  ],
  search: { getText: (row) => row.name + " " + row.author },
  filters: [
    { id: "category", matches: (row, value) => row.category === value },
  ],
};
const ids = (result) => result.map((row) => row.id);
test("search ignores case and outer whitespace and combines with filters", () => {
  assert.deepEqual(
    ids(selectTableRows(config, " АННА ", { category: "a" }, null)),
    [1],
  );
  assert.deepEqual(ids(selectTableRows(config, "альф", {}, null)), [2]);
  assert.deepEqual(selectTableRows(config, "нет", {}, null), []);
});
test("sorts numbers numerically in both directions without mutating input", () => {
  assert.deepEqual(
    ids(
      selectTableRows(config, "", {}, { columnId: "pages", direction: "asc" }),
    ),
    [2, 3, 1],
  );
  assert.deepEqual(
    ids(
      selectTableRows(config, "", {}, { columnId: "pages", direction: "desc" }),
    ),
    [1, 3, 2],
  );
  assert.deepEqual(ids(rows), [1, 2, 3]);
});
test("sorts Russian names and restores original order without sorting", () => {
  assert.deepEqual(
    ids(
      selectTableRows(config, "", {}, { columnId: "name", direction: "asc" }),
    ),
    [2, 1, 3],
  );
  assert.deepEqual(
    ids(selectTableRows(config, "", { category: "" }, null)),
    [1, 2, 3],
  );
});
test("supports different data shapes and keeps missing values last", () => {
  const other = {
    rows: [{ score: null }, { score: 2 }, { score: 10 }],
    columns: [{ id: "score", sortValue: (row) => row.score }],
  };
  assert.deepEqual(
    selectTableRows(
      other,
      "",
      {},
      { columnId: "score", direction: "desc" },
    ).map((row) => row.score),
    [10, 2, null],
  );
  assert.deepEqual(selectTableRows({ ...other, rows: [] }, "", {}, null), []);
});
