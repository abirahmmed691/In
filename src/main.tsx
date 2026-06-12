import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SettingsProvider } from './context/SettingsContext';
import { TransactionProvider } from './context/TransactionContext';
import { UserProvider } from './context/UserContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <UserProvider>
        <TransactionProvider>
          <App />
        </TransactionProvider>
      </UserProvider>
    </SettingsProvider>
  </StrictMode>,
);
