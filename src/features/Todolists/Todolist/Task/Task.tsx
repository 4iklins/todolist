import ClearIcon from '@mui/icons-material/Clear';
import { Checkbox, IconButton, ListItem } from '@mui/material';
import React, { ChangeEvent, memo } from 'react';
import { TaskDomainType } from '../../tasks-slice';
import { EditableSpan } from '../../../../common/components';
import { TaskStatuses } from '../../../../common/enums';

interface TaskProps extends TaskDomainType {
  onChangeStatus: (taskId: string, status: TaskStatuses) => void;
  removeTask: (taskId: string) => void;
  changeTaskTitle: (taskId: string, title: string) => void;
}

const Task = memo(({ id, title, status, entityStatus, onChangeStatus, removeTask, changeTaskTitle }: TaskProps) => {
  const changeStatus = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeStatus(id, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New);
  };

  const changeTitle = (title: string) => {
    changeTaskTitle(id, title);
  };

  return (
    <ListItem sx={{ p: 0, '& button': { ml: 'auto' } }} divider>
      <Checkbox
        checked={status === TaskStatuses.Completed}
        onChange={changeStatus}
        sx={{ pl: 0 }}
        disabled={entityStatus === 'loading'}
      />

      <EditableSpan title={title} changeTitle={changeTitle} disabled={entityStatus === 'loading'} />

      <IconButton onClick={() => removeTask(id)} size='small' color='primary' disabled={entityStatus === 'loading'}>
        <ClearIcon fontSize='inherit' />
      </IconButton>
    </ListItem>
  );
});

export default Task;
