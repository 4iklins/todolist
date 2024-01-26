import { RequestStatusType, appActions } from '../../app/app-slice';
import { handleServerAppError } from '../../common/utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '../../common/utils';
import { handleServerNetworkError } from '../../common/utils';
import { TodolistType } from '../../api/todolistApi';
import { todolistApi } from '../../api';
import { ResultCode } from '../../common/enums';
import { thunkTryCatch } from '../../common/utils/thunkTryCatch';

export type FilterType = 'all' | 'completed' | 'active';
export type TodolistDomainType = TodolistType & { filter: FilterType; entityStatus: RequestStatusType };
const initialState: TodolistDomainType[] = [];

const slice = createAppSlice({
  name: 'todolists',
  initialState,
  reducers: create => {
    const createAppThunk = create.asyncThunk.withTypes<{ rejectValue: null }>();
    return {
      changeTodolistFilter: create.reducer(
        (state, action: PayloadAction<{ todolistId: string; filter: FilterType }>) => {
          const index = state.findIndex(tl => tl.id === action.payload.todolistId);
          if (index !== -1) {
            state[index].filter = action.payload.filter;
          }
        }
      ),
      changeTodolistEntityStatus: create.reducer(
        (state, action: PayloadAction<{ todolistId: string; entityStatus: RequestStatusType }>) => {
          const index = state.findIndex(tl => tl.id === action.payload.todolistId);
          if (index !== -1) {
            state[index].entityStatus = action.payload.entityStatus;
          }
        }
      ),
      clearTodolists: create.reducer(() => {
        return [];
      }),
      fetchTodolists: create.asyncThunk<undefined, { todoLists: TodolistType[] }, { rejectValue: null }>(
        async (_, thunAPI) => {
          const { dispatch, rejectWithValue } = thunAPI;
          dispatch(appActions.setAppStatus({ status: 'loading' }));
          try {
            const res = await todolistApi.getTodos();
            dispatch(appActions.setAppStatus({ status: 'succeeded' }));
            return { todoLists: res.data };
          } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
          }
        },
        {
          fulfilled: (state, action) => {
            return action.payload.todoLists.map(tl => ({ ...tl, filter: 'all', entityStatus: 'idle' }));
          },
        }
      ),
      deleteTodolist: createAppThunk(
        async (todolistId: string, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;
          // dispatch(appActions.setAppStatus({ status: 'loading' }));
          dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'loading' }));
          return thunkTryCatch(thunkAPI,async ()=>{
            const res = await todolistApi.deleteTodo(todolistId);
            if (res.data.resultCode === ResultCode.success) {
              dispatch(appActions.setAppStatus({ status: 'succeeded' }));
              return { todolistId };
            } else {
              handleServerAppError(res.data, dispatch);
              dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'failed' }));
              return rejectWithValue(null);
            }
          })
          // try {
          //   const res = await todolistApi.deleteTodo(todolistId);
          //   if (res.data.resultCode === ResultCode.success) {
          //     dispatch(appActions.setAppStatus({ status: 'succeeded' }));
          //     return { todolistId };
          //   } else {
          //     handleServerAppError(res.data, dispatch);
          //     dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'failed' }));
          //     return rejectWithValue(null);
          //   }
          // } catch (e) {
          //   handleServerNetworkError(e, dispatch);
          //   dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'failed' }));
          //   return rejectWithValue(null);
          // }
        },
        {
          fulfilled: (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            if (index !== -1) {
              state.splice(index, 1);
            }
          },
        }
      ),
      addTodolist: createAppThunk(
        async (title: string, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;
          dispatch(appActions.setAppStatus({ status: 'loading' }));
          try {
            const res = await todolistApi.createTodo(title);
            if (res.data.resultCode === ResultCode.success) {
              dispatch(appActions.setAppStatus({ status: 'succeeded' }));
              return { todolist: res.data.data.item };
            } else {
              handleServerAppError(res.data, dispatch);
              return rejectWithValue(null);
            }
          } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
          }
        },
        {
          fulfilled: (state, action) => {
            state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' });
          },
        }
      ),
      changeTodolistTitle: createAppThunk(
        async (arg: { todolistId: string; title: string }, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;
          const { title, todolistId } = arg;
          dispatch(appActions.setAppStatus({ status: 'loading' }));
          dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'loading' }));
          try {
            const res = await todolistApi.updateTodo(todolistId, title);
            if (res.data.resultCode === ResultCode.success) {
              dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'succeeded' }));
              dispatch(appActions.setAppStatus({ status: 'succeeded' }));
              return { todolistId, todolistTitle: title };
            } else {
              handleServerAppError(res.data, dispatch);
              dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'failed' }));
              return rejectWithValue(null);
            }
          } catch (e) {
            handleServerNetworkError(e, dispatch);
            dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'failed' }));
            return rejectWithValue(null);
          }
        },
        {
          fulfilled: (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            if (index !== -1) {
              state[index].title = action.payload.todolistTitle;
            }
          },
        }
      ),
    };
  },
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
