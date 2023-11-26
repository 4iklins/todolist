import { AddTodoListAT, DeleteTodolistAT, SetTodolistsAT } from './todolists-reducer';
import { TaskPriorities, TaskStatuses, TaskType, TaskUpdateType, todolistApi } from '../api/todolist-api';
import { StateType } from './store';
import { Dispatch } from 'redux';

export type ActionsTasksType =
  | ReturnType<typeof setTasksAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof deleteTaskAC>
  | ReturnType<typeof updateTaskAC>
  | AddTodoListAT
  | DeleteTodolistAT
  | SetTodolistsAT;

export interface TasksStateType {
  [key: string]: TaskType[];
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
      return { ...state, [action.payload.todolistId]: action.payload.tasks };
    case 'DELETE-TASK':
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter(tl => tl.id !== action.payload.taskId),
      };
    case 'ADD-TASK':
      return {
        ...state,
        [action.payload.task.todoListId]: [...state[action.payload.task.todoListId], action.payload.task],
      };
    case 'UPDATE-TASK':
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map(task =>
          task.id === action.payload.taskId ? { ...action.payload.task } : task
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
    default:
      return state;
  }
};

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  todolistApi.getTasks(todolistId).then(res => {
    dispatch(setTasksAC(res.data.items, todolistId));
  });
};

export const setTasksAC = (tasks: TaskType[], todolistId: string) => {
  return { type: 'SET-TASKS', payload: { tasks, todolistId } } as const;
};

export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
  todolistApi.deleteTask(todolistId, taskId).then(() => {
    dispatch(deleteTaskAC(taskId, todolistId));
  });
};
export const deleteTaskAC = (taskId: string, todolistId: string) => {
  return { type: 'DELETE-TASK', payload: { taskId, todolistId } } as const;
};

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  todolistApi.createTask(todolistId, title).then(res => {
    dispatch(addTaskAC(res.data.data.item));
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

      todolistApi.updateTask(todolistId, taskId, taskModel).then(res => {
        dispatch(updateTaskAC(taskId, res.data.data.item, todolistId));
      });
    }
  };

export const updateTaskAC = (taskId: string, task: TaskType, todolistId: string) => {
  return { type: 'UPDATE-TASK', payload: { taskId, task, todolistId } } as const;
};
