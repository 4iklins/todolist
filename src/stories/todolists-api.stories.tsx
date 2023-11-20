import { useEffect, useState } from 'react';
import { todolistApi } from '../api/todolist-api';

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
      debugger
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
