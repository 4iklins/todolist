import { appActions } from '../../app/app-slice';
import { createAppSlice, handleServerAppError } from '../../common/utils';
import { todolistsActions } from '../Todolists/todolists-slice';
import { PayloadAction } from '@reduxjs/toolkit';
import { handleServerNetworkError } from '../../common/utils';
import { LoginParamsType } from '../../api/authApi';
import { authApi } from '../../api';
import { ResultCode } from '../../common/enums';
import { ResponseType } from '../../api/todolistApi';

const initialState = {
  isLoggedIn: false,
  captcha: null as null | string,
};

const slice = createAppSlice({
  name: 'auth',
  initialState,
  reducers: create => {
    const createAppThunk = create.asyncThunk.withTypes<{
      rejectValue: null | ResponseType | { captcha: string };
    }>();
    return {
      setIsLoggedIn: create.reducer((state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      }),
      setCaptcha: create.reducer((state, action: PayloadAction<{ captcha: string | null }>) => {
        state.captcha = action.payload.captcha;
      }),
      login: createAppThunk(
        async (arg: LoginParamsType, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;
          dispatch(appActions.setAppStatus({ status: 'loading' }));
          try {
            const res = await authApi.login(arg);
            if (res.data.resultCode === ResultCode.capcha) {
              const captcha = await authApi.captcha();
              debugger;
              dispatch(authActions.setCaptcha({ captcha: captcha.data.url }));
            }
            if (res.data.resultCode === ResultCode.success) {
              dispatch(appActions.setAppStatus({ status: 'succeeded' }));
              dispatch(authActions.setCaptcha({ captcha: null }));
              return { isLoggedIn: true };
            } else {
              handleServerAppError(res.data, dispatch);
              return rejectWithValue(res.data);
            }
          } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
          }
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
          },
        }
      ),
      logout: createAppThunk(
        async (arg: undefined, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;
          dispatch(appActions.setAppStatus({ status: 'loading' }));
          try {
            const res = await authApi.logout();
            if (res.data.resultCode === ResultCode.success) {
              dispatch(appActions.setAppStatus({ status: 'succeeded' }));
              dispatch(todolistsActions.clearTodolists());
              return { isLoggedIn: false };
            } else {
              handleServerAppError(res.data, dispatch);
              return rejectWithValue(null);
            }
          } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
          }
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
          },
        }
      ),
      initializeApp: createAppThunk(
        async (arg: undefined, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;
          try {
            const res = await authApi.me();
            if (res.data.resultCode === ResultCode.success) {
              return { isLoggedIn: true };
            } else {
              // handleServerAppError(res.data, dispatch);
              return rejectWithValue(null);
            }
          } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
          } finally {
            dispatch(appActions.setIsInitialized({ isInitialized: true }));
          }
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
          },
        }
      ),
    };
  },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
