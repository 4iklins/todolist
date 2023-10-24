import AddItemForm from './components/AddItemForm.tsx/AddItemForm';
import EditableSpan from './components/EditableSpan/EditableSpan';
import Task from './components/Task/Task';
import { Box, Button, IconButton, List, Typography } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from './state/store';
import { TaskType, addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC } from './state/tasks-reducer';
import { TodolistType, changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC } from './state/todolists-reducer';

export interface TodoListProps {
  todolist: TodolistType;
}

const TodolistWithRedux = ({ todolist }: TodoListProps) => {
  const { id, title, filter } = todolist;
  const tasks = useSelector<StateType, TaskType[]>(state => state.tasks[id]);
  const dispatch = useDispatch();

  const addTask = (title: string) => {
    dispatch(addTaskAC(title, id));
  };
  const changeTodolistTitle = (title: string) => {
    dispatch(changeTodolistTitleAC(id, title));
  };

  let taskForTodoList = tasks;
  if (filter === 'active') {
    taskForTodoList = tasks.filter(task => !task.isDone);
  }
  if (filter === 'completed') {
    taskForTodoList = tasks.filter(task => task.isDone);
  }

  const tasksForRender = taskForTodoList.map(task => {
    const changeTaskStatus = (isDone: boolean) => {
      dispatch(changeTaskStatusAC(task.id, isDone, id));
    };
    const removeTask = (id: string) => {
      dispatch(removeTaskAC(id, todolist.id));
    };
    const changeTaskTitle = (title: string) => {
      dispatch(changeTaskTitleAC(task.id, id, title));
    };
    return (
      <Task
        {...task}
        key={task.id}
        onChangeStatus={changeTaskStatus}
        removeTask={removeTask}
        changeTaskTitle={changeTaskTitle}
      />
    );
  });
  //
  return (
    <div>
      <Typography variant='h6' component='h2' display={'flex'} mb={3}>
        <EditableSpan title={title} changeTitle={changeTodolistTitle} />
        <IconButton
          onClick={() => dispatch(removeTodolistAC(id))}
          color='primary'
          sx={{ alignSelf: 'center', ml: 'auto', p: '2px' }}>
          <DeleteForeverIcon fontSize='inherit' />
        </IconButton>
      </Typography>

      <AddItemForm addItem={addTask} label='Task title' />

      <List sx={{ maxHeight: '172px', minHeight: '172px', overflowY: 'auto', p: 0, m: '10px 0' }}>
        {tasksForRender}
      </List>

      <Box sx={{ 'button + button': { ml: 1 } }}>
        <Button
          variant={filter === 'all' ? 'contained' : 'outlined'}
          size='small'
          onClick={() => dispatch(changeTodolistFilterAC(id, 'all'))}>
          All
        </Button>
        <Button
          variant={filter === 'active' ? 'contained' : 'outlined'}
          size='small'
          onClick={() => dispatch(changeTodolistFilterAC(id, 'active'))}>
          Active
        </Button>
        <Button
          variant={filter === 'completed' ? 'contained' : 'outlined'}
          size='small'
          onClick={() => dispatch(changeTodolistFilterAC(id, 'completed'))}>
          Completed
        </Button>
      </Box>
    </div>
  );
};

export default TodolistWithRedux;
