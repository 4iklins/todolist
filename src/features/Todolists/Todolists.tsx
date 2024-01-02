import { Grid, Paper } from '@mui/material';
import Todolist from '../../components/Todolist/Todolist';
import { TodolistDomainType, addTodolistTC } from '../../state/todolists-reducer';
import AddItemForm from '../../components/AddItemForm/AddItemForm';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { RequestStatusType } from '../../state/app-reducer';
import { useCallback } from 'react';

const Todolists = () => {
  const status: RequestStatusType = useAppSelector(state => state.app.status);
  const todolists: TodolistDomainType[] = useAppSelector(state => state.todolists);
  const dispatch = useAppDispatch();

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(addTodolistTC(title));
    },
    [dispatch]
  );
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
