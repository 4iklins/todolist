import { ReducerCreators, createAsyncThunk } from '@reduxjs/toolkit'
import { AppDispatchType, StateType } from '../app/store'


export const createAppAsyncThunk = createAsyncThunk.withTypes<{
	state: StateType
	dispatch: AppDispatchType
	rejectValue: null
  }>()
