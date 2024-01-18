import { todolistsActions } from './todolists-slice';
import { TaskType, TaskUpdateType, TodolistType, todolistApi } from '../../api/todolist-api';
import { StateType } from '../../app/store';
import { Dispatch } from 'redux';
import { RequestStatusType, appActions } from '../../app/app-slice';
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type TaskDomainType = TaskType & { entityStatus: RequestStatusType };
export type TasksStateType = {
  [key: string]: TaskDomainType[];
};

const initialState: TasksStateType = {};

const slice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<{ tasks: TaskType[]; todolistId: string }>) => {
      state[action.payload.todolistId] = action.payload.tasks.map(task => ({ ...task, entityStatus: 'idle' }));
    },
    deleteTask: (state, action: PayloadAction<{ todolistId: string; taskId: string }>) => {
      const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskId);
      if (index !== -1) {
        state[action.payload.todolistId].splice(index, 1);
      }
    },
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      state[action.payload.task.todoListId].unshift({ ...action.payload.task, entityStatus: 'idle' });
    },
    updateTask: (state, action: PayloadAction<{ taskId: string; task: Partial<TaskType>; todolistId: string }>) => {
      const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskId);
      if (index !== -1) {
        state[action.payload.todolistId][index] = {
          ...state[action.payload.todolistId][index],
          ...action.payload.task,
          entityStatus: 'succeeded',
        };
      }
    },
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
      .addCase(todolistsActions.addTodolist, (state, action: PayloadAction<{ todolist: TodolistType }>) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsActions.deleteTodolist, (state, action: PayloadAction<{ todolistId: string }>) => {
        delete state[action.payload.todolistId];
      })
      .addCase(todolistsActions.setTodolists, (state, action: PayloadAction<{ todoLists: TodolistType[] }>) => {
        action.payload.todoLists.forEach(tl => (state[tl.id] = []));
      })
      .addCase(todolistsActions.clearTodolists, () => {
        return {};
      });
  },
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus({ status: 'loading' }));
  todolistApi
    .getTasks(todolistId)
    .then(res => {
      if (!res.data.error) {
        dispatch(tasksActions.setTasks({ tasks: res.data.items, todolistId }));
        dispatch(appActions.setAppStatus({ status: 'succeeded' }));
      } else {
        if (res.data.error) {
          dispatch(appActions.setAppError({ error: res.data.error }));
        } else {
          dispatch(appActions.setAppError({ error: 'Some error occurred' }));
        }
        dispatch(appActions.setAppStatus({ status: 'failed' }));
      }
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch);
    });
};

export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus({ status: 'loading' }));
  dispatch(tasksActions.changeTaskEntityStatus({ todolistId, taskId, entityStatus: 'loading' }));
  todolistApi
    .deleteTask(todolistId, taskId)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(tasksActions.deleteTask({ taskId, todolistId }));
        dispatch(appActions.setAppStatus({ status: 'succeeded' }));
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(tasksActions.changeTaskEntityStatus({ todolistId, taskId, entityStatus: 'failed' }));
      }
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch);
      dispatch(tasksActions.changeTaskEntityStatus({ todolistId, taskId, entityStatus: 'failed' }));
    });
};

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus({ status: 'loading' }));
  dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'loading' }));
  todolistApi
    .createTask(todolistId, title)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(tasksActions.addTask({ task: res.data.data.item }));
        dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'succeeded' }));
        dispatch(appActions.setAppStatus({ status: 'succeeded' }));
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId: todolistId, entityStatus: 'failed' }));
      }
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch);
      dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId: todolistId, entityStatus: 'failed' }));
    });
};

export const updateTaskTC =
  (taskId: string, model: Partial<TaskUpdateType>, todolistId: string) =>
  (dispatch: Dispatch, getState: () => StateType) => {
    const task = getState().tasks[todolistId].find(t => t.id === taskId);
    if (task) {
      const taskModel: TaskUpdateType = {
        title: task.title,
        description: task.description,
        completed: task.completed,
        startDate: task.startDate,
        priority: task.priority,
        deadline: task.deadline,
        status: task.status,
        ...model,
      };
      dispatch(appActions.setAppStatus({ status: 'loading' }));
      dispatch(tasksActions.changeTaskEntityStatus({ todolistId, taskId, entityStatus: 'loading' }));
      todolistApi
        .updateTask(todolistId, taskId, taskModel)
        .then(res => {
          if (res.data.resultCode === 0) {
            dispatch(tasksActions.updateTask({ taskId, task: res.data.data.item, todolistId }));
            dispatch(appActions.setAppStatus({ status: 'succeeded' }));
          } else {
            handleServerAppError(res.data, dispatch);
            dispatch(tasksActions.changeTaskEntityStatus({ todolistId, taskId, entityStatus: 'failed' }));
          }
        })
        .catch(e => {
          handleServerNetworkError(e, dispatch);
          dispatch(tasksActions.changeTaskEntityStatus({ todolistId, taskId, entityStatus: 'failed' }));
        });
    }
  };
