//
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { tasksReducer } from '../features/Todolists/tasks-reducer';
import { todolistsReducer } from '../features/Todolists/todolists-reducer';
import { UnknownAction, combineReducers } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { appReducer } from './app-reducer';
import { authReducer } from '../features/Login/auth-reducer';
import { configureStore } from '@reduxjs/toolkit';

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
});
// непосредственно создаём store
export const store = configureStore({ reducer: rootReducer });
// определить автоматически тип всего объекта состояния
export type StateType = ReturnType<typeof rootReducer>;
export type AppDispatchType = ThunkDispatch<StateType, unknown, UnknownAction>;
export const useAppDispatch = useDispatch<AppDispatchType>;
export const useAppSelector: TypedUseSelectorHook<StateType> = useSelector;

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
