import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './i18n';
import { BrowserRouter } from 'react-router-dom'; // ✅ IMPORT THIS
import { RequisitionProvider } from './contexts/RequisitionContext';
import { IngredientProvider } from './contexts/IngredientContext';
import { RecipeProvider } from './contexts/RecipeContext';
import { MenuProvider } from './contexts/MenuContext';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <RequisitionProvider>
        <IngredientProvider>
          <RecipeProvider>
            <MenuProvider>
              <App />
            </MenuProvider>
          </RecipeProvider>
        </IngredientProvider>
      </RequisitionProvider>
    </BrowserRouter>
  </React.StrictMode>
);
