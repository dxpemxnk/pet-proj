import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from '../store/authSlice';
import { RootState } from '../store/store';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api', 
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 403) {
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
    
    if (refreshResult.data) {
      const data = refreshResult.data as { user: any, accessToken: string };
      api.dispatch(setCredentials(data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Books', 'User', 'Categories'],
  endpoints: () => ({}),
});
