import React from 'react';
import './App.css';
import Todolist, { TaskType } from './Todolist';
import { useState } from 'react';

let tasks1 = [
  { id: 1, title: 'HTML&CSS', isDone: true },
  { id: 2, title: 'JS', isDone: true },
  { id: 3, title: 'ReactJS', isDone: false },
  { id: 4, title: 'Rest API', isDone: false },
  { id: 5, title: 'GraphQL', isDone: false },
];

export type FilterType = 'all' | 'completed' | 'active';

function App() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [tasks, setTasks] = useState<TaskType[]>(tasks1);
  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  let taskForTodoList = tasks;
  if (filter === 'active') {
    taskForTodoList = tasks.filter(task => !task.isDone);
  }
  if (filter === 'completed') {
    taskForTodoList = tasks.filter(task => task.isDone);
  }

  const changeFilter = (filter: FilterType) => {
    setFilter(filter);
  };

  return (
    <div className='App'>
      <Todolist title='What to learn' tasks={taskForTodoList} removeTask={removeTask} changeFilter={changeFilter} />
    </div>
  );
}

export default App;
