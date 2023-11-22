import AddItemForm from './components/AddItemForm/AddItemForm';
import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { TodolistDomainType, addTodolistAC, setTodolistsAC } from './state/todolists-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from './state/store';
import Todolist from './Todolist';
import { useCallback, useEffect } from 'react';
import { todolistApi } from './api/todolist-api';

function AppWithRedux() {
  const todolists = useSelector<StateType, TodolistDomainType[]>(state => state.todolists);
  const dispatch = useDispatch();

  useEffect(() => {
    todolistApi.getTodos().then(res => {
      dispatch(setTodolistsAC(res.data))
    });
  }, []);

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
                  <Todolist todolist={todolist} />
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
