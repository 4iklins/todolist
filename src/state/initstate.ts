import { v1 } from 'uuid';
import { StateType } from './store';

const todolistId1 = v1();
const todolistId2 = v1();

export const initState: StateType = {
  todolists: [
    { id: todolistId1, title: 'What to learn', filter: 'all' },
    { id: todolistId2, title: 'What to buy', filter: 'all' },
  ],
  tasks: {
    [todolistId1]: [
      { id: v1(), title: 'HTML&CSS', isDone: true },
      { id: v1(), title: 'JS', isDone: true },
      { id: v1(), title: 'ReactJS', isDone: false },
    ],
    [todolistId2]: [
      { id: v1(), title: 'Chocolate', isDone: true },
      { id: v1(), title: 'Coffee', isDone: true },
      { id: v1(), title: 'Bread', isDone: false },
    ],
  },
};
