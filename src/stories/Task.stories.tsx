import type { Meta, StoryObj } from '@storybook/react';


import Task from '../components/Task/Task';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Task> = {
  title: 'TODOLISTS/Task',
  component: Task,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    onChangeStatus: {
      description: 'Checkbox clicked',
      action: 'clicked',
    },
    removeTask: {
      description: 'Delet task clicked',
      action: 'clicked',
    },
    changeTaskTitle: {
      description: 'Click outside input',
      action: 'onblur',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Task>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const TaskDone: Story = {
  args: {
    id: '1',
    title: 'JS',
    isDone: true,
  },
};

export const TaskNotDone: Story = {
  args: {
    id: '2',
    title: 'React',
    isDone: false,
  },
};
