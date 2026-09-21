import React, { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, MenuItem, Paper, Snackbar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useCreateBookMutation, useDeleteBookMutation, useGetBooksQuery,
  useGetCategoriesQuery, useUpdateBookMutation } from '../services/booksApi';
import { useAppSelector } from '../store/hooks';
import { Book } from '../types';

const emptyForm = { title: '', author: '', pages: '', category_id: '' };
function errorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = error.data;
    if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') return data.message;
  }
  return 'Не удалось выполнить действие. Попробуйте ещё раз.';
}

export default function BooksPage() {
  const { data, isLoading, error, refetch } = useGetBooksQuery();
  const categories = useGetCategoriesQuery();
  const [createBook, creating] = useCreateBookMutation();
  const [updateBook, updating] = useUpdateBookMutation();
  const [deleteBook, deleting] = useDeleteBookMutation();
  const user = useAppSelector((state) => state.auth.user);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [notice, setNotice] = useState('');
  const saving = creating.isLoading || updating.isLoading;

  function openEditor(book?: Book) {
    setEditing(book ?? null);
    setForm(book ? { title: book.title, author: book.author, pages: String(book.pages), category_id: String(book.category_id) } : emptyForm);
    setFormError('');
    setEditorOpen(true);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;
    const body = { title: form.title.trim(), author: form.author.trim(), pages: Number(form.pages), category_id: Number(form.category_id) };
    if (!body.title || !body.author || !Number.isInteger(body.pages) || body.pages < 1 || body.pages > 2147483647 || !categories.data?.categories.some((category) => category.id === body.category_id)) {
      setFormError('Заполните название и автора, выберите категорию и укажите целое положительное количество страниц.');
      return;
    }
    setFormError('');
    try {
      if (editing) await updateBook({ id: editing.id, body }).unwrap();
      else await createBook(body).unwrap();
      setEditorOpen(false);
      setNotice(editing ? 'Книга обновлена' : 'Книга добавлена');
    } catch (failure) { setFormError(errorMessage(failure)); }
  }

  async function confirmDelete() {
    if (!deleteTarget || deleting.isLoading) return;
    setDeleteError('');
    try {
      await deleteBook(deleteTarget.id).unwrap();
      setDeleteTarget(null);
      setNotice('Книга удалена');
    } catch (failure) { setDeleteError(errorMessage(failure)); }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <Typography variant="h4" component="h1">Каталог книг</Typography>
        {user && <Button variant="contained" onClick={() => openEditor()}>Добавить книгу</Button>}
      </Box>
      {!user && <Alert severity="info" sx={{ mb: 2 }}>Войдите, чтобы добавлять книги и управлять своими записями.</Alert>}
      {isLoading ? <Box role="status" sx={{ p: 4, textAlign: 'center' }}><CircularProgress aria-label="Загрузка книг" /></Box> : error ? (
        <Alert severity="error" action={<Button color="inherit" onClick={() => refetch()}>Повторить</Button>}>Не удалось загрузить книги.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="Каталог книг">
            <TableHead><TableRow>
              <TableCell>Название</TableCell><TableCell>Автор</TableCell><TableCell>Страниц</TableCell><TableCell>Категория</TableCell><TableCell>Действия</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {data?.books.map((book) => <TableRow key={book.id} hover>
                <TableCell component="th" scope="row">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell><TableCell>{book.pages}</TableCell>
                <TableCell>{categories.data?.categories.find((category) => category.id === book.category_id)?.name ?? book.Category?.name ?? `Категория №${book.category_id}`}</TableCell>
                <TableCell>{user?.id === book.user_id ? <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" aria-label={`Редактировать ${book.title}`} onClick={() => openEditor(book)}>Редактировать</Button>
                  <Button size="small" color="error" aria-label={`Удалить ${book.title}`} onClick={() => { setDeleteTarget(book); setDeleteError(''); }}>Удалить</Button>
                </Box> : '—'}</TableCell>
              </TableRow>)}
              {!data?.books.length && <TableRow><TableCell colSpan={5} align="center" sx={{ py: 5 }}>Книг пока нет. Добавьте первую книгу.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={editorOpen} onClose={() => { if (!saving) setEditorOpen(false); }} fullWidth maxWidth="sm" aria-labelledby="book-editor-title">
        <form onSubmit={save}>
          <DialogTitle id="book-editor-title">{editing ? 'Редактировать книгу' : 'Добавить книгу'}</DialogTitle>
          <DialogContent>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            <TextField autoFocus required fullWidth margin="normal" label="Название" value={form.title} disabled={saving} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            <TextField required fullWidth margin="normal" label="Автор" value={form.author} disabled={saving} onChange={(event) => setForm({ ...form, author: event.target.value })} />
            <TextField required fullWidth margin="normal" label="Количество страниц" type="number" slotProps={{ htmlInput: { min: 1, max: 2147483647, step: 1 } }} value={form.pages} disabled={saving} onChange={(event) => setForm({ ...form, pages: event.target.value })} />
            <TextField select required fullWidth margin="normal" label="Категория" value={form.category_id} disabled={saving || !categories.data?.categories.length || !!categories.error} onChange={(event) => setForm({ ...form, category_id: event.target.value })}>
              {categories.data?.categories.map((category) => <MenuItem key={category.id} value={String(category.id)}>{category.name}</MenuItem>)}
            </TextField>
            {categories.isLoading && <Typography role="status">Загрузка категорий…</Typography>}
            {!!categories.error && <Alert severity="error" action={<Button color="inherit" onClick={() => categories.refetch()}>Повторить</Button>}>Не удалось загрузить категории.</Alert>}
            {categories.data && !categories.data.categories.length && <Alert severity="warning">Нет доступных категорий. Сначала заполните справочник категорий.</Alert>}
          </DialogContent>
          <DialogActions>
            <Button disabled={saving} onClick={() => setEditorOpen(false)}>Отмена</Button>
            <Button type="submit" variant="contained" disabled={saving || !user || !!categories.error || !categories.data?.categories.length}>{saving ? 'Сохранение…' : 'Сохранить'}</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={!!deleteTarget} onClose={() => { if (!deleting.isLoading) setDeleteTarget(null); }} aria-labelledby="delete-book-title">
        <DialogTitle id="delete-book-title">Удалить книгу?</DialogTitle>
        <DialogContent>
          <DialogContentText>Книга «{deleteTarget?.title}» будет удалена из каталога. Это действие нельзя отменить.</DialogContentText>
          {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button disabled={deleting.isLoading} onClick={() => setDeleteTarget(null)}>Отмена</Button>
          <Button color="error" variant="contained" disabled={deleting.isLoading || !user} onClick={confirmDelete}>{deleting.isLoading ? 'Удаление…' : 'Удалить'}</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!notice} autoHideDuration={4000} onClose={() => setNotice('')}><Alert severity="success" onClose={() => setNotice('')}>{notice}</Alert></Snackbar>
    </Box>
  );
}
