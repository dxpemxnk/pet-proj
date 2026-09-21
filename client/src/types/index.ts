/**
 * Общие TypeScript-типы данных: пользователь, категория, книга и ответ авторизации.
 * Используются API и компонентами для проверки структуры данных при разработке.
 * Эти типы не проверяют фактическое содержимое ответа сервера во время выполнения.
 */
export interface User {
  id: number;
  email: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  pages: number;
  category_id: number;
  user_id: number;
  Category?: Category;
  User?: User;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
}
