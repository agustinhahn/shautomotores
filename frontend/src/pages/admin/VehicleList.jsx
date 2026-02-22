import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import vehicleService from '../../services/vehicleService';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Eye, X, BarChart2 } from 'lucide-react';
import Swal from 'sweetalert2';

const VehicleList = () => {
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';

    useEffect(() => {
        if (user) {
            fetchVehicles();
        }
    }, [user]);

    const fetchVehicles = async () => {
        try {
            let data;
            if (user?.role === 'seller') {
                data = await vehicleService.getMyVehicles();
            } else {
                // Fetch sorted by views descending by default for admins
                data = await vehicleService.getAllVehicles({ sort: 'views_desc' });
            }
            setVehicles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            Swal.fire('Error', 'No se pudieron cargar los vehículos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'pending_approval': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'sold': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'reserved': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'hidden': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto. El vehículo será eliminado permanentemente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await vehicleService.deleteVehicle(id);
                setVehicles(vehicles.filter(v => v.id !== id));
                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El vehículo ha sido eliminado.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error("Error deleting vehicle:", error);
                Swal.fire('Error', 'Error al eliminar el vehículo', 'error');
            }
        }
    };

    const handleStatusChange = async (vehicle) => {
        const { value: newStatus } = await Swal.fire({
            title: 'Cambiar Estado',
            input: 'select',
            inputOptions: {
                'pending_approval': 'Pendiente de Aprobación',
                'published': 'Publicado',
                'reserved': 'Señado',
                'sold': 'Vendido',
                'hidden': 'Oculto (Borrador)',
                'rejected': 'Rechazado'
            },
            inputValue: vehicle.status,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar'
        });

        if (newStatus && newStatus !== vehicle.status) {
            try {
                await vehicleService.updateVehicle(vehicle.id, { status: newStatus });
                const statusMap = {
                    'pending_approval': 'Pendiente',
                    'published': 'Publicado',
                    'reserved': 'Señado',
                    'sold': 'Vendido',
                    'hidden': 'Oculto',
                    'rejected': 'Rechazado'
                };
                setVehicles(vehicles.map(v => v.id === vehicle.id ? { ...v, status: newStatus } : v));
                Swal.fire({
                    title: '¡Actualizado!',
                    text: `El estado ha sido cambiado a ${statusMap[newStatus] || newStatus}`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error("Error updating status:", error);
                Swal.fire('Error', 'Error al actualizar estado', 'error');
            }
        }
    };

    const handleView = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsViewModalOpen(true);
    };

    const ViewModal = ({ vehicle, onClose }) => {
        if (!vehicle) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-700/50 p-2 rounded-full transition z-10">
                        <X size={24} />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Image Gallery (Simplified) */}
                        <div className="h-64 md:h-full bg-gray-900 flex items-center justify-center relative group">
                             {vehicle.images && vehicle.images.length > 0 ? (
                                <img src={`${API_BASE}${vehicle.images[0].url}`} alt={vehicle.model} className="w-full h-full object-cover" />
                             ) : (
                                <span className="text-gray-500">Sin imágenes</span>
                             )}
                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                             <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="text-2xl font-bold">{vehicle.brand} {vehicle.model}</h3>
                                <p className="text-yellow-400 font-mono text-xl">{vehicle.currency} {Number(vehicle.price).toLocaleString()}</p>
                             </div>
                        </div>

                        {/* Details */}
                        <div className="p-8 space-y-6">
                            <div>
                                <h4 className="text-gray-400 uppercase text-xs font-bold mb-2">Detalles Principales</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-700">
                                        <span className="text-gray-500 text-xs block">Año</span>
                                        <span className="text-white font-medium">{vehicle.year}</span>
                                    </div>
                                    <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-700">
                                        <span className="text-gray-500 text-xs block">Kilometraje</span>
                                        <span className="text-white font-medium">{Number(vehicle.mileage).toLocaleString()} km</span>
                                    </div>
                                    <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-700">
                                        <span className="text-gray-500 text-xs block">Vistas</span>
                                        <span className="text-white font-medium flex items-center gap-2">
                                            <Eye size={14} className="text-accent" /> {vehicle.views || 0}
                                        </span>
                                    </div>
                                    <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-700">
                                        <span className="text-gray-500 text-xs block">Vendedor</span>
                                        <span className="text-white font-medium">{vehicle.seller?.full_name || 'Desconocido'}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-gray-400 uppercase text-xs font-bold mb-2">Descripción</h4>
                                <p className="text-gray-300 text-sm leading-relaxed">{vehicle.description || 'Sin descripción.'}</p>
                            </div>
                            
                            <button 
                                onClick={() => { onClose(); handleStatusChange(vehicle); }}
                                className="w-full bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold py-3 rounded-xl hover:bg-blue-600/40 transition"
                            >
                                Cambiar Estado
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Gestión de Vehículos</h2>
                    <p className="text-gray-400">Ordenado por visualizaciones (mayor a menor).</p>
                </div>
                <Link to="/admin/vehicles/new" className="flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20">
                    <Plus size={20} />
                    <span>Nuevo Vehículo</span>
                </Link>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700/50 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Vehículo</th>
                                <th className="px-6 py-4">Vistas</th>
                                <th className="px-6 py-4">Precio</th>
                                <th className="px-6 py-4">Vendedor</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Cargando vehículos...</td></tr>
                            ) : vehicles.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No hay vehículos registrados.</td></tr>
                            ) : vehicles.map((vehicle) => (
                                <tr key={vehicle.id} className="hover:bg-gray-700/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-12 rounded overflow-hidden bg-gray-700 flex items-center justify-center shrink-0">
                                                {vehicle.images && vehicle.images.length > 0 ? (
                                                    <img src={`${API_BASE}${vehicle.images[0].url}`} alt={vehicle.model} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xs text-gray-500">No img</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white group-hover:text-accent transition-colors">{vehicle.brand} {vehicle.model}</p>
                                                <p className="text-xs text-gray-400">ID: #{vehicle.id && vehicle.id.slice(0, 8)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-white font-medium">
                                            <BarChart2 size={16} className="text-gray-500" />
                                            {vehicle.views || 0}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white font-mono">
                                        {vehicle.currency} {Number(vehicle.price || 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">
                                        {vehicle.seller?.full_name || 'Desconocido'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 items-start">
                                            <button 
                                                onClick={() => handleStatusChange(vehicle)}
                                                className={`px-3 py-1 rounded-full text-xs border font-medium cursor-pointer hover:bg-opacity-30 transition ${getStatusColor(vehicle.status)}`}
                                                title="Clic para cambiar estado"
                                            >
                                                {(() => {
                                                    const statusMap = {
                                                        'pending_approval': 'Pendiente',
                                                        'published': 'Publicado',
                                                        'reserved': 'Señado',
                                                        'sold': 'Vendido',
                                                        'hidden': 'Oculto',
                                                        'rejected': 'Rechazado'
                                                    };
                                                    return statusMap[vehicle.status] || vehicle.status;
                                                })()}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleView(vehicle)}
                                                className="p-2 text-blue-400 hover:text-white hover:bg-blue-600 rounded-lg transition-all active:scale-95 bg-blue-500/10 border border-blue-500/20"
                                                title="Ver detalles"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <Link 
                                                to={`/admin/vehicles/edit/${vehicle.id}`} 
                                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-all active:scale-95 bg-gray-700/50 hover:bg-gray-600 border border-gray-600"
                                                title="Editar"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(vehicle.id)} 
                                                className="p-2 text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-all active:scale-95 bg-red-500/10 border border-red-500/20"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isViewModalOpen && (
                <ViewModal vehicle={selectedVehicle} onClose={() => setIsViewModalOpen(false)} />
            )}
        </AdminLayout>
    );
};

export default VehicleList;
