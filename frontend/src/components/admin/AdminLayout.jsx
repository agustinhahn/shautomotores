import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Car, Users, LogOut, Menu, X, ClipboardList, UserPlus } from 'lucide-react';
import logo from '../../assets/logo.png';

const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  // Helper to check active link
  const isActive = (path) => location.pathname === path ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-700 flex flex-col items-center justify-center relative">
            <button 
                onClick={closeSidebar}
                className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-white"
            >
                <X size={24} />
            </button>
            <img src={logo} alt="SH Logo" className="h-20 mb-3 object-contain" />
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <Link 
                to="/admin" 
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin')}`}
            >
                <LayoutDashboard size={20} />
                <span>Tablero</span>
            </Link>
            <Link 
                to="/admin/vehicles" 
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/vehicles')}`}
            >
                <Car size={20} />
                <span>Vehículos</span>
            </Link>
            <Link 
                to="/admin/clientes" 
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/clientes')}`}
            >
                <UserPlus size={20} />
                <span>Clientes</span>
            </Link>
            {user?.role === 'super_admin' && (
                <Link 
                    to="/admin/registros" 
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/registros')}`}
                >
                    <ClipboardList size={20} />
                    <span>Mis Registros</span>
                </Link>
            )}
            {user?.role === 'super_admin' && (
                <Link 
                    to="/admin/users" 
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/users')}`}
                >
                    <Users size={20} />
                    <span>Usuarios</span>
                </Link>
            )}
        </nav>

        <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-accent text-black flex items-center justify-center font-bold">
                    {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                    <p className="text-sm font-medium text-white truncate max-w-[140px]">{user?.full_name}</p>
                    <p className="text-xs text-gray-400 capitalize">
                        {user?.role === 'super_admin' ? 'Administrador' : user?.role === 'admin' ? 'Administrador' : 'Vendedor'}
                    </p>
                </div>
            </div>
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors"
            >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-900">
        <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center md:hidden sticky top-0 z-10">
             <div className="flex items-center gap-3">
                <button onClick={() => setIsSidebarOpen(true)} className="text-white">
                    <Menu size={24} />
                </button>
                <div className="flex items-center gap-2">
                    <img src={logo} alt="SH Logo" className="h-8" />
                    <span className="font-bold text-white">SH AUTO</span>
                </div>
             </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
