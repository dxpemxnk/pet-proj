import type { SortState, TableConfig } from './types';

const collator = new Intl.Collator('ru', { sensitivity: 'base', numeric: true });
export function selectTableRows<T>(
  { rows, columns, search, filters = [] }: TableConfig<T>,
  query: string,
  filterValues: Record<string, string>,
  sort: SortState | null,
): T[] {
  const normalizedQuery = query.trim().toLocaleLowerCase('ru');
  const result = rows.filter((row) =>
    (!search || !normalizedQuery || search.getText(row).toLocaleLowerCase('ru').includes(normalizedQuery)) &&
    filters.every((filter) => !filterValues[filter.id] || filter.matches(row, filterValues[filter.id])),
  );
  const accessor = columns.find((column) => column.id === sort?.columnId)?.sortValue;
  if (sort && accessor) {
    result.sort((left, right) => {
      const a = accessor(left);
      const b = accessor(right);
      // Missing values remain at the end in either direction.
      if (a == null) return b == null ? 0 : 1;
      if (b == null) return -1;
      const comparison = typeof a === 'number' && typeof b === 'number' ? a - b : collator.compare(String(a), String(b));
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }
  return result;
}
