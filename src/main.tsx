import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/workspace.css';
import './styles/panels.css';
import './styles/responsive.css';
import './styles/controls.css';
import './styles/studio.css';
import './styles/public-site.css';
import './styles/landing.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
