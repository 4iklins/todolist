import { v1 } from 'uuid';
import { AddTodoListAT, RemoveTodolistAT, SetTodolistsAT } from './todolists-reducer';
import { TaskPriorities, TaskStatuses, TaskType, todolistApi } from '../api/todolist-api';
import { AppDispatchType } from './store';

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
  payload: { taskId: string; status: TaskStatuses; todolistId: string };
};

export type ChangeTaskTitleActionType = {
  type: 'CHANGE-TASK-TITLE';
  payload: { taskId: string; tododlistId: string; taskTitle: string };
};

export type SetTasksAT = ReturnType<typeof setTasksAC>;

export type ActionsTasksType =
  | RemoveTaskActionType
  | AddTaskActionType
  | ChangeTaskStatusActionType
  | ChangeTaskTitleActionType
  | AddTodoListAT
  | RemoveTodolistAT
  | SetTodolistsAT
  | SetTasksAT;

export interface TasksStateType {
  [key: string]: TaskType[];
}

const initialState: TasksStateType = {};

export const tasksReducer = (state = initialState, action: ActionsTasksType): TasksStateType => {
  switch (action.type) {
    case 'SET-TODOS':
      const stateCopy = { ...state };
      action.payload.todoLists.forEach(tl => {
        stateCopy[tl.id] = [];
      });
      return stateCopy;
    case 'SET-TASKS':
      return { ...state, [action.payload.todolistId]: action.payload.tasks };
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
          {
            id: action.payload.id,
            title: action.payload.title,
            status: TaskStatuses.New,
            addedDate: new Date(),
            completed: false,
            deadline: new Date(),
            description: '',
            order: 0,
            priority: TaskPriorities.Low,
            startDate: new Date(),
            todoListId: action.payload.todolistId,
          },
        ],
      };
    case 'CHANGE-TASK-STATUS':
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map(task =>
          task.id === action.payload.taskId ? { ...task, status: action.payload.status } : task
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

export const fetchTasksTC = (todolistId: string) => (dispatch: AppDispatchType) => {
  todolistApi.getTasks(todolistId).then(res => {
    dispatch(setTasksAC(res.data.items, todolistId));
  });
};

export const setTasksAC = (tasks: TaskType[], todolistId: string) =>
  ({
    type: 'SET-TASKS',
    payload: { tasks, todolistId },
  } as const);

export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: AppDispatchType) => {
  todolistApi.deleteTask(todolistId, taskId).then(() => {
    dispatch(removeTaskAC(taskId, todolistId));
  });
};
export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
  return { type: 'REMOVE-TASK', payload: { taskId, todolistId } };
};
export const addTaskAC = (title: string, todolistId: string): AddTaskActionType => {
  return { type: 'ADD-TASK', payload: { id: v1(), title, todolistId } };
};

export const changeTaskStatusAC = (
  taskId: string,
  status: TaskStatuses,
  todolistId: string
): ChangeTaskStatusActionType => {
  return { type: 'CHANGE-TASK-STATUS', payload: { taskId, status, todolistId } };
};
export const changeTaskTitleAC = (
  taskId: string,
  tododlistId: string,
  taskTitle: string
): ChangeTaskTitleActionType => {
  return { type: 'CHANGE-TASK-TITLE', payload: { taskId, tododlistId, taskTitle } };
};
