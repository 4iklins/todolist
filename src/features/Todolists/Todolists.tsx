import { Grid, Paper } from '@mui/material';
import Todolist from './Todolist/Todolist';
import { TodolistDomainType, addTodolistTC, fetchTodolistsTC } from './todolists-reducer';
import AddItemForm from '../../components/AddItemForm/AddItemForm';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { RequestStatusType } from '../../app/app-reducer';
import React, { useCallback, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Todolists = () => {
  const status: RequestStatusType = useAppSelector(state => state.app.status);
  const todolists: TodolistDomainType[] = useAppSelector(state => state.todolists);
  const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchTodolistsTC());
    }
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(addTodolistTC(title));
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
