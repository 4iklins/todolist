import { FilterType, TaskType } from './App';
import styles from './todolist.module.css';
import AddItemForm from './components/AddItemForm.tsx/AddItemForm';
import EditableSpan from './components/EditableSpan/EditableSpan';
import Task from './components/Task/Task';
import { Box, Button, IconButton, List } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

export interface TodoListProps {
  id: string;
  title: string;
  tasks: TaskType[];
  filter: FilterType;
  removeTask: (id: string, todolistId: string) => void;
  addTask: (title: string, todolistId: string) => void;
  changeFilter: (filter: FilterType, id: string) => void;
  changeTaskStatus: (taskId: string, todolistId: string) => void;
  removeTodolist: (todolistId: string) => void;
  changeTaskTitle: (tasksId: string, tododlistId: string, taskTitle: string) => void;
  changeTodolistTitle: (id: string, title: string) => void;
}

const Todolist = (props: TodoListProps) => {
  const addTask = (title: string) => {
    props.addTask(title, props.id);
  };
  const changeTitle = (title: string) => {
    props.changeTodolistTitle(props.id, title);
  };
  return (
    <div>
      <h3>
        <EditableSpan title={props.title} changeTitle={changeTitle} />
        <IconButton onClick={() => props.removeTodolist(props.id)} size='small' color='primary'>
          <ClearIcon fontSize='inherit' />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} label='Task title' />
      <List>
        {props.tasks.map(task => {
          const onChangeTaskStatusHandler = () => {
            props.changeTaskStatus(task.id, props.id);
          };
          const removeTaskHandler = (id: string) => {
            props.removeTask(id, props.id);
          };
          const onChangeTaskTitleHandler = (title: string) => {
            props.changeTaskTitle(task.id, props.id, title);
          };
          return (
            <Task
              {...task}
              key={task.id}
              onChangeStatus={onChangeTaskStatusHandler}
              removeTask={removeTaskHandler}
              changeTaskTitle={onChangeTaskTitleHandler}
            />
          );
        })}
      </List>
      <Box sx={{ 'button + button': { ml: 1 } }}>
        <Button
          variant={props.filter === 'all' ? 'contained' : 'outlined'}
          size='small'
          onClick={() => props.changeFilter('all', props.id)}>
          All
        </Button>
        <Button
          variant={props.filter === 'active' ? 'contained' : 'outlined'}
          size='small'
          onClick={() => props.changeFilter('active', props.id)}>
          Active
        </Button>
        <Button
          variant={props.filter === 'completed' ? 'contained' : 'outlined'}
          size='small'
          onClick={() => props.changeFilter('completed', props.id)}>
          Completed
        </Button>
      </Box>
    </div>
  );
};

export default Todolist;
