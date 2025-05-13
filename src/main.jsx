import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './i18n';
import { BrowserRouter } from 'react-router-dom'; // ✅ IMPORT THIS
import { RequisitionProvider } from './contexts/RequisitionContext';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ WRAPS THE WHOLE APP */}
    <RequisitionProvider>
  <App />
</RequisitionProvider>
    </BrowserRouter>
  </React.StrictMode>
);
