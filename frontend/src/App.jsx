import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/admin/Dashboard';
import VehicleList from './pages/admin/VehicleList';
import VehicleForm from './pages/admin/VehicleForm';
import UserList from './pages/admin/UserList';
import MisRegistros from './pages/admin/Registros/MisRegistros';
import ClientesList from './pages/admin/Clientes/ClientesList';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Home from './pages/Home';
import VehicleDetail from './pages/VehicleDetail';
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/conocenos" element={<AboutUs />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* Admin only usually, but public for now */}
          
          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['super_admin', 'seller']} />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/vehicles" element={<VehicleList />} />
            <Route path="/admin/vehicles/new" element={<VehicleForm />} />
            <Route path="/admin/vehicles/edit/:id" element={<VehicleForm />} />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/admin/registros" element={<MisRegistros />} />
            <Route path="/admin/clientes" element={<ClientesList />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
