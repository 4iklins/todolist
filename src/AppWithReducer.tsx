import './App.css';
import Todolist from './Todolist';
import { Reducer, useReducer} from 'react';
import { v1 } from 'uuid';
import AddItemForm from './components/AddItemForm.tsx/AddItemForm';
import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {
  ActionTodolistsType,
  addTodolistAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  removeTodolistAC,
  todolistsReducer,
} from './state/todolists-reducer';
import {
  ActionsTasksType,
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
  tasksReducer,
} from './state/tasks-reducer';

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

const tasksState: TasksStateType = {
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

function AppWithReducer() {
  const [todolists, dispatchTodolist] = useReducer<Reducer<TodolistType[], ActionTodolistsType>>(
    todolistsReducer,
    todolistsArray
  );
  const [tasks, dispatchTask] = useReducer<Reducer<TasksStateType, ActionsTasksType>>(tasksReducer, tasksState);

  const addTodolist = (title: string) => {
    const action = addTodolistAC(title);
    dispatchTodolist(action);
    dispatchTask(action);
  };

  const removeTodolist = (todolistId: string) => {
    const action = removeTodolistAC(todolistId);
    dispatchTodolist(action);
    dispatchTask(action);
  };

  const changeTodolistTitle = (todolistId: string, title: string) => {
    dispatchTodolist(changeTodolistTitleAC(todolistId, title));
  };

  const changeFilter = (filter: FilterType, id: string) => {
    dispatchTodolist(changeTodolistFilterAC(id, filter));
  };

  const removeTask = (id: string, todolistId: string) => {
    dispatchTask(removeTaskAC(id, todolistId));
  };
  const addTask = (title: string, todolistId: string) => {
    dispatchTask(addTaskAC(title, todolistId));
  };

  const changeTaskStatus = (taskId: string, isDone: boolean, todolistId: string) => {
    dispatchTask(changeTaskStatusAC(taskId, isDone, todolistId));
  };

  const changeTaskTitle = (taskId: string, tododlistId: string, taskTitle: string) => {
    dispatchTask(changeTaskTitleAC(taskId, tododlistId, taskTitle));
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
      <Grid item key={todolist.id} xl={3} lg={4} md={6} xs={12}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Todolist
            todolist={todolist}
            tasks={taskForRender}
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
          <Typography variant='h6' component='h1'>
            Todolist
          </Typography>
          <Button color='inherit' sx={{ ml: 'auto' }}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth={'xl'} sx={{ mt: '64px' }}>
        <Grid container sx={{ p: '24px 0' }}>
          <Grid item xl={3} lg={4} md={6} xs={12}>
            <AddItemForm addItem={addTodolist} label='Todolist title' />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {todolistComponents}
        </Grid>
      </Container>
    </div>
  );
}

export default AppWithReducer;
