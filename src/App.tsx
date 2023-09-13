import React from 'react';
import './App.css';
import Todolist, { TaskType } from './Todolist';
import { useState } from 'react';
import { v1 } from 'uuid';

let tasks1 = [
  { id: v1(), title: 'HTML&CSS', isDone: true },
  { id: v1(), title: 'JS', isDone: true },
  { id: v1(), title: 'ReactJS', isDone: false },
  { id: v1(), title: 'Rest API', isDone: false },
  { id: v1(), title: 'GraphQL', isDone: false },
];

export type FilterType = 'all' | 'completed' | 'active';

function App() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [tasks, setTasks] = useState<TaskType[]>(tasks1);

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  const addTask = (title: string) => {
    setTasks([...tasks, { id: v1(), title: title, isDone: false }]);
  };

  const changeTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => (task.id === taskId ? { ...task, isDone: !task.isDone } : task)));
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
      <Todolist
        title='What to learn'
        tasks={taskForTodoList}
        filter={filter}
        addTask={addTask}
        removeTask={removeTask}
        changeFilter={changeFilter}
        changeTaskStatus={changeTaskStatus}
      />
    </div>
  );
}

export default App;
