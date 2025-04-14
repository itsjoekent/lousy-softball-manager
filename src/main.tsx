import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { App } from './App.tsx';
import { seedState } from './seed';
import { writeStateToLocalStorage } from './state';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <App />
      <Notifications />
    </MantineProvider>
  </StrictMode>
);

declare global {
  interface Window {
    seedState: () => void;
  }
}

if (import.meta.env.DEV) {
  window.seedState = () => writeStateToLocalStorage(seedState);
}
