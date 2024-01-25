import React from 'react';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import { Link } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Navigate } from 'react-router-dom';
import { LoginParamsType } from '../../api/authApi';
import { authActions } from './auth-slice';

const EMAIL_REGEXP = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
export const Login = () => {
  const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn);
  const captcha = useAppSelector<string | null>(state => state.auth.captcha);
  const dispatch = useAppDispatch();
  const { values, handleSubmit, handleChange, errors, touched, getFieldProps, resetForm, isSubmitting } =
    useFormik<LoginParamsType>({
      initialValues: {
        email: '',
        password: '',
        rememberMe: false,
        captcha: null,
      },
      onSubmit: async values => {
        await dispatch(authActions.login(values))
          .unwrap()
          .then(res => {
            if (res.isLoggedIn) resetForm();
          })
          .catch(e => {
            debugger;
          });
      },
      validate: values => {
        const errors: Partial<LoginParamsType> = {};
        if (!values.email) {
          errors.email = 'Required';
        } else if (!EMAIL_REGEXP.test(values.email)) {
          errors.email = 'Invalid email address';
        }
        if (!values.password) {
          errors.password = 'Required';
        } else if (values.password.length <= 3) {
          errors.password = 'Password must be more than 3 characters';
        }
        if (captcha && !values.captcha) {
          errors.captcha = 'Required';
        }
        return errors;
      },
    });
  if (isLoggedIn) {
    return <Navigate to={'/'} />;
  }

  return (
    <Grid container justifyContent={'center'}>
      <Grid item justifyContent={'center'}>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered
                <Link
                  href={'https://social-network.samuraijs.com/'}
                  target={'_blank'}
                  sx={{ marginLeft: '5px' }}
                  underline='hover'>
                  here
                </Link>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField
                size='small'
                label='Email'
                {...getFieldProps('email')}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                type='email'
                sx={{ margin: 0, height: '64px' }}
              />
              <TextField
                size='small'
                type='password'
                label='Password'
                {...getFieldProps('password')}
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ margin: 0, height: '64px' }}
              />
              <FormControlLabel
                label={'Remember me'}
                control={<Checkbox name='rememberMe' checked={values.rememberMe} onChange={handleChange} />}
              />
              {captcha && <img src={captcha}></img>}
              {captcha && (
                <TextField
                  size='small'
                  type='text'
                  label='Captcha'
                  {...getFieldProps('captcha')}
                  error={touched.captcha && !!errors.captcha}
                  helperText={touched.captcha && errors.captcha}
                />
              )}
              <Button
                type={'submit'}
                variant={'contained'}
                color={'primary'}
                sx={{ margin: '24px 0' }}
                disabled={isSubmitting}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  );
};
