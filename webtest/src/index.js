import React from 'react';
import ReactDOM from 'react-dom/client';
import AItest from './AItest';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Mount AItest to #react-root if present (used in your public/index.html)
const aiEl = document.getElementById('react-root');
if (aiEl) {
  ReactDOM.createRoot(aiEl).render(<AItest />);
}

// Mount the main app to #root if present
const mainEl = document.getElementById('root');
if (mainEl) {
  ReactDOM.createRoot(mainEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
