import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Global değişkenini tanımla - TypeScript uyumlu
declare global {
  interface Window {
    global: Window;
  }
}

window.global = window;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);