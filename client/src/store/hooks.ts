/**
 * Типизированные обёртки Redux для компонентов приложения.
 * useAppSelector читает данные из хранилища, useAppDispatch отправляет действия.
 * Типы RootState и AppDispatch позволяют TypeScript проверять обращения к состоянию.
 */
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
