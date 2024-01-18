//
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { tasksReducer } from '../features/Todolists/tasks-slice';
import { todolistsReducer } from '../features/Todolists/todolists-slice';
import { UnknownAction, combineReducers } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { appReducer } from './app-slice';
import { authReducer } from '../features/Login/auth-slice';
import { configureStore } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
});
// непосредственно создаём store

export const store = configureStore({ reducer: rootReducer });
// определить автоматически тип всего объекта состояния

export type StateType = ReturnType<typeof store.getState>; //типизация стэйта
export type AppDispatchType = ThunkDispatch<StateType, unknown, UnknownAction>; //типизаци диспатча для санок
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, StateType, unknown, UnknownAction>; //типизация санок

export const useAppDispatch = useDispatch<AppDispatchType>; //кастомный хук возвращает протипизированный диспатч
export const useAppSelector: TypedUseSelectorHook<StateType> = useSelector; //протипизированный стэйтом селект

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
