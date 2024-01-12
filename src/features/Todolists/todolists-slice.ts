import { AppDispatchType } from '../../app/store';
import { TodolistType, todolistApi } from '../../api/todolist-api';
import { Dispatch } from 'redux';
import { RequestStatusType, appActions } from '../../app/app-slice';
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';
import { fetchTasksTC } from './tasks-reducer';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type FilterType = 'all' | 'completed' | 'active';
export type TodolistDomainType = TodolistType & { filter: FilterType; entityStatus: RequestStatusType };
const initialState: TodolistDomainType[] = [];

const slice = createSlice({
  name: 'todolists',
  initialState,
  reducers: {
    setTodolists: (state, action: PayloadAction<{ todoLists: TodolistType[] }>) => {
      return action.payload.todoLists.map(tl => ({ ...tl, filter: 'all', entityStatus: 'idle' }));
    },
    deleteTodolist: (state, action: PayloadAction<{ todolistId: string }>) => {
      const index = state.findIndex(tl => tl.id === action.payload.todolistId);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' });
    },
    changeTodolistTitle: (state, action: PayloadAction<{ todolistId: string; todolistTitle: string }>) => {
      const index = state.findIndex(tl => tl.id === action.payload.todolistId);
      if (index !== -1) {
        state[index].title = action.payload.todolistTitle;
      }
    },
    changeTodolistFilter: (state, action: PayloadAction<{ todolistId: string; filter: FilterType }>) => {
      const index = state.findIndex(tl => tl.id === action.payload.todolistId);
      if (index !== -1) {
        state[index].filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatus: (
      state,
      action: PayloadAction<{ todolistId: string; entityStatus: RequestStatusType }>
    ) => {
      const index = state.findIndex(tl => tl.id === action.payload.todolistId);
      if (index !== -1) {
        state[index].entityStatus = action.payload.entityStatus;
      }
    },
    clearTodolists: state => {
      state = [];
    },
  },
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;

export const fetchTodolistsTC = () => (dispatch: AppDispatchType) => {
  dispatch(appActions.setAppStatus({ status: 'loading' }));
  todolistApi
    .getTodos()
    .then(res => {
      dispatch(todolistsActions.setTodolists({ todoLists: res.data }));
      dispatch(appActions.setAppStatus({ status: 'succeeded' }));
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

export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus({ status: 'loading' }));
  dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'loading' }));
  todolistApi
    .deleteTodo(todolistId)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(todolistsActions.deleteTodolist({ todolistId }));
        dispatch(appActions.setAppStatus({ status: 'succeeded' }));
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'failed' }));
      }
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch);
      dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'failed' }));
    });
};

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus({ status: 'loading' }));
  todolistApi
    .createTodo(title)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(todolistsActions.addTodolist({ todolist: res.data.data.item }));
        dispatch(appActions.setAppStatus({ status: 'succeeded' }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch);
    });
};

export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus({ status: 'loading' }));
  dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'loading' }));
  todolistApi
    .updateTodo(todolistId, title)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(todolistsActions.changeTodolistTitle({ todolistId, todolistTitle: title }));
        dispatch(appActions.setAppStatus({ status: 'succeeded' }));
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'failed' }));
      }
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch);
      dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'failed' }));
    });
};
