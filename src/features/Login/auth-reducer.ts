import { Dispatch } from 'redux';
import { setAppStatusAC } from '../../app/app-reducer';
import { LoginParamsType, authApi } from '../../api/auth-api';
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';
import { clearTodolistsAC } from '../Todolists/todolists-reducer';

const initialState = {
  isLoggedIn: false,
};
type InitialStateType = typeof initialState;

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case 'login/SET-IS-LOGGED-IN':
      return { ...state, isLoggedIn: action.value };
    default:
      return state;
  }
};
// actions
export const setIsLoggedInAC = (value: boolean) => ({ type: 'login/SET-IS-LOGGED-IN', value } as const);

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'));
  return authApi
    .login(data)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true));
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
        dispatch(setIsLoggedInAC(false));
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

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC>;
