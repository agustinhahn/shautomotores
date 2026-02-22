
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import dashboardService from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Car, Users, Clock, CheckCircle } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalVehicles: 0,
        activeVehicles: 0,
        pendingVehicles: 0,
        soldVehicles: 0,
        totalUsers: 0,
        newLeads: 0
    });
    const [chartsData, setChartsData] = useState({
        sellerData: [],
        activityData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsData = await dashboardService.getStats();
                const chartsData = await dashboardService.getChartsData();
                setStats(statsData);
                setChartsData(chartsData);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm flex items-start justify-between">
            <div>
                <h3 className="text-gray-400 text-sm font-medium uppercase mb-1">{title}</h3>
                <p className={`text-4xl font-bold ${color}`}>{loading ? '-' : value}</p>
                {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
            </div>
            <div className={`p-3 rounded-lg bg-gray-700/50 ${color.replace('text-', 'text-opacity-80 ')}`}>
                <Icon size={24} className={color} />
            </div>
        </div>
    );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Resumen General</h2>
        <p className="text-gray-400">Bienvenido al panel de control de SH Automotores.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
            title="Vehículos Totales" 
            value={stats.totalVehicles} 
            icon={Car} 
            color="text-white" 
            subtext={`${stats.activeVehicles} Publicados`}
        />
        <StatCard 
            title="Pendientes" 
            value={stats.pendingVehicles} 
            icon={Clock} 
            color="text-accent" 
            subtext="Requieren aprobación"
        />
        <StatCard 
            title="Ventas Cerradas" 
            value={stats.soldVehicles} 
            icon={CheckCircle} 
            color="text-green-400" 
            subtext="Vehículos vendidos"
        />
        
        {/* Only Admin sees Users card */}
        {(user?.role === 'super_admin' || user?.role === 'admin') && (
            <StatCard 
                title="Usuarios / Vendedores" 
                value={stats.totalUsers} 
                icon={Users} 
                color="text-blue-400" 
                subtext="Registrados en plataforma"
            />
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Views Chart - Visible to Everyone */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-white mb-6">Vistas por Día (Últimos 30 días)</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartsData?.dailyViewsData}>
                        <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem', color: '#F3F4F6' }}
                        />
                        <Area type="monotone" dataKey="views" stroke="#EAB308" fillOpacity={1} fill="url(#colorViews)" name="Vistas" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Chart - Visible to Everyone */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-white mb-6">Actividad de Publicación</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartsData.activityData}>
                        <defs>
                            <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem', color: '#F3F4F6' }}
                        />
                        <Area type="monotone" dataKey="vehicles" stroke="#3B82F6" fillOpacity={1} fill="url(#colorVehicles)" name="Vehículos" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
          </div>

          {/* Seller Performance Chart - ONLY for Admin */}
          {(user?.role === 'super_admin' || user?.role === 'admin') && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-sm lg:col-span-2">
                <h3 className="text-lg font-bold text-white mb-6">Vehículos por Vendedor</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartsData.sellerData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                            <XAxis type="number" stroke="#9CA3AF" />
                            <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={100} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                cursor={{fill: '#374151', opacity: 0.4}}
                            />
                            <Bar dataKey="vehicles" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Vehículos" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
          )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;



