import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { appActions } from '../../app/app-slice';
import { handleServerNetworkError } from './handleServerNetworkError';
import { Dispatch } from '@reduxjs/toolkit';

export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<unknown, unknown, Dispatch, null>,
  logic: () => Promise<T>
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatus({ status: 'loading' }));
  try {
    return await logic();
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppStatus({ status: 'idle' }));
  }
};
