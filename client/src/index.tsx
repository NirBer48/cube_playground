import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import InteractiveCube from './cube/InteractiveCube';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <InteractiveCube />
  </React.StrictMode>
);


