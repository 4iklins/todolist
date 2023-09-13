import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { FilterType } from './App';
import styles from './todolist.module.css';
import cn from 'classnames';

export interface TodoListProps {
  title: string;
  tasks: TaskType[];
  filter: FilterType;
  removeTask: (id: string) => void;
  addTask: (title: string) => void;
  changeFilter: (filter: FilterType) => void;
  changeTaskStatus: (taskId: string) => void;
}

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};

const Todolist = (props: TodoListProps) => {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const onInputChangeHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setTitle(evt.currentTarget.value);
  };

  const onEnterPressHandler = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      addTask();
    }
  };

  const addTask = () => {
    if (title && title.trim() !== '') {
      props.addTask(title.trim());
      setTitle('');
    } else {
      setError(true);
      setTitle('');
    }
  };

  return (
    <div className={styles.todolist}>
      <h3>{props.title}</h3>
      <div>
        <input
          value={title}
          onChange={onInputChangeHandler}
          onKeyDown={onEnterPressHandler}
          className={cn(styles.taskInput, {
            [styles.errorInput]: error,
          })}
        />
        <button onClick={addTask} disabled={!title}>
          Add
        </button>
        {error && <div className={styles.error}>Title is required</div>}
      </div>
      <ul>
        {props.tasks.map(task => {
          const onChangeTaskStatusHandler = () => {
            props.changeTaskStatus(task.id);
          };
          return (
            <li
              key={task.id}
              className={cn(styles.task, {
                [styles.completedTask]: task.isDone,
              })}>
              <input type='checkbox' checked={task.isDone} onChange={onChangeTaskStatusHandler} />
              <span>{task.title}</span>
              <button className={cn(styles.btnDel)} onClick={() => props.removeTask(task.id)}></button>
            </li>
          );
        })}
      </ul>
      <div>
        <button
          className={cn(styles.btn, {
            [styles.btnActive]: props.filter === 'all',
          })}
          onClick={() => props.changeFilter('all')}>
          All
        </button>
        <button
          className={cn(styles.btn, {
            [styles.btnActive]: props.filter === 'active',
          })}
          onClick={() => props.changeFilter('active')}>
          Active
        </button>
        <button
          className={cn(styles.btn, {
            [styles.btnActive]: props.filter === 'completed',
          })}
          onClick={() => props.changeFilter('completed')}>
          Completed
        </button>
      </div>
    </div>
  );
};

export default Todolist;
