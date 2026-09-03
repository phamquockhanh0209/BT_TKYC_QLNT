import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import CSS Bootstrap và icon
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import hệ thống CSS tùy biến của dự án
import './assets/styles/variables.css';
import './assets/styles/custom.css';
import './assets/styles/stepper.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
