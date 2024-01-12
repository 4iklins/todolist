import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAppDispatch, useAppSelector } from './store';
import { RequestStatusType, initializeAppTC } from './app-slice';
import { ErrorSnackBar } from '../components/ErrorSnackBar/ErrorSnackBar';
import Todolists from '../features/Todolists/Todolists';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Login } from '../features/Login/Login';
import { useEffect } from 'react';
import { logoutTC } from '../features/Login/auth-slice';
import React from 'react';

function App() {
  const status: RequestStatusType = useAppSelector(state => state.app.status);
  const isInitialized = useAppSelector<boolean>(state => state.app.isInitialized);
  const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();

  const logout = () => {
    dispatch(logoutTC());
  };
  useEffect(() => {
    dispatch(initializeAppTC());
  }, []);

  if (!isInitialized) {
    return (
      <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
        <CircularProgress />
      </div>
    );
  }
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
          {isLoggedIn && (
            <Button color='inherit' sx={{ ml: 'auto' }} onClick={logout}>
              Logout
            </Button>
          )}
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
