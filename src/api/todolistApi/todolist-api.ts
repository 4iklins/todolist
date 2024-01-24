import { instance } from '../instance';
import { ResponseType, GetTasksResponseType, TaskType, TaskUpdateType, TodolistType } from './todolistApi.types';

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
  createTask({ todolistId, title }: { todolistId: string; title: string }) {
    return instance.post<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks`, { title });
  },
  updateTask(todolistId: string, taskId: string, task: TaskUpdateType) {
    return instance.put<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, { ...task });
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`);
  },
};
