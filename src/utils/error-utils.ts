import { Dispatch } from 'redux';
import { ResponseType } from '../api/todolist-api';
import { setAppErrorAC, setAppStatusAC } from '../state/app-reducer';

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(setAppErrorAC(data.messages[0]));
  } else {
    dispatch(setAppErrorAC('Some error occurred'));
  }
  dispatch(setAppStatusAC('failed'));
};

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
  dispatch(setAppErrorAC(error.message));
  dispatch(setAppStatusAC('failed'));
};
