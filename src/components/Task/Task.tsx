import { TaskType } from '../../App';
import cn from 'classnames';
import styles from './task.module.css';

interface TaskProps extends TaskType {
  onChangeStatus: () => void;
  removeTask: (id: string) => void;
}

const Task = ({ id, title, isDone, onChangeStatus, removeTask }: TaskProps) => {
  return (
    <li
      key={id}
      className={cn(styles.task, {
        [styles.completedTask]: isDone,
      })}>
      <input type='checkbox' checked={isDone} onChange={onChangeStatus} />
      <span>{title}</span>
      <button className={cn(styles.btnDel)} onClick={() => removeTask(id)}></button>
    </li>
  );
};

export default Task;
