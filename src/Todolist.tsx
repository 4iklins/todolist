import { FilterType, TaskType, TodolistType } from './App';
import AddItemForm from './components/AddItemForm/AddItemForm';
import EditableSpan from './components/EditableSpan/EditableSpan';
import Task from './components/Task/Task';
import { Box, Button, IconButton, List, Typography } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export interface TodoListProps {
  todolist: TodolistType;
  tasks: TaskType[];
  removeTask: (id: string, todolistId: string) => void;
  addTask: (title: string, todolistId: string) => void;
  changeFilter: (filter: FilterType, id: string) => void;
  changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void;
  removeTodolist: (todolistId: string) => void;
  changeTaskTitle: (tasksId: string, tododlistId: string, taskTitle: string) => void;
  changeTodolistTitle: (id: string, title: string) => void;
}

const Todolist = ({
  todolist,
  tasks,
  removeTask,
  addTask,
  changeFilter,
  changeTaskStatus,
  changeTaskTitle,
  changeTodolistTitle,
  removeTodolist,
}: TodoListProps) => {
  const addTaskHandler = (title: string) => {
    addTask(title, todolist.id);
  };
  const changeTitle = (title: string) => {
    changeTodolistTitle(todolist.id, title);
  };
  const onChangeTaskStatusHandler = (taskId: string, isDone: boolean) => {
    changeTaskStatus(taskId, isDone, todolist.id);
  };
  const removeTaskHandler = (id: string) => {
    removeTask(id, todolist.id);
  };
  const onChangeTaskTitleHandler = (taskId: string, title: string) => {
    changeTaskTitle(taskId, todolist.id, title);
  };

  const tasksForRender = tasks.map(task => {
    return (
      <Task
        {...task}
        key={task.id}
        onChangeStatus={onChangeTaskStatusHandler}
        removeTask={removeTaskHandler}
        changeTaskTitle={onChangeTaskTitleHandler}
      />
    );
  });
  return (
    <div>
      <Typography variant='h6' component='h2' display={'flex'} mb={3}>
        <EditableSpan title={todolist.title} changeTitle={changeTitle} />
        <IconButton
          onClick={() => removeTodolist(todolist.id)}
          color='primary'
          sx={{ alignSelf: 'center', ml: 'auto', p: '2px' }}>
          <DeleteForeverIcon fontSize='inherit' />
        </IconButton>
      </Typography>

      <AddItemForm addItem={addTaskHandler} label='Task title' />

      <List sx={{ maxHeight: '172px', minHeight: '172px', overflowY: 'auto', p: 0, m: '10px 0' }}>
        {tasksForRender}
      </List>

      <Box sx={{ 'button + button': { ml: 1 } }}>
        <Button
          variant={todolist.filter === 'all' ? 'contained' : 'outlined'}
          size='small'
          onClick={() => changeFilter('all', todolist.id)}>
          All
        </Button>
        <Button
          variant={todolist.filter === 'active' ? 'contained' : 'outlined'}
          size='small'
          onClick={() => changeFilter('active', todolist.id)}>
          Active
        </Button>
        <Button
          variant={todolist.filter === 'completed' ? 'contained' : 'outlined'}
          size='small'
          onClick={() => changeFilter('completed', todolist.id)}>
          Completed
        </Button>
      </Box>
    </div>
  );
};

export default Todolist;
