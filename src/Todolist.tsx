import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { FilterType } from './App';

export interface TodoListProps {
  title: string;
  tasks: TaskType[];
  removeTask: (id: string) => void;
  addTask: (title: string) => void;
  changeFilter: (filter: FilterType) => void;
}

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};

const Todolist = (props: TodoListProps) => {
  const [title, setTitle] = useState<string>('');
  const onInputChangeHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.currentTarget.value);
  };

  const onEnterPressHandler = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      addTask();
    }
  };

  const addTask = () => {
    props.addTask(title);
    setTitle('');
  };

  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input value={title} onChange={onInputChangeHandler} onKeyDown={onEnterPressHandler} />
        <button onClick={addTask}>+</button>
      </div>
      <ul>
        {props.tasks.map(task => {
          return (
            <li key={task.id}>
              <input type='checkbox' checked={task.isDone} />
              <span>{task.title}</span>
              <button onClick={() => props.removeTask(task.id)}>✖️</button>
            </li>
          );
        })}
      </ul>
      <div>
        <button onClick={() => props.changeFilter('all')}>All</button>
        <button onClick={() => props.changeFilter('active')}>Active</button>
        <button onClick={() => props.changeFilter('completed')}>Completed</button>
      </div>
    </div>
  );
};

export default Todolist;
