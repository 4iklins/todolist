import { Dispatch } from 'redux';
import { setAppStatusAC } from '../../app/app-reducer';
import { LoginParamsType, authApi } from '../../api/auth-api';
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';
import { clearTodolistsAC } from '../Todolists/todolists-reducer';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'));
  return authApi
    .login(data)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
        dispatch(setAppStatusAC('succeeded'));
      } else {
        handleServerAppError(res.data, dispatch);
        return res.data;
      }
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch);
    });
};

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'));
  authApi
    .logout()
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
        dispatch(setAppStatusAC('succeeded'));
        dispatch(clearTodolistsAC());
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
