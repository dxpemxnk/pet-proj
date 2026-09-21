/**
 * Страница каталога: получает книги и категории через API, задаёт колонки, поиск и фильтры.
 * Передаёт данные универсальной DataTable и управляет формами создания, редактирования и удаления.
 * Показывает ошибки и уведомления; кнопки изменения доступны владельцу книги.
 * Проверка прав на сервере остаётся обязательной: скрытие кнопок само по себе данные не защищает.
 */
import { useState } from "react";
import { Alert, Box, Button, Snackbar } from "@mui/material";
import {
  useCreateBookMutation,
  useDeleteBookMutation,
  useGetBooksQuery,
  useGetCategoriesQuery,
  useUpdateBookMutation,
} from "../services/booksApi";
import { useAppSelector } from "../store/hooks";
import { Book } from "../types";
import { DataTable } from "../components/table/DataTable";
import BookFormDialog from "../components/books/BookFormDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import PageHeader from "../components/PageHeader";
import type { BookInput } from "../services/booksApi";
import type { TableColumn, TableFilter } from "../components/table/types";

function errorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = error.data;
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    )
      return data.message;
  }
  return "Не удалось выполнить действие. Попробуйте ещё раз.";
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
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [notice, setNotice] = useState("");
  const saving = creating.isLoading || updating.isLoading;

  function openEditor(book?: Book) {
    setEditing(book ?? null);
    setFormError("");
    setEditorOpen(true);
  }

  async function save(body: BookInput) {
    if (saving || !user) return;
    setFormError("");
    try {
      if (editing) await updateBook({ id: editing.id, body }).unwrap();
      else await createBook(body).unwrap();
      setEditorOpen(false);
      setNotice(editing ? "Книга обновлена" : "Книга добавлена");
    } catch (failure) {
      setFormError(errorMessage(failure));
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || deleting.isLoading) return;
    setDeleteError("");
    try {
      await deleteBook(deleteTarget.id).unwrap();
      setDeleteTarget(null);
      setNotice("Книга удалена");
    } catch (failure) {
      setDeleteError(errorMessage(failure));
    }
  }

  const columns: TableColumn<Book>[] = [
    {
      id: "title",
      label: "Название",
      render: (book) => book.title,
      sortValue: (book) => book.title,
    },
    {
      id: "author",
      label: "Автор",
      render: (book) => book.author,
      sortValue: (book) => book.author,
    },
    {
      id: "pages",
      label: "Страниц",
      render: (book) => book.pages,
      sortValue: (book) => book.pages,
      align: "right",
    },
    {
      id: "category",
      label: "Категория",
      render: (book) =>
        categories.data?.categories.find(
          (category) => category.id === book.category_id,
        )?.name ??
        book.Category?.name ??
        "Категория №" + book.category_id,
    },
    {
      id: "actions",
      label: "Действия",
      render: (book) =>
        user?.id === book.user_id ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              aria-label={"Редактировать " + book.title}
              onClick={() => openEditor(book)}
            >
              Редактировать
            </Button>
            <Button
              size="small"
              color="error"
              aria-label={"Удалить " + book.title}
              onClick={() => {
                setDeleteTarget(book);
                setDeleteError("");
              }}
            >
              Удалить
            </Button>
          </Box>
        ) : (
          "—"
        ),
    },
  ];
  const filters: TableFilter<Book>[] = [
    {
      id: "category",
      label: "Категория",
      options:
        categories.data?.categories.map((category) => ({
          value: String(category.id),
          label: category.name,
        })) ?? [],
      matches: (book, value) => String(book.category_id) === value,
      disabled: categories.isLoading || !!categories.error,
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Каталог книг"
        action={
          user && (
            <Button variant="contained" onClick={() => openEditor()}>
              Добавить книгу
            </Button>
          )
        }
      />
      {!user && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Войдите, чтобы добавлять книги и управлять своими записями.
        </Alert>
      )}
      <DataTable
        rows={data?.books ?? []}
        columns={columns}
        getRowKey={(book) => book.id}
        label="Каталог книг"
        search={{
          label: "Поиск по названию или автору",
          getText: (book) => book.title + " " + book.author,
        }}
        filters={filters}
        loading={isLoading}
        error={error ? "Не удалось загрузить книги." : undefined}
        onRetry={() => refetch()}
        emptyMessage="Книг пока нет. Добавьте первую книгу."
      />
      {editorOpen && (
        <BookFormDialog
          book={editing}
          categories={categories.data?.categories ?? []}
          categoriesLoading={categories.isLoading}
          categoriesError={!!categories.error}
          onRetryCategories={() => categories.refetch()}
          onSubmit={save}
          onClose={() => setEditorOpen(false)}
          saving={saving}
          disabled={!user}
          error={formError}
        />
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Удалить книгу?"
        description={`Книга «${deleteTarget?.title ?? ""}» будет удалена из каталога. Это действие нельзя отменить.`}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
        pending={deleting.isLoading}
        disabled={!user}
        error={deleteError}
        confirmText="Удалить"
        pendingText="Удаление…"
        color="error"
      />
      <Snackbar
        open={!!notice}
        autoHideDuration={4000}
        onClose={() => setNotice("")}
      >
        <Alert severity="success" onClose={() => setNotice("")}>
          {notice}
        </Alert>
      </Snackbar>
    </Box>
  );
}
