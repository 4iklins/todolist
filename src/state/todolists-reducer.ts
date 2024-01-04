import { AppDispatchType } from './store';
import { TodolistType, todolistApi } from '../api/todolist-api';
import { Dispatch } from 'redux';
import { RequestStatusType, setAppStatusAC } from './app-reducer';
import { handleServerAppError, handleServerNetworkError } from '../utils/error-utils';
import { fetchTasksTC } from './tasks-reducer';

export type DeleteTodolistAT = ReturnType<typeof deleteTodolistAC>;

export type AddTodoListAT = ReturnType<typeof addTodolistAC>;

export type SetTodolistsAT = ReturnType<typeof setTodolistsAC>;

export type ClearTodolistsAT = ReturnType<typeof clearTodolistsAC>;

export type ActionTodolistsType =
  | AddTodoListAT
  | DeleteTodolistAT
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | SetTodolistsAT
  | ReturnType<typeof changeTodolistEntityStatusAC>
  | ClearTodolistsAT;

export type FilterType = 'all' | 'completed' | 'active';
export type TodolistDomainType = TodolistType & { filter: FilterType; entityStatus: RequestStatusType };
const initialState: TodolistDomainType[] = [];

export const todolistsReducer = (state = initialState, action: ActionTodolistsType): TodolistDomainType[] => {
  switch (action.type) {
    case 'SET-TODOS':
      return action.payload.todoLists.map(tl => ({ ...tl, filter: 'all', entityStatus: 'idle' }));
    case 'DELETE-TODOLIST':
      return state.filter(tl => tl.id !== action.payload.todolistId);
    case 'ADD-TODOLIST':
      return [{ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' }, ...state];
    case 'CHANGE-TITLE':
      return state.map(tl =>
        tl.id === action.payload.todolistId
          ? { ...tl, title: action.payload.todolistTitle, entityStatus: 'succeeded' }
          : tl
      );
    case 'CHANGE-TODOLIST-FILTER':
      return state.map(todolist =>
        todolist.id === action.payload.todolistId ? { ...todolist, filter: action.payload.filter } : todolist
      );
    case 'CHANGE-TODOLIST-ENTITY-STATUS':
      return state.map(todolist =>
        todolist.id === action.payload.id ? { ...todolist, entityStatus: action.payload.status } : todolist
      );
    case 'CLEAR-TODOS':
      return [];
    default:
      return state;
  }
};

export const fetchTodolistsTC = () => (dispatch: AppDispatchType) => {
  dispatch(setAppStatusAC('loading'));
  todolistApi
    .getTodos()
    .then(res => {
      dispatch(setTodolistsAC(res.data));
      dispatch(setAppStatusAC('succeeded'));
      return res.data;
    })
    .then(data => {
      data.forEach(todo => {
        dispatch(fetchTasksTC(todo.id));
      });
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch);
    });
};

export const setTodolistsAC = (todoLists: TodolistType[]) => {
  return { type: 'SET-TODOS', payload: { todoLists } } as const;
};

export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'));
  dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'));
  todolistApi
    .deleteTodo(todolistId)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(deleteTodolistAC(todolistId));
        dispatch(setAppStatusAC('succeeded'));
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(changeTodolistEntityStatusAC(todolistId, 'failed'));
      }
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch);
      dispatch(changeTodolistEntityStatusAC(todolistId, 'failed'));
    });
};

export const deleteTodolistAC = (todolistId: string) => {
  return { type: 'DELETE-TODOLIST', payload: { todolistId } } as const;
};

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'));
  todolistApi
    .createTodo(title)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(addTodolistAC(res.data.data.item));
        dispatch(setAppStatusAC('succeeded'));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch);
    });
};
export const addTodolistAC = (todolist: TodolistType) => {
  return { type: 'ADD-TODOLIST', payload: { todolist } } as const;
};

export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'));
  dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'));
  todolistApi
    .updateTodo(todolistId, title)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(changeTodolistTitleAC(todolistId, title));
        dispatch(setAppStatusAC('succeeded'));
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(changeTodolistEntityStatusAC(todolistId, 'failed'));
      }
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch);
      dispatch(changeTodolistEntityStatusAC(todolistId, 'failed'));
    });
};
export const changeTodolistTitleAC = (todolistId: string, todolistTitle: string) => {
  return { type: 'CHANGE-TITLE', payload: { todolistId, todolistTitle } } as const;
};
export const changeTodolistFilterAC = (todolistId: string, filter: FilterType) => {
  return { type: 'CHANGE-TODOLIST-FILTER', payload: { todolistId, filter } } as const;
};
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => {
  return { type: 'CHANGE-TODOLIST-ENTITY-STATUS', payload: { id, status } } as const;
};
export const clearTodolistsAC = () => {
  return { type: 'CLEAR-TODOS' } as const;
};
