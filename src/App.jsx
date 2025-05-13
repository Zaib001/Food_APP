import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Ingredients from './pages/Ingredients';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Requisitions from './pages/Requisitions';
import Menus from './pages/Menus';
import Inventory from './pages/Inventory';
import Production from './pages/Production';
import Reports from './pages/Reports';
import Planning from './pages/Planning';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Dashboard layout with nested pages */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="ingredients" element={<Ingredients />} />
        {/* Add more nested routes here when needed */}
        <Route path="menus" element={<Menus />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="planning" element={<Planning />} />
        <Route path="recipes" element={<Recipes />} />
        <Route path="requisitions" element={<Requisitions />} />
        <Route path="production" element={<Production />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default App;
