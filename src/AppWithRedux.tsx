import AddItemForm from './components/AddItemForm.tsx/AddItemForm';
import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { TodolistType, addTodolistAC } from './state/todolists-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from './state/store';
import TodolistWithRedux from './TodolistWithRedux';
import { useCallback } from 'react';

function AppWithRedux() {
  const todolists = useSelector<StateType, TodolistType[]>(state => state.todolists);
  const dispatch = useDispatch();

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(addTodolistAC(title));
    },
    [dispatch]
  );

  return (
    <div className='App'>
      <AppBar position='fixed'>
        <Toolbar>
          <IconButton color='inherit'>
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' component='h1'>
            Todolist
          </Typography>
          <Button color='inherit' sx={{ ml: 'auto' }}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth={'xl'} sx={{ mt: '64px' }}>
        <Grid container sx={{ p: '24px 0' }}>
          <Grid item xl={3} lg={4} md={6} xs={12}>
            <AddItemForm addItem={addTodolist} label='Todolist title' />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {todolists.map(todolist => {
            return (
              <Grid item key={todolist.id} xl={3} lg={4} md={6} xs={12}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <TodolistWithRedux todolist={todolist} />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}

export default AppWithRedux;
