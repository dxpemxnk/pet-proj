import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistrationMutation } from '../services/authApi';
import AuthForm from '../components/AuthForm';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/authSlice';

const RegisterPage = () => {
  const [registration] = useRegistrationMutation();
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (values: any) => {
    try {
      const result = await registration(values).unwrap();
      dispatch(setCredentials(result));
      navigate('/');
    } catch (err: any) {
      setError(err.data?.message || 'Ошибка регистрации');
    }
  };

  return <AuthForm title="Регистрация" buttonText="Создать аккаунт" onSubmit={handleRegister} error={error} />;
};

export default RegisterPage;
