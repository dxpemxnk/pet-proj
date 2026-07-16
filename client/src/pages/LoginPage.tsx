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
