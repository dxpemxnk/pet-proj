/**
 * Создаёт общее хранилище Redux: состояние авторизации и кеш запросов RTK Query.
 * Подключает middleware API для обработки запросов и обновления кеша.
 * Экспортирует типы состояния и dispatch, используемые типизированными хуками.
 */
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { baseApi } from "../services/baseApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
