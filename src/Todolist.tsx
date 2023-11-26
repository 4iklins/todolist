import AddItemForm from './components/AddItemForm/AddItemForm';
import EditableSpan from './components/EditableSpan/EditableSpan';
import Task from './components/Task/Task';
import { Box, IconButton, List, Typography } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useAppDispatch, useAppSelector } from './state/store';
import { addTaskTC, deleteTaskTC, fetchTasksTC, updateTaskTC } from './state/tasks-reducer';
import {
  TodolistDomainType,
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  deleteTodolistTC,
} from './state/todolists-reducer';
import { memo, useCallback, useEffect, useMemo } from 'react';
import Button from './components/Button/Button';
import { TaskStatuses, TaskType } from './api/todolist-api';

export interface TodoListProps {
  todolist: TodolistDomainType;
}

const Todolist = memo(({ todolist }: TodoListProps) => {
  const { id, title, filter } = todolist;
  const tasks: TaskType[] = useAppSelector(state => state.tasks[id]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTasksTC(id));
  }, []);

  const addTask = useCallback(
    (title: string) => {
      dispatch(addTaskTC(id, title));
    },
    [id]
  );

  const changeTodolistTitle = useCallback(
    (title: string) => {
      dispatch(changeTodolistTitleTC(id, title));
    },
    [id]
  );

  const changeTaskStatus = useCallback(
    (taskId: string, status: TaskStatuses) => {
      dispatch(updateTaskTC(taskId, { status }, id));
    },
    [id]
  );
  const removeTask = useCallback(
    (taskId: string) => {
      dispatch(deleteTaskTC(id, taskId));
    },
    [id]
  );
  const changeTaskTitle = useCallback(
    (taskId: string, title: string) => {
      dispatch(updateTaskTC(taskId, { title }, id));
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
      return tasks.filter(task => task.status !== TaskStatuses.Completed);
    }
    if (filter === 'completed') {
      return tasks.filter(task => task.status === TaskStatuses.Completed);
    }
    return tasks;
  }, [filter, tasks]);

  //
  return (
    <div>
      <Typography variant='h6' component='h2' display={'flex'} mb={3}>
        <EditableSpan title={title} changeTitle={changeTodolistTitle} />
        <IconButton
          onClick={() => dispatch(deleteTodolistTC(id))}
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

export default Todolist;
