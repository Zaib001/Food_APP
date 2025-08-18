import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import FoodLoader from './components/ui/FoodLoader';

// Lazy-load pages for real loading states
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Ingredients = lazy(() => import('./pages/Ingredients'));
const Home = lazy(() => import('./pages/Home'));
const Recipes = lazy(() => import('./pages/Recipes'));
const Requisitions = lazy(() => import('./pages/Requisitions'));
const Menus = lazy(() => import('./pages/Menus'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Production = lazy(() => import('./pages/Production'));
const Reports = lazy(() => import('./pages/Reports'));
const Planning = lazy(() => import('./pages/Planning'));
const SignUp = lazy(() => import('./components/SignUp'));
const SignIn = lazy(() => import('./components/SignIn'));

// Admin pages
const AdminStats = lazy(() => import('./pages/admin/AdminStats'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminRequisitions = lazy(() => import('./pages/admin/AdminRequisitions'));

function App() {
  return (
    <Suspense fallback={<FoodLoader fullscreen label="Loading dashboard..." /> }>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        {/* Authenticated area */}
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Common */}
            <Route index element={<Dashboard />} />
            <Route path="ingredients" element={<Ingredients />} />
            <Route path="menus" element={<Menus />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="planning" element={<Planning />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="requisitions" element={<Requisitions />} />
            <Route path="production" element={<Production />} />
            <Route path="reports" element={<Reports />} />

            {/* Admin-only */}
            <Route element={<AdminRoute />}>
              <Route path="stats" element={<AdminStats />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="admin-requisitions" element={<AdminRequisitions />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;