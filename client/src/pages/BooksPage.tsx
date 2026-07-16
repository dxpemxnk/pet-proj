import React from 'react';
import { useGetBooksQuery, useDeleteBookMutation } from '../services/booksApi';
import { 
  Container, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, Box 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppSelector } from '../store/hooks';

const BooksPage = () => {
  const { data, isLoading, error } = useGetBooksQuery();
  const [deleteBook] = useDeleteBookMutation();
  const currentUser = useAppSelector((state) => state.auth.user);

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>Ошибка загрузки данных</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Мои Документы
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Название</strong></TableCell>
              <TableCell><strong>Автор</strong></TableCell>
              <TableCell><strong>Страниц</strong></TableCell>
              <TableCell><strong>Действия</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.books.map((book) => (
              <TableRow key={book.id} hover>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.pages}</TableCell>
                <TableCell>
                  {currentUser?.id === book.user_id && (
                    <IconButton 
                      onClick={() => deleteBook(book.id)} 
                      color="error"
                      title="Удалить"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default BooksPage;
