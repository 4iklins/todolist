import { ChangeEvent, KeyboardEvent, memo, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import React from 'react';

export interface AddItemFormType {
  label: string;
  addItem: (title: string) => void;
  disabled: boolean;
}

export const AddItemForm = memo((props: AddItemFormType) => {
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
    <Grid container>
      <TextField
        disabled={props.disabled}
        value={title}
        label={props.label}
        onChange={onInputChangeHandler}
        onKeyDown={onEnterPressHandler}
        size='small'
        error={!!error}
        helperText={!!error && 'Title is required'}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                onClick={addItem}
                disabled={!title || props.disabled}
                color='primary'
                size='large'
                sx={{ p: 0 }}>
                <AddBoxIcon fontSize='inherit' />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  );
});

