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
import { PlanningProvider } from './contexts/PlanningContext';
import { Toaster } from 'react-hot-toast';
import { InventoryProvider } from './contexts/InventoryContext';
import { ProductionProvider } from './contexts/ProductionContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <RequisitionProvider>
        <IngredientProvider>
          <RecipeProvider>
            <MenuProvider>
              <PlanningProvider>
                <InventoryProvider>
                <ProductionProvider>
                  <Toaster position="top-right" />
                  <App />
                  </ProductionProvider>
                </InventoryProvider>
              </PlanningProvider>
            </MenuProvider>
          </RecipeProvider>
        </IngredientProvider>
      </RequisitionProvider>
    </BrowserRouter>
  </React.StrictMode>
);

