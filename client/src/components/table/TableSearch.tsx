import { TextField } from '@mui/material';
export function TableSearch({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <TextField type="search" size="small" label={label} value={value}
    onChange={(event) => onChange(event.target.value)} sx={{ flex: '1 1 260px' }} />;
}
