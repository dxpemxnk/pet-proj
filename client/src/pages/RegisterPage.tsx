import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistrationMutation } from '../features/auth/authApi';
import AuthForm from '../features/auth/AuthForm';

const RegisterPage = () => {
  const [registration] = useRegistrationMutation();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (values: any) => {
    try {
      await registration(values).unwrap();
      navigate('/');
    } catch (err: any) {
      setError(err.data?.message || 'Ошибка регистрации');
    }
  };

  return <AuthForm title="Регистрация" buttonText="Создать аккаунт" onSubmit={handleRegister} error={error} />;
};

export default RegisterPage;
