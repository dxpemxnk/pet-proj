/**
 * Страница входа: передаёт оформление и обработчик отправки в общую AuthForm.
 * Отправляет email и пароль в API; при успехе сохраняет пользователя и токен в Redux
 * и открывает каталог, а при ошибке возвращает её сообщение в форму.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../services/authApi';
import AuthForm from '../components/AuthForm';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/authSlice';

const LoginPage = () => {
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (values: any) => {
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials(result));
      navigate('/');
    } catch (err: any) {
      setError(err.data?.message || 'Ошибка входа');
    }
  };

  return <AuthForm title="Вход" buttonText="Войти" onSubmit={handleLogin} error={error} />;
};

export default LoginPage;
