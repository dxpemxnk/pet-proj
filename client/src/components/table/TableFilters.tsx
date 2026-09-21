/**
 * Отображает выпадающие списки фильтров по переданной конфигурации.
 * Получает выбранные значения и сообщает родителю ID изменённого фильтра и новое значение.
 * Пустое значение означает «Все»; проверку строк по правилам matches выполняет selectTableRows.
 */
import { MenuItem, TextField } from "@mui/material";
import type { TableFilter } from "./types";
export function TableFilters<T>({
  filters,
  values,
  onChange,
}: {
  filters: readonly TableFilter<T>[];
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
}) {
  return (
    <>
      {filters.map((filter) => (
        <TextField
          key={filter.id}
          select
          size="small"
          label={filter.label}
          value={values[filter.id] ?? ""}
          disabled={filter.disabled}
          sx={{ minWidth: 200, flex: "1 1 200px" }}
          onChange={(event) => onChange(filter.id, event.target.value)}
        >
          <MenuItem value="">Все</MenuItem>
          {filter.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      ))}
    </>
  );
}
