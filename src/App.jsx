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
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import PrivateRoute from './components/PrivateRoute'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />

      <Route path="/dashboard" element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="ingredients" element={<Ingredients />} />
          <Route path="menus" element={<Menus />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="planning" element={<Planning />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="requisitions" element={<Requisitions />} />
          <Route path="production" element={<Production />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
