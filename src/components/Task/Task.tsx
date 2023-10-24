import { TaskType } from '../../App';
import ClearIcon from '@mui/icons-material/Clear';
import EditableSpan from '../EditableSpan/EditableSpan';
import { Checkbox, IconButton, ListItem } from '@mui/material';
import { ChangeEvent } from 'react';

interface TaskProps extends TaskType {
  onChangeStatus: (isDone: boolean) => void;
  removeTask: (id: string) => void;
  changeTaskTitle: (title: string) => void;
}

const Task = ({ id, title, isDone, onChangeStatus, removeTask, changeTaskTitle }: TaskProps) => {
  const changeStatus = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.checked, isDone);
    onChangeStatus(e.currentTarget.checked);
  };
  return (
    <ListItem sx={{ p: 0, '& button': { ml: 'auto' } }} divider>
      <Checkbox checked={isDone} onChange={changeStatus} sx={{ pl: 0 }} />

      <EditableSpan title={title} changeTitle={changeTaskTitle} />

      <IconButton onClick={() => removeTask(id)} size='small' color='primary'>
        <ClearIcon fontSize='inherit' />
      </IconButton>
    </ListItem>
  );
};

export default Task;
