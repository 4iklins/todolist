import ClearIcon from '@mui/icons-material/Clear';
import EditableSpan from '../EditableSpan/EditableSpan';
import { Checkbox, IconButton, ListItem } from '@mui/material';
import { ChangeEvent, memo } from 'react';
import { TaskType } from '../../state/tasks-reducer';

interface TaskProps extends TaskType {
  onChangeStatus: (taskId: string, isDone: boolean) => void;
  removeTask: (taskId: string) => void;
  changeTaskTitle: (taskId: string, title: string) => void;
}

const Task = memo(({ id, title, isDone, onChangeStatus, removeTask, changeTaskTitle }: TaskProps) => {
  const changeStatus = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeStatus(id, e.currentTarget.checked);
  };

  const changeTitle = (title: string) => {
    changeTaskTitle(id, title);
  };

  return (
    <ListItem sx={{ p: 0, '& button': { ml: 'auto' } }} divider>
      <Checkbox checked={isDone} onChange={changeStatus} sx={{ pl: 0 }} />

      <EditableSpan title={title} changeTitle={changeTitle} />

      <IconButton onClick={() => removeTask(id)} size='small' color='primary'>
        <ClearIcon fontSize='inherit' />
      </IconButton>
    </ListItem>
  );
});

export default Task;
