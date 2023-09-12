import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { FilterType } from './App';

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
    <div>
      <h3>{props.title}</h3>
      <div>
        <input
          value={title}
          onChange={onInputChangeHandler}
          onKeyDown={onEnterPressHandler}
          className={error ? 'error-value' : ''}
        />
        <button onClick={addTask}>+</button>
        {error && <div className='error-message'>Title is reauired</div>}
      </div>
      <ul>
        {props.tasks.map(task => {
          const onChangeTaskStatusHandler = () => {
            props.changeTaskStatus(task.id);
          };
          return (
            <li key={task.id} className={task.isDone ? 'completed-task' : ''}>
              <input type='checkbox' checked={task.isDone} onChange={onChangeTaskStatusHandler} />
              <span>{task.title}</span>
              <button onClick={() => props.removeTask(task.id)}>✖️</button>
            </li>
          );
        })}
      </ul>
      <div>
        <button className={props.filter === 'all' ? 'btn-filter-ctive' : ''} onClick={() => props.changeFilter('all')}>
          All
        </button>
        <button
          className={props.filter === 'active' ? 'btn-filter-ctive' : ''}
          onClick={() => props.changeFilter('active')}>
          Active
        </button>
        <button
          className={props.filter === 'completed' ? 'btn-filter-ctive' : ''}
          onClick={() => props.changeFilter('completed')}>
          Completed
        </button>
      </div>
    </div>
  );
};

export default Todolist;
