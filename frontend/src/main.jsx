import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import i18n from './i18n/index.js';
import './index.css';

i18n.on('languageChanged', (lang) => {
  document.documentElement.lang = lang;
});
document.documentElement.lang = i18n.language;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);