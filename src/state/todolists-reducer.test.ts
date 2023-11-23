// @ts-nocheck

import { v1 } from 'uuid';
import {
  removeTodolistAC,
  todolistsReducer,
  addTodolistAC,
  changeTodolistTitleAC,
  changeTodolistFilterAC,
  FilterType,
  TodolistDomainType,
} from './todolists-reducer';

let todolistId1: string;
let todolistId2: string;
let startState: TodolistDomainType[];

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();
  startState = [
    { id: todolistId1, title: 'What to learn', filter: 'all', addedDate: new Date(), order: 0 },
    { id: todolistId2, title: 'What to buy', filter: 'all', addedDate: new Date(), order: 0 },
  ];
});

//
test('should be removed correct tododlist', () => {
  const endState = todolistsReducer(startState, removeTodolistAC(todolistId1));

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});
//
test('should be added correct todolist ', () => {
  let newTodolistTitle = 'New Todolist';
  const endState = todolistsReducer(startState, addTodolistAC(newTodolistTitle));

  expect(endState.length).toBe(3);
  expect(endState[2].title).toBe(newTodolistTitle);
});
//
test('should change name  of correct todolist', () => {
  let newTodolistTitle = 'New Todolist';
  const endState = todolistsReducer(startState, changeTodolistTitleAC(todolistId2, newTodolistTitle));

  expect(endState[0].title).toBe('What to learn');
  expect(endState[1].title).toBe(newTodolistTitle);
});
//
test('should change filter of correct todolist', () => {
  let newFilter: FilterType = 'completed';
  const endState = todolistsReducer(startState, changeTodolistFilterAC(todolistId2, newFilter));

  expect(endState[0].filter).toBe('all');
  expect(endState[1].filter).toBe(newFilter);
});
