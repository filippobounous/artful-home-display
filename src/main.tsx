import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './components/ThemeProvider';
import { ServiceProvider } from './context/ServiceProvider';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <ServiceProvider>
      <App />
    </ServiceProvider>
  </ThemeProvider>,
);
