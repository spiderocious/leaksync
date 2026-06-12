import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { configureApiClient } from '@leaksync/api';

import '@fontsource/literata/400.css';
import '@fontsource/literata/500.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@leaksync/ui/styles.css';
import { App } from './app';
import './styles.css';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:9090';
configureApiClient(baseUrl);

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Missing #root element in index.html');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
