import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './app/App';
import { SnackbarProvider } from 'notistack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';

const queryClient = new QueryClient({
  queryCache: new QueryCache(),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: true,
      staleTime: 1 * 60 * 1000,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SnackbarProvider maxSnack={5} autoHideDuration={5000}>
            <App />
          </SnackbarProvider>
        </LocalizationProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);