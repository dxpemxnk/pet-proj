import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../features/auth/authApi';
import AuthForm from '../features/auth/AuthForm';

const LoginPage = () => {
  const [login] = useLoginMutation();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (values: any) => {
    try {
      await login(values).unwrap();
      navigate('/');
    } catch (err: any) {
      setError(err.data?.message || 'Ошибка входа');
    }
  };

  return <AuthForm title="Вход" buttonText="Войти" onSubmit={handleLogin} error={error} />;
};

export default LoginPage;
