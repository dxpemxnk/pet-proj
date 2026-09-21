/**
 * Форма добавления и редактирования книги: хранит поля, проверяет их и передаёт BookInput родителю.
 * Получает категории и состояние запросов через параметры, сама API не вызывает.
 * Родитель монтирует форму при открытии, чтобы каждое открытие начиналось с актуальных данных книги.
 */
import { useState, type FormEvent } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import type { Book, Category } from '../../types';
import type { BookInput } from '../../services/booksApi';

interface BookFormDialogProps {
  book: Book | null;
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: boolean;
  onRetryCategories: () => void;
  onSubmit: (body: BookInput) => Promise<void>;
  onClose: () => void;
  saving: boolean;
  disabled: boolean;
  error: string;
}

export default function BookFormDialog({
  book,
  categories,
  categoriesLoading,
  categoriesError,
  onRetryCategories,
  onSubmit,
  onClose,
  saving,
  disabled,
  error,
}: BookFormDialogProps) {
  const [form, setForm] = useState(() =>
    book
      ? {
          title: book.title,
          author: book.author,
          pages: String(book.pages),
          category_id: String(book.category_id),
        }
      : { title: '', author: '', pages: '', category_id: '' },
  );

  const [validationError, setValidationError] = useState('');

  async function save(event: FormEvent) {
    event.preventDefault();
    if (saving || disabled || categoriesLoading || categoriesError) return;
    const body = {
      title: form.title.trim(),
      author: form.author.trim(),
      pages: Number(form.pages),
      category_id: Number(form.category_id),
    };
    if (
      !body.title ||
      !body.author ||
      !Number.isInteger(body.pages) ||
      body.pages < 1 ||
      body.pages > 2147483647 ||
      !categories.some((category) => category.id === body.category_id)
    ) {
      setValidationError(
        'Заполните название и автора, выберите категорию и укажите целое положительное количество страниц.',
      );
      return;
    }
    setValidationError('');
    await onSubmit(body);
  }
  return (
    <Dialog
      open={true}
      onClose={() => {
        if (!saving) onClose();
      }}
      fullWidth
      maxWidth="sm"
      aria-labelledby="book-editor-title"
    >
      <form onSubmit={save}>
        <DialogTitle id="book-editor-title">
          {book ? 'Редактировать книгу' : 'Добавить книгу'}
        </DialogTitle>
        <DialogContent>
          {(validationError || error) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {validationError || error}
            </Alert>
          )}
          <TextField
            autoFocus
            required
            fullWidth
            margin="normal"
            label="Название"
            value={form.title}
            disabled={saving}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            label="Автор"
            value={form.author}
            disabled={saving}
            onChange={(event) => setForm({ ...form, author: event.target.value })}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            label="Количество страниц"
            type="number"
            slotProps={{ htmlInput: { min: 1, max: 2147483647, step: 1 } }}
            value={form.pages}
            disabled={saving}
            onChange={(event) => setForm({ ...form, pages: event.target.value })}
          />
          <TextField
            select
            required
            fullWidth
            margin="normal"
            label="Категория"
            value={form.category_id}
            disabled={saving || !categories.length || !!categoriesError}
            onChange={(event) => setForm({ ...form, category_id: event.target.value })}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={String(category.id)}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          {categoriesLoading && <Typography role="status">Загрузка категорий…</Typography>}
          {!!categoriesError && (
            <Alert
              severity="error"
              action={
                <Button color="inherit" onClick={() => onRetryCategories()}>
                  Повторить
                </Button>
              }
            >
              Не удалось загрузить категории.
            </Alert>
          )}
          {!categoriesLoading && !categoriesError && !categories.length && (
            <Alert severity="warning">
              Нет доступных категорий. Сначала заполните справочник категорий.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button disabled={saving} onClick={() => onClose()}>
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving || disabled || !!categoriesError || !categories.length}
          >
            {saving ? 'Сохранение…' : 'Сохранить'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
