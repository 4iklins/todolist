import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default {
  title: 'API',
};

const baseUrl = 'https://social-network.samuraijs.com/api/1.1';
const todolistId = '5574b03b-357f-44c5-92f5-0f1e4b0b4b71';
const todolistId2 = "2e22cb43-5c4c-4fc4-b06c-66e8036bc719"

const config = {
  withCredentials: true
};
export const GetTodolists = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    // здесь мы будем делать запрос и ответ закидывать в стейт.
    // который в виде строки будем отображать в div-ке
    axios.get(`${baseUrl}/todo-lists`, config).then(res => {
      setState(res.data);
    });
  }, []);
  return <div>{JSON.stringify(state)}</div>;
};

export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const title = 'REACT';
    axios.post(`${baseUrl}/todo-lists`, { title }, config).then(res => {
      setState(res.data);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};

export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    axios.delete(`${baseUrl}/todo-lists/${todolistId}`, config).then(res => {
      setState(res.data);
    });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};

export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
	const title = 'JS';
	axios.put(`${baseUrl}/todo-lists/${todolistId2}`, { title }, config).then(res => {
		setState(res.data);
	  });
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};
