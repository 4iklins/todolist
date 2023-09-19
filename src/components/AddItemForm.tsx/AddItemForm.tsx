import { ChangeEvent, KeyboardEvent, useState } from 'react';
import styles from './addTaskForm.module.css';
import cn from 'classnames';

interface AddItemFormType {
  addItem: (title: string) => void;
}

const AddItemForm = (props: AddItemFormType) => {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const onInputChangeHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setTitle(evt.currentTarget.value);
  };

  const onEnterPressHandler = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      addItem();
    }
  };
  const addItem = () => {
    if (title && title.trim() !== '') {
      props.addItem(title.trim());
      setTitle('');
    } else {
      setError(true);
      setTitle('');
    }
  };
  return (
    <div>
      <input
        value={title}
        onChange={onInputChangeHandler}
        onKeyDown={onEnterPressHandler}
        className={cn(styles.taskInput, {
          [styles.errorInput]: error,
        })}
      />
      <button onClick={addItem} disabled={!title}>
        Add
      </button>
      {error && <div className={styles.error}>Title is required</div>}
    </div>
  );
};

export default AddItemForm;
