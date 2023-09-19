import { FilterType, TaskType } from './App';
import styles from './todolist.module.css';
import cn from 'classnames';
import AddItemForm from './components/AddItemForm.tsx/AddItemForm';

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

const Todolist = (props: TodoListProps) => {
  const addTask = (title: string) => {
    props.addTask(title, props.id);
  };
  return (
    <div className={styles.todolist}>
      <h3 className={styles.head}>
        {props.title}
        <button className={cn(styles.btnDel)} onClick={() => props.removeTodolist(props.id)}></button>
      </h3>
      <AddItemForm addItem={addTask} />
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
