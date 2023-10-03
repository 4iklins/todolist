import { TaskType } from '../../App';
import ClearIcon from '@mui/icons-material/Clear';
import EditableSpan from '../EditableSpan/EditableSpan';
import { Checkbox, IconButton, ListItem } from '@mui/material';

interface TaskProps extends TaskType {
  onChangeStatus: () => void;
  removeTask: (id: string) => void;
  changeTaskTitle: (title: string) => void;
}

const Task = ({ id, title, isDone, onChangeStatus, removeTask, changeTaskTitle }: TaskProps) => {
  return (
    <ListItem sx={{ p: 0, '& button': { ml: 'auto' } }}>
      <Checkbox checked={isDone} onChange={onChangeStatus} sx={{ pl: 0 }} />
      <EditableSpan title={title} changeTitle={changeTaskTitle} />
      <IconButton onClick={() => removeTask(id)} size='small' color='primary'>
        <ClearIcon fontSize='inherit' />
      </IconButton>
    </ListItem>
  );
};

export default Task;
