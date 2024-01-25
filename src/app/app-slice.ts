import { Dispatch } from 'redux';
import { authApi } from '../api/authApi/auth-api';
import { createAppSlice, handleServerAppError } from '../common/utils';
import { authActions } from '../features/Login/auth-slice';
import { PayloadAction } from '@reduxjs/toolkit';
import { handleServerNetworkError } from '../common/utils';
import { ResultCode } from '../common/enums';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

const initialState = {
  status: 'idle' as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
};

const slice = createAppSlice({
  name: 'app',
  initialState,
  reducers: create => {
    return {
      setAppStatus: create.reducer((state, action: PayloadAction<{ status: RequestStatusType }>) => {
        state.status = action.payload.status;
      }),
      setAppError: create.reducer((state, action: PayloadAction<{ error: string | null }>) => {
        state.error = action.payload.error;
      }),
      setIsInitialized: create.reducer((state, action: PayloadAction<{ isInitialized: boolean }>) => {
        state.isInitialized = action.payload.isInitialized;
      }),
    };
  },
});

export type InitialStateType = ReturnType<typeof slice.getInitialState>;

export const appReducer = slice.reducer;
export const appActions = slice.actions;
