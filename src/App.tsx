import AddItemForm from './components/AddItemForm/AddItemForm';
import { AppBar, Button, Container, Grid, IconButton, LinearProgress, Paper, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { TodolistDomainType, addTodolistTC, fetchTodolistsTC } from './state/todolists-reducer';
import { useAppDispatch, useAppSelector } from './state/store';
import Todolist from './Todolist';
import { useCallback, useEffect } from 'react';
import { RequestStatusType } from './state/app-reducer';
import { ErrorSnackBar } from './components/ErrorSnackBar/ErrorSnackBar';

function App() {
  const todolists: TodolistDomainType[] = useAppSelector(state => state.todolists);
  const status: RequestStatusType = useAppSelector(state => state.app.status);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTodolistsTC());
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(addTodolistTC(title));
    },
    [dispatch]
  );

  return (
    <div className='App'>
      <ErrorSnackBar />
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
        {status === 'loading' && <LinearProgress color='secondary' />}
      </AppBar>
      <Container maxWidth={'xl'} sx={{ mt: '64px' }}>
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
      </Container>
    </div>
  );
}

export default App;
