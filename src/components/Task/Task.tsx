import { TaskType } from '../../App';
import cn from 'classnames';
import styles from './task.module.css';
import EditableSpan from '../EditableSpan/EditableSpan';

interface TaskProps extends TaskType {
  onChangeStatus: () => void;
  removeTask: (id: string) => void;
  changeTaskTitle: (title: string) => void;
}

const Task = ({ id, title, isDone, onChangeStatus, removeTask, changeTaskTitle }: TaskProps) => {
  return (
    <li
      key={id}
      className={cn(styles.task, {
        [styles.completedTask]: isDone,
      })}>
      <input type='checkbox' checked={isDone} onChange={onChangeStatus} />
      <EditableSpan title={title} changeTitle={changeTaskTitle} />
      <button className={cn(styles.btnDel)} onClick={() => removeTask(id)}></button>
    </li>
  );
};

export default Task;
