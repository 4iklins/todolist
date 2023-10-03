import './App.css';
import Todolist from './Todolist';
import { useState } from 'react';
import { v1 } from 'uuid';
import AddItemForm from './components/AddItemForm.tsx/AddItemForm';
import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const todolistId1 = v1();
const todolistId2 = v1();

const todolistsArray: TodolistType[] = [
  { id: todolistId1, title: 'What to learn', filter: 'all' },
  { id: todolistId2, title: 'What to buy', filter: 'all' },
];

export interface TodolistType {
  id: string;
  title: string;
  filter: FilterType;
}
export interface TaskType {
  id: string;
  title: string;
  isDone: boolean;
}
export interface TasksStateType {
  [key: string]: TaskType[];
}

const tasksState = {
  [todolistId1]: [
    { id: v1(), title: 'HTML&CSS', isDone: true },
    { id: v1(), title: 'JS', isDone: true },
    { id: v1(), title: 'ReactJS', isDone: false },
  ],
  [todolistId2]: [
    { id: v1(), title: 'Chocolate', isDone: true },
    { id: v1(), title: 'Coffee', isDone: true },
    { id: v1(), title: 'Bread', isDone: false },
  ],
};

export type FilterType = 'all' | 'completed' | 'active';

function App() {
  const [todolists, setTodolists] = useState<TodolistType[]>(todolistsArray);
  const [tasks, setTasks] = useState<TasksStateType>(tasksState);

  const addTodolist = (title: string) => {
    const newTodolistId = v1();
    setTodolists([...todolists, { id: newTodolistId, title, filter: 'all' }]);
    setTasks({ ...tasks, [newTodolistId]: [] });
  };

  const removeTodolist = (todolistId: string) => {
    setTodolists(todolists.filter(tl => tl.id !== todolistId));
  };

  const changeTodolistTitle = (todolistId: string, title: string) => {
    setTodolists(todolists.map(tl => (tl.id === todolistId ? { ...tl, title } : tl)));
  };

  const removeTask = (id: string, todolistId: string) => {
    setTasks({ ...tasks, [todolistId]: tasks[todolistId].filter(tl => tl.id !== id) });
  };
  const addTask = (title: string, todolistId: string) => {
    setTasks({ ...tasks, [todolistId]: [...tasks[todolistId], { id: v1(), title: title, isDone: false }] });
  };

  const changeTaskStatus = (taskId: string, todolistId: string) => {
    setTasks({
      ...tasks,
      [todolistId]: tasks[todolistId].map(task => (task.id === taskId ? { ...task, isDone: !task.isDone } : task)),
    });
  };

  const changeTaskTitle = (tasksId: string, tododlistId: string, taskTitle: string) => {
    setTasks({
      ...tasks,
      [tododlistId]: tasks[tododlistId].map(task => (task.id === tasksId ? { ...task, title: taskTitle } : task)),
    });
  };

  const changeFilter = (filter: FilterType, id: string) => {
    setTodolists(todolists.map(todolist => (todolist.id === id ? { ...todolist, filter } : todolist)));
  };

  const getTasksForRender = (todolist: TodolistType, todolistId: string) => {
    let taskForTodoList = tasks[todolistId];
    if (todolist.filter === 'active') {
      taskForTodoList = tasks[todolistId].filter(task => !task.isDone);
    }
    if (todolist.filter === 'completed') {
      taskForTodoList = tasks[todolistId].filter(task => task.isDone);
    }
    return taskForTodoList;
  };

  const todolistComponents = todolists.map(todolist => {
    const taskForRender = getTasksForRender(todolist, todolist.id);

    return (
      <Grid item key={todolist.id} xs={3}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Todolist
            id={todolist.id}
            title={todolist.title}
            tasks={taskForRender}
            filter={todolist.filter}
            addTask={addTask}
            removeTask={removeTask}
            changeFilter={changeFilter}
            changeTaskStatus={changeTaskStatus}
            removeTodolist={removeTodolist}
            changeTaskTitle={changeTaskTitle}
            changeTodolistTitle={changeTodolistTitle}
          />
        </Paper>
      </Grid>
    );
  });

  return (
    <div className='App'>
      <AppBar position='fixed'>
        <Toolbar>
          <IconButton color='inherit'>
            <MenuIcon />
          </IconButton>
          <Typography variant='h6'>Todolist</Typography>
          <Button color='inherit' sx={{ ml: 'auto' }}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth={'lg'} sx={{ mt: '64px' }}>
        <Grid container justifyContent={'center'} sx={{ p: '24px 0' }}>
          <Grid item sx={{ width: 'calc(100% / 3.3) ' }}>
            <AddItemForm addItem={addTodolist} label='Todolist title' />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          {todolistComponents}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
