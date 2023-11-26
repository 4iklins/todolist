import axios from 'axios';

const instance = axios.create({ withCredentials: true, baseURL: 'https://social-network.samuraijs.com/api/1.1' });

export const todolistApi = {
  getTodos() {
    return instance.get<TodolistType[]>(`/todo-lists`);
  },
  createTodo(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>(`/todo-lists`, { title });
  },
  updateTodo(todolistId: string, title: string) {
    return instance.put<ResponseType>(`/todo-lists/${todolistId}`, { title });
  },
  deleteTodo(todolistId: string) {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}`);
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponseType>(`/todo-lists/${todolistId}/tasks`);
  },
  createTask(todolistId: string, title: string) {
    return instance.post<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks`, { title });
  },
  updateTask(todolistId: string, taskId: string, task: TaskUpdateType) {
    return instance.put<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, { ...task });
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`);
  },
};
export type TodolistType = {
  id: string;
  title: string;
  addedDate: Date;
  order: number;
};

export type TaskType = {
  description: string;
  title: string;
  completed: boolean;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: Date;
  deadline: Date;
  id: string;
  todoListId: string;
  order: number;
  addedDate: Date;
};

export type TaskUpdateType = {
  title: string;
  description: string;
  completed: boolean;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: Date;
  deadline: Date;
};

export type ResponseType<T = {}> = {
  resultCode: number;
  messages: string[];
  fieldsError: string[];
  data: T;
};

export type GetTasksResponseType = {
  items: TaskType[];
  totalCount: number;
  error: string;
};
export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}
