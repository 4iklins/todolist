import AddItemForm from './components/AddItemForm/AddItemForm';
import EditableSpan from './components/EditableSpan/EditableSpan';
import Task from './components/Task/Task';
import { Box, IconButton, List, Typography } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from './state/store';
import { TaskType, addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC } from './state/tasks-reducer';
import {
  TodolistType,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  removeTodolistAC,
} from './state/todolists-reducer';
import { memo, useCallback, useMemo } from 'react';
import Button from './components/Button/Button';

export interface TodoListProps {
  todolist: TodolistType;
}

const TodolistWithRedux = memo(({ todolist }: TodoListProps) => {
  const { id, title, filter } = todolist;
  const tasks = useSelector<StateType, TaskType[]>(state => state.tasks[id]);
  const dispatch = useDispatch();

  const addTask = useCallback(
    (title: string) => {
      dispatch(addTaskAC(title, id));
    },
    [id]
  );

  const changeTodolistTitle = useCallback(
    (title: string) => {
      dispatch(changeTodolistTitleAC(id, title));
    },
    [id]
  );

  const changeTaskStatus = useCallback(
    (taskId: string, isDone: boolean) => {
      dispatch(changeTaskStatusAC(taskId, isDone, id));
    },
    [id]
  );
  const removeTask = useCallback(
    (taskId: string) => {
      dispatch(removeTaskAC(taskId, id));
    },
    [id]
  );
  const changeTaskTitle = useCallback(
    (taskId: string, title: string) => {
      dispatch(changeTaskTitleAC(taskId, id, title));
    },
    [id]
  );

  const onAllClick = useCallback(() => {
    dispatch(changeTodolistFilterAC(id, 'all'));
  }, [id]);
  const onActiveClick = useCallback(() => {
    dispatch(changeTodolistFilterAC(id, 'active'));
  }, [id]);
  const onCompletedClick = useCallback(() => {
    dispatch(changeTodolistFilterAC(id, 'completed'));
  }, [id]);

  const tasksForRender = useMemo(() => {
    console.log('useMemo');
    if (filter === 'active') {
      return tasks.filter(task => !task.isDone);
    }
    if (filter === 'completed') {
      return tasks.filter(task => task.isDone);
    }
    return tasks;
  }, [filter, tasks]);

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
        {tasksForRender.map(task => {
          return (
            <Task
              {...task}
              key={task.id}
              onChangeStatus={changeTaskStatus}
              removeTask={removeTask}
              changeTaskTitle={changeTaskTitle}
            />
          );
        })}
      </List>

      <Box sx={{ 'button + button': { ml: 1 } }}>
        <Button variant={filter === 'all' ? 'contained' : 'outlined'} size='small' onClick={onAllClick}>
          All
        </Button>
        <Button variant={filter === 'active' ? 'contained' : 'outlined'} size='small' onClick={onActiveClick}>
          Active
        </Button>
        <Button variant={filter === 'completed' ? 'contained' : 'outlined'} size='small' onClick={onCompletedClick}>
          Completed
        </Button>
      </Box>
    </div>
  );
});

export default TodolistWithRedux;
