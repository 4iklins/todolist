import { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';
import React from 'react';
import { memo } from 'react';

interface IButtonProps extends ButtonProps {}

export const ButtonMemo = memo(({ children, ...props }: IButtonProps) => {
  return <Button {...props}>{children}</Button>;
});

