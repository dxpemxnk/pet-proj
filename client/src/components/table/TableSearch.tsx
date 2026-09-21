/**
 * Поле поиска таблицы: получает подпись, текущее значение и обработчик onChange.
 * При вводе передаёт текст родителю; само строки не фильтрует и состояние не хранит.
 * DataTable связывает это поле с поисковым запросом в useTableData.
 */
import { TextField } from '@mui/material';

export function TableSearch({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <TextField type="search" size="small" label={label} value={value}
    onChange={(event) => onChange(event.target.value)} sx={{ flex: '1 1 260px' }} />;
}
