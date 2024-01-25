import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, StateType } from '../../app/store';

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: StateType;
  dispatch: AppDispatch;
  rejectValue: null;
}>();
