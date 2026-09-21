import { Alert, Box, Button, CircularProgress, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { TableSearch } from './TableSearch';
import { TableFilters } from './TableFilters';
import { TableSort } from './TableSort';
import { useTableData } from './useTableData';
import type { DataTableProps } from './types';

export function DataTable<T>({ getRowKey, label, loading, error, onRetry,
  emptyMessage = 'Данных пока нет.', ...config }: DataTableProps<T>) {
  const state = useTableData(config);
  return <Box>
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
      {config.search && <TableSearch label={config.search.label} value={state.query} onChange={state.setQuery} />}
      <TableFilters filters={config.filters ?? []} values={state.filterValues} onChange={state.setFilter} />
      <Button disabled={!state.hasSettings} onClick={state.reset}>Сбросить</Button>
    </Box>
    {loading ? <Box role="status" sx={{ p: 4, textAlign: 'center' }}><CircularProgress aria-label="Загрузка данных" /></Box>
      : error ? <Alert severity="error" action={onRetry && <Button color="inherit" onClick={onRetry}>Повторить</Button>}>{error}</Alert>
      : <>
        <Typography variant="body2" role="status" sx={{ mb: 1 }}>Показано: {state.visibleRows.length} из {config.rows.length}</Typography>
        <TableContainer component={Paper}>
          <Table aria-label={label} sx={{ minWidth: 650 }}>
            <TableHead><TableRow>{config.columns.map((column) => <TableCell key={column.id} align={column.align}
              sortDirection={state.sort?.columnId === column.id ? state.sort.direction : false}>
              {column.sortValue ? <TableSort columnId={column.id} label={column.label} sort={state.sort} onChange={state.toggleSort} /> : column.label}
            </TableCell>)}</TableRow></TableHead>
            <TableBody>
              {state.visibleRows.map((row) => <TableRow key={getRowKey(row)} hover>
                {config.columns.map((column) => <TableCell key={column.id} align={column.align}>{column.render(row)}</TableCell>)}
              </TableRow>)}
              {!state.visibleRows.length && <TableRow><TableCell colSpan={config.columns.length} align="center" sx={{ py: 5 }}>
                {config.rows.length ? 'Ничего не найдено. Измените поиск или фильтры.' : emptyMessage}
              </TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      </>}
  </Box>;
}
