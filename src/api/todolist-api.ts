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
};
type TodolistType = {
  id: string;
  title: string;
  addedDate: Date;
  order: number;
};

export type ResponseType<T = {}> = {
  resultCode: number;
  messages: string[];
  data: {
    item: T;
  };
};
