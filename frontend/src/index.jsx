import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// This is the standard way to initialize a React 18 application.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
