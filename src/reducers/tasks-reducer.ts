import { TasksStateType } from '../App';
import { AddTodoListAT, RemoveTodolistAT } from './todolists-reducer';

export type RemoveTaskActionType = {
  type: 'REMOVE-TASK';
  payload: { taskId: string; todolistId: string };
};
export type AddTaskActionType = {
  type: 'ADD-TASK';
  payload: { title: string; todolistId: string };
};

export type ChangeTaskStatusActionType = {
  type: 'CHANGE-TASK-STATUS';
  payload: { taskId: string; isDone: boolean; todolistId: string };
};

export type ChangeTaskTitleActionType = {
  type: 'CHANGE-TASK-TITLE';
  payload: { taskId: string; tododlistId: string; taskTitle: string };
};

type ActionsType =
  | RemoveTaskActionType
  | AddTaskActionType
  | ChangeTaskStatusActionType
  | ChangeTaskTitleActionType
  | AddTodoListAT
  | RemoveTodolistAT;

export const tasksReducer = (state: TasksStateType, action: ActionsType) => {
  switch (action.type) {
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
          { id: '4', title: action.payload.title, isDone: false },
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
      throw new Error("I don't understand this type");
  }
};

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
  return { type: 'REMOVE-TASK', payload: { taskId, todolistId } };
};
export const addTaskAC = (title: string, todolistId: string): AddTaskActionType => {
  return { type: 'ADD-TASK', payload: { title, todolistId } };
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
