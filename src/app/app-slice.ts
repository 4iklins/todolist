import { Dispatch } from 'redux';
import { authApi } from '../api/authApi/auth-api';
import { handleServerAppError } from '../common/utils';
import { authActions } from '../features/Login/auth-slice';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { handleServerNetworkError } from '../common/utils';
import { ResultCode } from '../common/enums';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

const initialState = {
  status: 'idle' as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    },
  },
});

export type InitialStateType = ReturnType<typeof slice.getInitialState>;

export const appReducer = slice.reducer;
export const appActions = slice.actions;

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authApi
    .me()
    .then(res => {
      if (res.data.resultCode === ResultCode.success) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
      dispatch(appActions.setIsInitialized({ isInitialized: true }));
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch);
    });
};
