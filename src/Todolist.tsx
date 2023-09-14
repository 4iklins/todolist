import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { FilterType } from './App';
import styles from './todolist.module.css';
import cn from 'classnames';

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
      props.addTask(title.trim(), props.id);
      setTitle('');
    } else {
      setError(true);
      setTitle('');
    }
  };

  return (
    <div className={styles.todolist}>
      <h3 className={styles.head}>
        {props.title}
        <button className={cn(styles.btnDel)} onClick={() => props.removeTodolist(props.id)}></button>
      </h3>
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
            props.changeTaskStatus(task.id, props.id);
          };
          return (
            <li
              key={task.id}
              className={cn(styles.task, {
                [styles.completedTask]: task.isDone,
              })}>
              <input type='checkbox' checked={task.isDone} onChange={onChangeTaskStatusHandler} />
              <span>{task.title}</span>
              <button className={cn(styles.btnDel)} onClick={() => props.removeTask(task.id, props.id)}></button>
            </li>
          );
        })}
      </ul>
      <div>
        <button
          className={cn(styles.btn, {
            [styles.btnActive]: props.filter === 'all',
          })}
          onClick={() => props.changeFilter('all', props.id)}>
          All
        </button>
        <button
          className={cn(styles.btn, {
            [styles.btnActive]: props.filter === 'active',
          })}
          onClick={() => props.changeFilter('active', props.id)}>
          Active
        </button>
        <button
          className={cn(styles.btn, {
            [styles.btnActive]: props.filter === 'completed',
          })}
          onClick={() => props.changeFilter('completed', props.id)}>
          Completed
        </button>
      </div>
    </div>
  );
};

export default Todolist;
