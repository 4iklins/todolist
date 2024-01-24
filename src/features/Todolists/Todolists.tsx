import { Grid, Paper } from '@mui/material';
import Todolist from './Todolist/Todolist';
import { TodolistDomainType, todolistsActions } from './todolists-slice';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { RequestStatusType } from '../../app/app-slice';
import React, { useCallback, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { tasksThunks } from './tasks-slice';
import { AddItemForm } from '../../common/components';

const Todolists = () => {
  const status: RequestStatusType = useAppSelector(state => state.app.status);
  const todolists: TodolistDomainType[] = useAppSelector(state => state.todolists);
  const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(todolistsActions.fetchTodolists()).then(data => {
        data.payload?.todoLists.forEach(todolist => {
          dispatch(tasksThunks.fetchTasks(todolist.id));
        });
      });
    }
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(todolistsActions.addTodolist(title));
    },
    [dispatch]
  );
  if (!isLoggedIn) {
    return <Navigate to={'/login'} />;
  }

  return (
    <>
      <Grid container sx={{ p: '24px 0' }}>
        <Grid item xl={3} lg={4} md={6} xs={12}>
          <AddItemForm addItem={addTodolist} label='Todolist title' disabled={status === 'loading'} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {todolists.map(todolist => {
          return (
            <Grid item key={todolist.id} xl={3} lg={4} md={6} xs={12}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Todolist todolist={todolist} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default Todolists;
