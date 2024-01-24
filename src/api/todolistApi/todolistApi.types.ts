import { ResultCode, TaskPriorities, TaskStatuses } from '../../common/enums';

export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

export type TaskType = {
  description: string;
  title: string;
  completed: boolean;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};

export type TaskUpdateType = {
  title: string;
  description: string;
  completed: boolean;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};

export type ResponseType<T = {}> = {
  resultCode: ResultCode;
  messages: string[];
  fieldsError: string[];
  data: T;
};

export type GetTasksResponseType = {
  items: TaskType[];
  totalCount: number;
  error: string;
};
