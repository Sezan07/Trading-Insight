import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Navbar from './Navbar';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <div>
    {/* <Navbar /> */}
    <App />
  </div>
);
