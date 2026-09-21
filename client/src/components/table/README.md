# DataTable

Pass `rows`, `columns`, `getRowKey` and an accessible `label` to reuse the table.
Each column has a unique `id`, a `label`, a `render(row)` function and an optional
`sortValue(row)` accessor. Action buttons can be rendered as an ordinary column.

Optional `search` supplies a label and `getText(row)`. Optional `filters` supplies
unique IDs, labels, options and `matches(row, value)` predicates. An empty filter
value means all rows. Filters are combined with AND; search is case-insensitive.
Sorting cycles through ascending, descending and original order. Null values sort
last. Processing is local and does not mutate the supplied data.

```tsx
<DataTable
  label="Пользователи"
  rows={users}
  getRowKey={(user) => user.id}
  columns={[
    { id: 'email', label: 'Email', render: (user) => user.email,
      sortValue: (user) => user.email },
  ]}
  search={{ label: 'Поиск по email', getText: (user) => user.email }}
/>
```

`loading`, `error`, `onRetry` and `emptyMessage` customize request states.
Search/filter/sort state is preserved when rows refresh after CRUD actions.
When switching to a different dataset on the same mounted page, use a React
`key` on DataTable to reset its state. `useTableData` is available independently
for custom layouts. Tests require Node.js 22.6+ with type stripping support.
