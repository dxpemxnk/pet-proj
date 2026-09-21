/**
 * Контракты универсальной таблицы. Тип T описывает одну строку произвольной структуры.
 * TableColumn задаёт отображение ячейки render и необязательное значение сортировки sortValue.
 * TableFilter задаёт варианты выбора и правило matches; TableConfig объединяет данные и настройки.
 * DataTableProps добавляет ключ строки, подпись таблицы и параметры загрузки и ошибок.
 */
import type { Key, ReactNode } from 'react';

export type SortValue = string | number | null | undefined;
export interface TableColumn<T> {
  id: string;
  label: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => SortValue;
  align?: 'left' | 'center' | 'right';
}
export interface TableFilter<T> {
  id: string;
  label: string;
  options: readonly { value: string; label: string }[];
  matches: (row: T, value: string) => boolean;
  disabled?: boolean;
}
export interface SortState { columnId: string; direction: 'asc' | 'desc' }
export interface TableConfig<T> {
  rows: readonly T[];
  columns: readonly TableColumn<T>[];
  search?: { label: string; getText: (row: T) => string };
  filters?: readonly TableFilter<T>[];
}
export interface DataTableProps<T> extends TableConfig<T> {
  getRowKey: (row: T) => Key;
  label: string;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  emptyMessage?: string;
}
