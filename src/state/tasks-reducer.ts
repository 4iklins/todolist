import {
  AddTodoListAT,
  ClearTodolistsAT,
  DeleteTodolistAT,
  SetTodolistsAT,
  changeTodolistEntityStatusAC,
} from './todolists-reducer';
import { TaskPriorities, TaskStatuses, TaskType, TaskUpdateType, todolistApi } from '../api/todolist-api';
import { StateType } from './store';
import { Dispatch } from 'redux';
import { RequestStatusType, setAppErrorAC, setAppStatusAC } from './app-reducer';
import { handleServerAppError, handleServerNetworkError } from '../utils/error-utils';

export type ActionsTasksType =
  | ReturnType<typeof setTasksAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof deleteTaskAC>
  | ReturnType<typeof updateTaskAC>
  | AddTodoListAT
  | DeleteTodolistAT
  | SetTodolistsAT
  | ReturnType<typeof changeTaskEntityStatusAC>
  | ClearTodolistsAT;

export type TaskDomainType = TaskType & { entityStatus: RequestStatusType };
export interface TasksStateType {
  [key: string]: TaskDomainType[];
}

const initialState: TasksStateType = {};

export type UpdateModel = {
  title?: string;
  description?: string;
  completed?: boolean;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: Date;
  deadline?: Date;
};

export const tasksReducer = (state = initialState, action: ActionsTasksType): TasksStateType => {
  switch (action.type) {
    case 'SET-TODOS':
      const stateCopy = { ...state };
      action.payload.todoLists.forEach(tl => {
        stateCopy[tl.id] = [];
      });
      return stateCopy;
    case 'SET-TASKS':
      return {
        ...state,
        [action.payload.todolistId]: action.payload.tasks.map(task => ({ ...task, entityStatus: 'idle' })),
      };
    case 'DELETE-TASK':
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter(tl => tl.id !== action.payload.taskId),
      };
    case 'ADD-TASK':
      return {
        ...state,
        [action.payload.task.todoListId]: [
          ...state[action.payload.task.todoListId],
          { ...action.payload.task, entityStatus: 'idle' },
        ],
      };
    case 'UPDATE-TASK':
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map(task =>
          task.id === action.payload.taskId ? { ...action.payload.task, entityStatus: 'succeeded' } : task
        ),
      };
    case 'ADD-TODOLIST':
      return { ...state, [action.payload.todolist.id]: [] };
    case 'DELETE-TODOLIST':
      const {
        [action.payload.todolistId]: [],
        ...rest
      } = state;
      return rest;
    case 'CHANGE-TASK-ENTITY-STATUS':
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map(task =>
          task.id === action.payload.taskId ? { ...task, entityStatus: action.payload.status } : task
        ),
      };
      case 'CLEAR-TODOS':
        return {}
    default:
      return state;
  }
};

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'));
  todolistApi
    .getTasks(todolistId)
    .then(res => {
      if (!res.data.error) {
        dispatch(setTasksAC(res.data.items, todolistId));
        dispatch(setAppStatusAC('succeeded'));
      } else {
        if (res.data.error) {
          dispatch(setAppErrorAC(res.data.error));
        } else {
          dispatch(setAppErrorAC('Some error occurred'));
        }
        dispatch(setAppStatusAC('failed'));
      }
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch);
    });
};

export const setTasksAC = (tasks: TaskType[], todolistId: string) => {
  return { type: 'SET-TASKS', payload: { tasks, todolistId } } as const;
};

export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'));
  dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'loading'));
  todolistApi
    .deleteTask(todolistId, taskId)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(deleteTaskAC(taskId, todolistId));
        dispatch(setAppStatusAC('succeeded'));
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'failed'));
      }
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch);
      dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'failed'));
    });
};
export const deleteTaskAC = (taskId: string, todolistId: string) => {
  return { type: 'DELETE-TASK', payload: { taskId, todolistId } } as const;
};

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'));
  dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'));
  todolistApi
    .createTask(todolistId, title)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(addTaskAC(res.data.data.item));
        dispatch(setAppStatusAC('succeeded'));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch);
    });
};
export const addTaskAC = (task: TaskType) => {
  return { type: 'ADD-TASK', payload: { task } } as const;
};

export const updateTaskTC =
  (taskId: string, model: UpdateModel, todolistId: string) => (dispatch: Dispatch, getState: () => StateType) => {
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
      dispatch(setAppStatusAC('loading'));
      dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'loading'));
      todolistApi
        .updateTask(todolistId, taskId, taskModel)
        .then(res => {
          if (res.data.resultCode === 0) {
            dispatch(updateTaskAC(taskId, res.data.data.item, todolistId));
            dispatch(setAppStatusAC('succeeded'));
          } else {
            handleServerAppError(res.data, dispatch);
            dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'failed'));
          }
        })
        .catch(e => {
          handleServerNetworkError(e, dispatch);
          dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'failed'));
        });
    }
  };

export const updateTaskAC = (taskId: string, task: TaskType, todolistId: string) => {
  return { type: 'UPDATE-TASK', payload: { taskId, task, todolistId } } as const;
};

export const changeTaskEntityStatusAC = (todolistId: string, taskId: string, status: RequestStatusType) => {
  return { type: 'CHANGE-TASK-ENTITY-STATUS', payload: { todolistId, taskId, status } } as const;
};
