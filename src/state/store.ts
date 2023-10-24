import { legacy_createStore, combineReducers } from 'redux';
import { tasksReducer } from './tasks-reducer';
import { todolistsReducer } from './todolists-reducer';

const reducers = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
});

export const store = legacy_createStore(reducers);

export type Dispatch = typeof store.dispatch
export type StateType = ReturnType<typeof reducers>

//@ts-ignore
window.store = store