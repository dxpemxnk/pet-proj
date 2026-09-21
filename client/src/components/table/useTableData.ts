/**
 * Хук управления таблицей: хранит поисковый запрос, значения фильтров и выбранную сортировку.
 * Через selectTableRows вычисляет видимые строки при изменении данных или настроек.
 * Возвращает результат и обработчики для компонентов управления, включая общий сброс.
 * Сортировка переключается по циклу: возрастание, убывание, исходный порядок.
 */
import { useMemo, useState } from 'react';
import { selectTableRows } from './selectTableRows';
import type { SortState, TableConfig } from './types';

export function useTableData<T>(config: TableConfig<T>) {
  const [query, setQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<SortState | null>(null);
  const { rows, columns, search, filters } = config;
  const visibleRows = useMemo(() => selectTableRows({ rows, columns, search, filters }, query, filterValues, sort),
    [rows, columns, search, filters, query, filterValues, sort]);
  function toggleSort(columnId: string) {
    setSort((current) => current?.columnId !== columnId ? { columnId, direction: 'asc' }
      : current.direction === 'asc' ? { columnId, direction: 'desc' } : null);
  }
  function reset() { setQuery(''); setFilterValues({}); setSort(null); }
  return { visibleRows, query, setQuery, filterValues,
    setFilter: (id: string, value: string) => setFilterValues((current) => ({ ...current, [id]: value })),
    sort, toggleSort, reset, hasSettings: !!query || Object.values(filterValues).some(Boolean) || !!sort };
}
