import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AddItemForm, { AddItemFormType } from '../components/AddItemForm/AddItemForm';
import { ChangeEvent, KeyboardEvent, memo, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof AddItemForm> = {
  title: 'TODOLISTS/AddItemForm',
  component: AddItemForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    addItem: {
      description: 'Button clicked inside form',
      action: 'clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AddItemForm>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

const ErrorAddItemForm = memo((props: AddItemFormType) => {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<boolean>(true);
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
        value={title}
        label={props.label}
        onChange={onInputChangeHandler}
        onKeyDown={onEnterPressHandler}
        size='small'
        error={error}
        helperText={error && 'Title is required'}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton onClick={addItem} disabled={!title} color='primary' size='large' sx={{ p: 0 }}>
                <AddBoxIcon fontSize='inherit' />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  );
});

export const AddItemFormStory: Story = {
  args: {
    label: 'Todolist title',
  },
};
export const AddItemFormError: Story = {
  render: () => <ErrorAddItemForm label='Todolist title' addItem={action('Button clicked inside form')} />,
};
