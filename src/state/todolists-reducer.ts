import { v1 } from 'uuid';
import { initState } from './initstate';

export interface RemoveTodolistAT {
  type: 'REMOVE-TODOLIST';
  payload: {
    todolistId: string;
  };
}

export interface AddTodoListAT {
  type: 'ADD-TODOLIST';
  payload: {
    todolistTitle: string;
    todolistId: string;
  };
}

export interface ChangeTodolistTitleAT {
  type: 'CHANGE-TITLE';
  payload: {
    todolistId: string;
    todolistTitle: string;
  };
}

export interface ChangeTodolistFilterAT {
  type: 'CHANGE-TODOLIST-FILTER';
  payload: {
    todolistId: string;
    filter: FilterType;
  };
}

export type ActionTodolistsType = AddTodoListAT | RemoveTodolistAT | ChangeTodolistTitleAT | ChangeTodolistFilterAT;

export interface TodolistType {
  id: string;
  title: string;
  filter: FilterType;
}
export type FilterType = 'all' | 'completed' | 'active';

const initialState: TodolistType[] = initState.todolists;

export const todolistsReducer = (state = initialState, action: ActionTodolistsType): TodolistType[] => {
  switch (action.type) {
    case 'REMOVE-TODOLIST':
      return state.filter(tl => tl.id !== action.payload.todolistId);
    case 'ADD-TODOLIST':
      return [...state, { id: action.payload.todolistId, title: action.payload.todolistTitle, filter: 'all' }];
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

export const removeTodolistAC = (todolistId: string): RemoveTodolistAT => ({
  type: 'REMOVE-TODOLIST',
  payload: { todolistId },
});
export const addTodolistAC = (todolistTitle: string): AddTodoListAT => ({
  type: 'ADD-TODOLIST',
  payload: { todolistTitle, todolistId: v1() },
});
export const changeTodolistTitleAC = (todolistId: string, todolistTitle: string): ChangeTodolistTitleAT => ({
  type: 'CHANGE-TITLE',
  payload: { todolistId, todolistTitle },
});
export const changeTodolistFilterAC = (todolistId: string, filter: FilterType): ChangeTodolistFilterAT => ({
  type: 'CHANGE-TODOLIST-FILTER',
  payload: { todolistId, filter },
});
