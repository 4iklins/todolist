import { v1 } from 'uuid';
import { AddTodoListAT, RemoveTodolistAT, SetTodolistsAT } from './todolists-reducer';
import { TaskType } from '../api/todolist-api';

export type RemoveTaskActionType = {
  type: 'REMOVE-TASK';
  payload: { taskId: string; todolistId: string };
};
export type AddTaskActionType = {
  type: 'ADD-TASK';
  payload: { id: string; title: string; todolistId: string };
};

export type ChangeTaskStatusActionType = {
  type: 'CHANGE-TASK-STATUS';
  payload: { taskId: string; isDone: boolean; todolistId: string };
};

export type ChangeTaskTitleActionType = {
  type: 'CHANGE-TASK-TITLE';
  payload: { taskId: string; tododlistId: string; taskTitle: string };
};

export type ActionsTasksType =
  | RemoveTaskActionType
  | AddTaskActionType
  | ChangeTaskStatusActionType
  | ChangeTaskTitleActionType
  | AddTodoListAT
  | RemoveTodolistAT
  | SetTodolistsAT;

export interface TasksStateType {
  [key: string]: TaskType[];
}

const initialState: TasksStateType = {};

export const tasksReducer = (state = initialState, action: ActionsTasksType):TasksStateType => {
  switch (action.type) {
    case 'SET-TODOS':
      const stateCopy = { ...state };
      action.payload.todoLists.forEach(tl => {
        stateCopy[tl.id] = [];
      });
      return stateCopy;
    case 'REMOVE-TASK':
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter(tl => tl.id !== action.payload.taskId),
      };
    case 'ADD-TASK':
      return {
        ...state,
        [action.payload.todolistId]: [
          ...state[action.payload.todolistId],
          { id: action.payload.id, title: action.payload.title, status: 0 },
        ],
      };
    case 'CHANGE-TASK-STATUS':
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map(task =>
          task.id === action.payload.taskId ? { ...task, isDone: action.payload.isDone } : task
        ),
      };
    case 'CHANGE-TASK-TITLE':
      return {
        ...state,
        [action.payload.tododlistId]: state[action.payload.tododlistId].map(task =>
          task.id === action.payload.taskId ? { ...task, title: action.payload.taskTitle } : task
        ),
      };
    case 'ADD-TODOLIST':
      return { ...state, [action.payload.todolistId]: [] };
    case 'REMOVE-TODOLIST':
      const {
        [action.payload.todolistId]: [],
        ...rest
      } = state;
      return rest;
    default:
      return state;
  }
};

export const setTasksAC = (tasks:task)

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
  return { type: 'REMOVE-TASK', payload: { taskId, todolistId } };
};
export const addTaskAC = (title: string, todolistId: string): AddTaskActionType => {
  return { type: 'ADD-TASK', payload: { id: v1(), title, todolistId } };
};

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string): ChangeTaskStatusActionType => {
  return { type: 'CHANGE-TASK-STATUS', payload: { taskId, isDone, todolistId } };
};
export const changeTaskTitleAC = (
  taskId: string,
  tododlistId: string,
  taskTitle: string
): ChangeTaskTitleActionType => {
  return { type: 'CHANGE-TASK-TITLE', payload: { taskId, tododlistId, taskTitle } };
};
