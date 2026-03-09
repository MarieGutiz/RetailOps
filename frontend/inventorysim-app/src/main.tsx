import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Toaster } from '@/components/ui/sonner';
import AppLoader from './pages/HelpPage/loader/AppLoader.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppLoader>
      <App />
      <Toaster position="top-right" />
    </AppLoader>
  </StrictMode>
);
