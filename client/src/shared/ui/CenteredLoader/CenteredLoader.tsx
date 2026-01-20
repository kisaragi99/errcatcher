import { CircularProgress } from '@mui/material';
import { FC } from 'react';

interface CenteredLoaderProps {
  minHeight?: string | number;
  size?: number | string;
}

export const CenteredLoader: FC<CenteredLoaderProps> = ({
  minHeight = '300px',
  size = 40,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight,
        width: '100%',
      }}
    >
      <CircularProgress size={size} />
    </div>
  );
};

export default CenteredLoader;
