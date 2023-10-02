import { ChangeEvent, useState } from 'react';

interface EditableSpanPropsType {
  title: string;
  changeTitle: (title: string) => void;
}

const EditableSpan = ({ title, changeTitle }: EditableSpanPropsType) => {
  const [editmode, setEditmode] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const activeEditMode = () => {
    setEditmode(true);
    setText(title);
  };
  const activeViewMode = () => {
    setEditmode(false);
    changeTitle(text);
  };

  const onChangeHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    setText(evt.currentTarget.value);
  };
  return editmode ? (
    <input value={text} onBlur={activeViewMode} autoFocus onChange={onChangeHandler}></input>
  ) : (
    <span onDoubleClick={activeEditMode}>{title}</span>
  );
};

export default EditableSpan;
