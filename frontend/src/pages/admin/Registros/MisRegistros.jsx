import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import RegistroModal from './RegistroModal';
import { registrosService } from '../../../services/registrosService';
import { ClipboardList, Plus, Search, Edit } from 'lucide-react';
import Swal from 'sweetalert2';

const MisRegistros = () => {
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRegistro, setSelectedRegistro] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('Todos');

    useEffect(() => {
        fetchRegistros();
    }, []);

    const fetchRegistros = async () => {
        setLoading(true);
        try {
            const data = await registrosService.getRegistros();
            setRegistros(data);
        } catch (error) {
            console.error("Error fetching registros:", error);
            Swal.fire('Error', 'No se pudieron cargar los registros', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedRegistro(null);
        setIsModalOpen(true);
    };

    const handleEdit = (registro) => {
        setSelectedRegistro(registro);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (formData) => {
        try {
            if (selectedRegistro) {
                const updated = await registrosService.updateRegistro(selectedRegistro.id, formData);
                setRegistros(registros.map(r => r.id === selectedRegistro.id ? { ...r, ...updated, vendedor: r.vendedor, vehiculo: r.vehiculo } : r));
                Swal.fire('¡Actualizado!', 'Registro actualizado exitosamente', 'success');
            } else {
                await registrosService.createRegistro(formData);
                fetchRegistros(); // Refetch to get the nested vendedor and vehiculo objects
                Swal.fire('¡Creado!', 'Registro creado exitosamente', 'success');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.response?.data?.message || 'Operación fallida', 'error');
        }
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'Abierto': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Pendiente': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'Cerrado': return 'bg-green-500/10 text-green-400 border-green-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    const filteredRegistros = registros.filter(r => {
        const matchesSearch = 
            r.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.vendedor?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.vehiculo?.brand?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterEstado === 'Todos' || r.estado === filterEstado;
        return matchesSearch && matchesStatus;
    });

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Mis Registros</h2>
                    <p className="text-gray-400">Control de transacciones y señas.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto flex-wrap">
                    <select 
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                    >
                        <option value="Todos">Todos</option>
                        <option value="Abierto">Abierto</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Cerrado">Cerrado</option>
                    </select>
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar registro..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-accent"
                        />
                    </div>
                    <button 
                        onClick={handleCreate}
                        className="flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Nuevo Registro</span>
                    </button>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700/50 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Título</th>
                                <th className="px-6 py-4">Vendedor</th>
                                <th className="px-6 py-4">Vehículo</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 text-sm">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Cargando registros...</td></tr>
                            ) : filteredRegistros.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No se encontraron registros.</td></tr>
                            ) : filteredRegistros.map((registro) => (
                                <tr key={registro.id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{registro.titulo}</td>
                                    <td className="px-6 py-4 text-gray-300">{registro.vendedor?.full_name || 'Desconocido'}</td>
                                    <td className="px-6 py-4 text-gray-300">
                                        {registro.vehiculo ? `${registro.vehiculo.brand} ${registro.vehiculo.model}` : 'Desconocido'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs border font-medium ${getEstadoColor(registro.estado)}`}>
                                            {registro.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{new Date(registro.created_at || registro.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleEdit(registro)}
                                            className="p-2 text-blue-400 hover:text-white hover:bg-blue-600 rounded-lg transition-all bg-blue-500/10 border border-blue-500/20"
                                        >
                                            <Edit size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <RegistroModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSubmit={handleModalSubmit} 
                    initialData={selectedRegistro} 
                />
            )}
        </AdminLayout>
    );
};

export default MisRegistros;
