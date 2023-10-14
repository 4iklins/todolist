import { FilterType, TodolistType } from '../App';
import { v1 } from 'uuid';
import {
  removeTodolistAC,
  todolistsReducer,
  addTodolistAC,
  changeTitleAC,
  changeTodolistFilterAC,
} from './todolists-reducer';

test('should be removed correct tododlist', () => {
  //
  const todolistId1 = v1();
  const todolistId2 = v1();
  const startState: Array<TodolistType> = [
    { id: todolistId1, title: 'What to learn', filter: 'all' },
    { id: todolistId2, title: 'What to buy', filter: 'all' },
  ];
  //
  const endState = todolistsReducer(startState, removeTodolistAC(todolistId1));

  //
  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});


test('should be added correct todolist ', () => {
  //
  let todolistId1 = v1();
  let todolistId2 = v1();

  let newTodolistTitle = 'New Todolist';

  const startState: Array<TodolistType> = [
    { id: todolistId1, title: 'What to learn', filter: 'all' },
    { id: todolistId2, title: 'What to buy', filter: 'all' },
  ];
  //
  const endState = todolistsReducer(startState, addTodolistAC(newTodolistTitle));
  //
  expect(endState.length).toBe(3);
  expect(endState[2].title).toBe(newTodolistTitle);
});


test('should change name  of correct todolist', () => {
  let todolistId1 = v1();
  let todolistId2 = v1();

  let newTodolistTitle = 'New Todolist';

  const startState: Array<TodolistType> = [
    { id: todolistId1, title: 'What to learn', filter: 'all' },
    { id: todolistId2, title: 'What to buy', filter: 'all' },
  ];

  const endState = todolistsReducer(startState, changeTitleAC(todolistId2, newTodolistTitle));

  expect(endState[0].title).toBe('What to learn');
  expect(endState[1].title).toBe(newTodolistTitle);
});

test('should change filter of correct todolist', () => {
  let todolistId1 = v1();
  let todolistId2 = v1();

  let newFilter: FilterType = 'completed';
  const startState: Array<TodolistType> = [
    { id: todolistId1, title: 'What to learn', filter: 'all' },
    { id: todolistId2, title: 'What to buy', filter: 'all' },
  ];

  const endState = todolistsReducer(startState, changeTodolistFilterAC(todolistId2, newFilter));

  expect(endState[0].filter).toBe('all');
  expect(endState[1].filter).toBe(newFilter);
});
