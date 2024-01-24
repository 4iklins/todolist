import { appActions } from '../../app/app-slice';
import { handleServerAppError } from '../../common/utils';
import { todolistsActions } from '../Todolists/todolists-slice';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppDispatchType, AppThunk } from '../../app/store';
import { handleServerNetworkError } from '../../common/utils';
import { LoginParamsType } from '../../api/authApi';
import { authApi } from '../../api';
import { ResultCode } from '../../common/enums';

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
export const loginTC = (data: LoginParamsType) => (dispatch: AppDispatchType) => {
  dispatch(appActions.setAppStatus({ status: 'loading' }));
  return authApi
    .login(data)
    .then(res => {
      if (res.data.resultCode === ResultCode.success) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
        dispatch(appActions.setAppStatus({ status: 'succeeded' }));
      } else {
        handleServerAppError(res.data, dispatch);
        return res.data;
      }
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch);
    });
};

export const logoutTC = (): AppThunk => dispatch => {
  dispatch(appActions.setAppStatus({ status: 'loading' }));
  authApi
    .logout()
    .then(res => {
      if (res.data.resultCode === ResultCode.success) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
        dispatch(appActions.setAppStatus({ status: 'succeeded' }));
        dispatch(todolistsActions.clearTodolists());
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
