import { LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';

interface LoadingBarProps {
  isLoading: boolean;
}

export const LoadingBar = ({ isLoading }: LoadingBarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isLoading) {
      setIsVisible(true);
    } else {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 200);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <LinearProgress 
      color="primary" 
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1400,
        height: 3,
        '& .MuiLinearProgress-bar': {
          transition: 'transform 0.2s linear',
        },
        opacity: isLoading ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out',
      }}
    />
  );
};

export default LoadingBar;
