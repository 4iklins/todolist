//
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { tasksReducer } from './tasks-reducer';
import { todolistsReducer } from './todolists-reducer';
import { combineReducers, compose, legacy_createStore, applyMiddleware, AnyAction } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { appReducer } from './app-reducer';
import { authReducer } from './auth-reducer';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
});
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// непосредственно создаём store
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type StateType = ReturnType<typeof rootReducer>;
export type AppDispatchType = ThunkDispatch<StateType, unknown, AnyAction>;
export const useAppDispatch = useDispatch<AppDispatchType>;
export const useAppSelector: TypedUseSelectorHook<StateType> = useSelector;

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
