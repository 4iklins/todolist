import AddItemForm from './components/AddItemForm/AddItemForm';
import { AppBar, Button, Container, Grid, IconButton, LinearProgress, Paper, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { TodolistDomainType, addTodolistTC, fetchTodolistsTC } from './state/todolists-reducer';
import { useAppDispatch, useAppSelector } from './state/store';
import { useCallback, useEffect } from 'react';
import { RequestStatusType } from './state/app-reducer';
import { ErrorSnackBar } from './components/ErrorSnackBar/ErrorSnackBar';
import Todolists from './features/Todolists/Todolists';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './features/Login/Login';

function App() {
  const status: RequestStatusType = useAppSelector(state => state.app.status);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTodolistsTC());
  }, []);

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
        <Routes>
          <Route path='/' element={<Todolists />} />
          <Route path='/login' element={<Login />} />

          <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>} />
          <Route path='*' element={<Navigate to='/404' />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
