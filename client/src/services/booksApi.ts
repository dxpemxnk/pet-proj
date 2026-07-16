import { baseApi } from './baseApi';
import { Book } from '../types';

export const booksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<{ message: string; books: Book[] }, void>({
      query: () => '/books',
      providesTags: ['Books'],
    }),
    createBook: builder.mutation<Book, Partial<Book>>({
      query: (body) => ({
        url: '/books',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Books'],
    }),
    deleteBook: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/books/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Books'],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useCreateBookMutation,
  useDeleteBookMutation,
} = booksApi;
