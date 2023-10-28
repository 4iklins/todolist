import { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';
import { memo } from 'react';

interface IButtonProps extends ButtonProps {}

const ButtonMemo = memo(({ children, ...props }: IButtonProps) => {
  return <Button {...props}>{children}</Button>;
});

export default ButtonMemo;
