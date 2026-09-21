import { baseApi } from './baseApi';
import { Book, Category } from '../types';
export type BookInput = Pick<Book, 'title' | 'author' | 'pages' | 'category_id'>;
export const booksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<{ books: Book[] }, void>({ query: () => '/books', providesTags: ['Books'] }),
    getCategories: builder.query<{ categories: Category[] }, void>({ query: () => '/categories', providesTags: ['Categories'] }),
    createBook: builder.mutation<{ book: Book }, BookInput>({
      query: (body) => ({ url: '/books', method: 'POST', body }), invalidatesTags: ['Books'],
    }),
    updateBook: builder.mutation<{ updated: boolean }, { id: number; body: BookInput }>({
      query: ({ id, body }) => ({ url: `/books/${id}`, method: 'PUT', body }), invalidatesTags: ['Books'],
    }),
    deleteBook: builder.mutation<{ message: string }, number>({
      query: (id) => ({ url: `/books/${id}`, method: 'DELETE' }), invalidatesTags: ['Books'],
    }),
  }),
});
export const { useGetBooksQuery, useGetCategoriesQuery, useCreateBookMutation, useUpdateBookMutation, useDeleteBookMutation } = booksApi;
