import { todolistsActions } from './todolists-slice';
import { TaskType, TaskUpdateType, TodolistType, todolistApi } from '../../api/todolist-api';
import { StateType } from '../../app/store';
import { Dispatch } from 'redux';
import { RequestStatusType, appActions } from '../../app/app-slice';
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../../utils/create-app-async-thunk';

export type TaskDomainType = TaskType & { entityStatus: RequestStatusType };
export type TasksStateType = {
  [key: string]: TaskDomainType[];
};

const initialState: TasksStateType = {};

const slice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    changeTaskEntityStatus: (
      state,
      action: PayloadAction<{ todolistId: string; taskId: string; entityStatus: RequestStatusType }>
    ) => {
      const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskId);
      if (index !== -1) {
        state[action.payload.todolistId][index].entityStatus = action.payload.entityStatus;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(todolistsActions.addTodolist.fulfilled, (state, action: PayloadAction<{ todolist: TodolistType }>) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsActions.deleteTodolist.fulfilled, (state, action: PayloadAction<{ todolistId: string }>) => {
        delete state[action.payload.todolistId];
      })
      .addCase(
        todolistsActions.fetchTodolists.fulfilled,
        (state, action: PayloadAction<{ todoLists: TodolistType[] }>) => {
          action.payload.todoLists.forEach(tl => (state[tl.id] = []));
        }
      )
      .addCase(todolistsActions.clearTodolists, () => {
        return {};
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks.map(task => ({ ...task, entityStatus: 'idle' }));
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift({ ...action.payload.task, entityStatus: 'idle' });
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskId);
        if (index !== -1) {
          state[action.payload.todolistId][index] = {
            ...state[action.payload.todolistId][index],
            ...action.payload.task,
            entityStatus: 'succeeded',
          };
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskId);
        if (index !== -1) {
          state[action.payload.todolistId].splice(index, 1);
        }
      });
  },
});

const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  `${slice.name}/fetchTasks`,
  async (todolistId: string, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    dispatch(appActions.setAppStatus({ status: 'loading' }));
    try {
      const res = await todolistApi.getTasks(todolistId);
      if (!res.data.error) {
        dispatch(appActions.setAppStatus({ status: 'succeeded' }));
        return { tasks: res.data.items, todolistId };
      } else {
        if (res.data.error) {
          dispatch(appActions.setAppError({ error: res.data.error }));
        } else {
          dispatch(appActions.setAppError({ error: 'Some error occurred' }));
        }
        dispatch(appActions.setAppStatus({ status: 'failed' }));
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);
const deleteTask = createAppAsyncThunk<{ todolistId: string; taskId: string }, { todolistId: string; taskId: string }>(
  `${slice.name}/deleteTask`,
  async (arg, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    dispatch(appActions.setAppStatus({ status: 'loading' }));
    dispatch(
      tasksActions.changeTaskEntityStatus({ todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: 'loading' })
    );
    try {
      const res = await todolistApi.deleteTask(arg.todolistId, arg.taskId);
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatus({ status: 'succeeded' }));
        return { taskId: arg.taskId, todolistId: arg.todolistId };
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(
          tasksActions.changeTaskEntityStatus({
            todolistId: arg.todolistId,
            taskId: arg.taskId,
            entityStatus: 'failed',
          })
        );
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      dispatch(
        tasksActions.changeTaskEntityStatus({ todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: 'failed' })
      );
      return rejectWithValue(null);
    }
  }
);

const addTask = createAppAsyncThunk<{ task: TaskType }, { todolistId: string; title: string }>(
  `${slice.name}/addTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppStatus({ status: 'loading' }));
    dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId: arg.todolistId, entityStatus: 'loading' }));
    try {
      const res = await todolistApi.createTask(arg);
      if (res.data.resultCode === 0) {
        dispatch(
          todolistsActions.changeTodolistEntityStatus({ todolistId: arg.todolistId, entityStatus: 'succeeded' })
        );
        dispatch(appActions.setAppStatus({ status: 'succeeded' }));
        return { task: res.data.data.item };
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId: arg.todolistId, entityStatus: 'failed' }));
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

const updateTask = createAppAsyncThunk<
  { taskId: string; task: Partial<TaskType>; todolistId: string },
  { taskId: string; model: Partial<TaskUpdateType>; todolistId: string }
>(`${slice.name}/updateTask`, async (arg, thunkApi) => {
  const { dispatch, rejectWithValue, getState } = thunkApi;
  const task = getState().tasks[arg.todolistId].find(t => t.id === arg.taskId);
  if (task) {
    const taskModel: TaskUpdateType = {
      title: task.title,
      description: task.description,
      completed: task.completed,
      startDate: task.startDate,
      priority: task.priority,
      deadline: task.deadline,
      status: task.status,
      ...arg.model,
    };
    dispatch(appActions.setAppStatus({ status: 'loading' }));
    dispatch(
      tasksActions.changeTaskEntityStatus({ todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: 'loading' })
    );
    try {
      const res = await todolistApi.updateTask(arg.todolistId, arg.taskId, taskModel);
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatus({ status: 'succeeded' }));
        return { taskId: arg.taskId, task: res.data.data.item, todolistId: arg.todolistId };
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(
          tasksActions.changeTaskEntityStatus({
            todolistId: arg.todolistId,
            taskId: arg.taskId,
            entityStatus: 'failed',
          })
        );
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      dispatch(
        tasksActions.changeTaskEntityStatus({ todolistId: arg.todolistId, taskId: arg.taskId, entityStatus: 'failed' })
      );
      return rejectWithValue(null);
    }
  }
  return rejectWithValue(null);
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = { fetchTasks, addTask, updateTask, deleteTask };
