import * as Yup from 'yup';

export const authSchema = Yup.object().shape({
  email: Yup.string()
    .email('Некорректный email')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(3, 'Минимум 3 символа')
    .required('Обязательное поле'),
});
