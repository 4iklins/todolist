import { Dispatch } from 'redux';
import { authApi } from '../api/auth-api';
import { handleServerAppError, handleServerNetworkError } from '../utils/error-utils';
import { setIsLoggedInAC } from './auth-reducer';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

const initialState = {
  status: 'idle' as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
};

type InitialStateType = typeof initialState;

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case 'APP/SET-STATUS':
      return { ...state, status: action.status };
    case 'APP/SET-ERROR':
      return { ...state, error: action.error };
    case 'APP/SET-IS-INITIALIZED':
      return { ...state, isInitialized: action.isInitialized };
    default:
      return state;
  }
};

export const setAppStatusAC = (status: RequestStatusType) => {
  return { type: 'APP/SET-STATUS', status } as const;
};

export const setAppErrorAC = (error: string | null) => {
  return { type: 'APP/SET-ERROR', error } as const;
};

export const setIsInitializedAC = (isInitialized: boolean) => {
  return { type: 'APP/SET-IS-INITIALIZED', isInitialized } as const;
};

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authApi
    .me()
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true));
      } else {
        handleServerAppError(res.data, dispatch);
      }
      dispatch(setIsInitializedAC(true));
    })
    .catch(e => {
      handleServerNetworkError(e, dispatch);
    });
};
type ActionsType =
  | ReturnType<typeof setAppStatusAC>
  | ReturnType<typeof setAppErrorAC>
  | ReturnType<typeof setIsInitializedAC>;
