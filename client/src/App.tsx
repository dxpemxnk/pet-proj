import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BooksPage from './pages/BooksPage';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { useLogoutMutation } from './services/authApi';
import { logOut } from './store/authSlice';

function App() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logOut());
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            BookApp
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/">Книги</Button>
            {user ? (
              <>
                <Typography variant="body1" sx={{ alignSelf: 'center', ml: 2 }}>
                  {user.email}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>Выйти</Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">Войти</Button>
                <Button color="inherit" component={Link} to="/register">Регистрация</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<BooksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
