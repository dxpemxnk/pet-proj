import { TableSortLabel } from '@mui/material';
import type { SortState } from './types';
export function TableSort({ columnId, label, sort, onChange }: {
  columnId: string; label: string; sort: SortState | null; onChange: (id: string) => void;
}) {
  const active = sort?.columnId === columnId;
  const next = !active ? 'по возрастанию' : sort.direction === 'asc' ? 'по убыванию' : 'сбросить';
  return <TableSortLabel active={active} direction={active ? sort.direction : 'asc'}
    aria-label={`${label}: ${next}`} onClick={() => onChange(columnId)}>{label}</TableSortLabel>;
}
