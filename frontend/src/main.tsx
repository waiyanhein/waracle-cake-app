import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'react-responsive-pagination/themes/classic.css';
import './index.css';
import Modal from 'react-modal';
import App from './App.tsx';

Modal.setAppElement('#root');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
