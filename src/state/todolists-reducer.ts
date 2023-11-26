import { v1 } from 'uuid';
import { TodolistType, todolistApi } from '../api/todolist-api';
import { Dispatch } from 'redux';

export type DeleteTodolistAT = ReturnType<typeof deleteTodolistAC>;

export type AddTodoListAT = ReturnType<typeof addTodolistAC>;

export type SetTodolistsAT = ReturnType<typeof setTodolistsAC>;

export type ActionTodolistsType =
  | AddTodoListAT
  | DeleteTodolistAT
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | SetTodolistsAT;

export type FilterType = 'all' | 'completed' | 'active';
export type TodolistDomainType = TodolistType & { filter: FilterType };
const initialState: TodolistDomainType[] = [];

export const todolistsReducer = (state = initialState, action: ActionTodolistsType): TodolistDomainType[] => {
  switch (action.type) {
    case 'SET-TODOS':
      return action.payload.todoLists.map(tl => ({ ...tl, filter: 'all' }));
    case 'DELETE-TODOLIST':
      return state.filter(tl => tl.id !== action.payload.todolistId);
    case 'ADD-TODOLIST':
      return [{ ...action.payload.todolist, filter: 'all' }, ...state];
    case 'CHANGE-TITLE':
      return state.map(tl =>
        tl.id === action.payload.todolistId ? { ...tl, title: action.payload.todolistTitle } : tl
      );
    case 'CHANGE-TODOLIST-FILTER':
      return state.map(todolist =>
        todolist.id === action.payload.todolistId ? { ...todolist, filter: action.payload.filter } : todolist
      );
    default:
      return state;
  }
};

export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
  todolistApi.getTodos().then(res => {
    dispatch(setTodolistsAC(res.data));
  });
};

export const setTodolistsAC = (todoLists: TodolistType[]) => {
  return { type: 'SET-TODOS', payload: { todoLists } } as const;
};

export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
  todolistApi.deleteTodo(todolistId).then(() => {
    dispatch(deleteTodolistAC(todolistId));
  });
};

export const deleteTodolistAC = (todolistId: string) => {
  return { type: 'DELETE-TODOLIST', payload: { todolistId } } as const;
};

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
  todolistApi.createTodo(title).then(res => {
    dispatch(addTodolistAC(res.data.data.item));
  });
};
export const addTodolistAC = (todolist: TodolistType) => {
  return { type: 'ADD-TODOLIST', payload: { todolist } } as const;
};

export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  todolistApi.updateTodo(todolistId, title).then(() => {
    dispatch(changeTodolistTitleAC(todolistId, title));
  });
};
export const changeTodolistTitleAC = (todolistId: string, todolistTitle: string) => {
  return { type: 'CHANGE-TITLE', payload: { todolistId, todolistTitle } } as const;
};
export const changeTodolistFilterAC = (todolistId: string, filter: FilterType) => {
  return { type: 'CHANGE-TODOLIST-FILTER', payload: { todolistId, filter } } as const;
};
