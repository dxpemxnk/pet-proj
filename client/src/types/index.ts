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
