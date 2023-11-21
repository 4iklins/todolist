import { useEffect, useState } from 'react';
import { TaskUpdateType, todolistApi } from '../api/todolist-api';

export default {
  title: 'API',
};

const todolistId = '03ab97d9-2263-4701-b5ec-c30af2dc9b73';
const todolistId2 = '2e22cb43-5c4c-4fc4-b06c-66e8036bc719';

export const GetTodolists = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    // здесь мы будем делать запрос и ответ закидывать в стейт.
    // который в виде строки будем отображать в div-ке
    todolistApi.getTodos().then(res => {
      setState(res.data);
    });
  }, []);
  return <div>{JSON.stringify(state)}</div>;
};

export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const title = 'What to by';
    todolistApi.createTodo(title).then(res => {
      debugger;
      setState(res.data);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};

export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    todolistApi.deleteTodo(todolistId).then(res => {
      debugger;
      setState(res.data);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};

export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const title = 'JS';
    todolistApi.updateTodo(todolistId2, title).then(res => {
      setState(res.data);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};
/////////Tasks

export const GetTasks = () => {
  const [state, setState] = useState<any>(null);
  const todolistId = 'bf7650a2-f0c1-4d6c-95cc-6974d6d324dd';
  useEffect(() => {
    todolistApi.getTasks(todolistId).then(res => {
      setState(res.data.items);
    });
  }, []);
  return <div>{JSON.stringify(state)}</div>;
};

export const CreateTask = () => {
  const [state, setState] = useState<any>(null);
  const todolistId = 'bf7650a2-f0c1-4d6c-95cc-6974d6d324dd';
  const title = 'Milk';
  useEffect(() => {
    todolistApi.createTask(todolistId, title).then(res => {
      debugger;
      setState(res.data.data.item);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};

export const UpdateTask = () => {
  const [state, setState] = useState<any>(null);
  const todolistId = 'bf7650a2-f0c1-4d6c-95cc-6974d6d324dd';
  const taskId = 'e4dfe877-a5ad-4089-ac34-75300e74b13d';
  const task: TaskUpdateType = {
    title: 'Bread',
    completed: true,
    deadline: new Date(),
    description: '',
    priority: 1,
    startDate: new Date(),
    status: 1,
  };
  useEffect(() => {
    todolistApi.updateTask(todolistId, taskId, task).then(res => {
      setState(res.data.data.item);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};

export const DeleteTask = () => {
  const [state, setState] = useState<any>(null);
  const todolistId = 'bf7650a2-f0c1-4d6c-95cc-6974d6d324dd';
  const taskId = '51a08c95-370e-4c4c-b4f2-378ebd6307dc';
  useEffect(() => {
    todolistApi.deleteTask(todolistId, taskId).then(res => {
      setState(res.data);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};
