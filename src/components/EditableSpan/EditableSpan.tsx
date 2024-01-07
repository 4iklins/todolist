import { TextField } from '@mui/material';
import React from 'react';
import { ChangeEvent, memo, useState } from 'react';

interface EditableSpanPropsType {
  title: string;
  changeTitle: (title: string) => void;
  disabled: boolean;
}

const EditableSpan = memo(({ title, disabled, changeTitle }: EditableSpanPropsType) => {
  const [editmode, setEditmode] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const activeEditMode = () => {
    if (!disabled) setEditmode(true);
    setText(title);
  };
  const activeViewMode = () => {
    setEditmode(false);
    if (text !== title) changeTitle(text);
  };

  const onChangeHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    setText(evt.currentTarget.value);
  };

  return editmode ? (
    <TextField value={text} onBlur={activeViewMode} autoFocus onChange={onChangeHandler} size='small'></TextField>
  ) : (
    <span style={{ wordWrap: 'break-word', overflowX: 'hidden' }} onDoubleClick={activeEditMode}>
      {title}
    </span>
  );
});

export default EditableSpan;
