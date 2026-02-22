import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import ClienteModal from './ClienteModal';
import { clientesService } from '../../../services/clientesService';
import { UserPlus, Search, Edit } from 'lucide-react';
import Swal from 'sweetalert2';

const ClientesList = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        setLoading(true);
        try {
            const data = await clientesService.getClientes();
            setClientes(data);
        } catch (error) {
            console.error("Error fetching clientes:", error);
            Swal.fire('Error', 'No se pudieron cargar los clientes', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedCliente(null);
        setIsModalOpen(true);
    };

    const handleEdit = (cliente) => {
        setSelectedCliente(cliente);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (formData) => {
        try {
            if (selectedCliente) {
                const updated = await clientesService.updateCliente(selectedCliente.id, formData);
                setClientes(clientes.map(c => c.id === selectedCliente.id ? updated : c));
                Swal.fire('¡Actualizado!', 'Cliente actualizado exitosamente', 'success');
            } else {
                const created = await clientesService.createCliente(formData);
                setClientes([created, ...clientes]);
                Swal.fire('¡creado!', 'Cliente agregado exitosamente', 'success');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.response?.data?.message || 'Operación fallida', 'error');
        }
    };

    const filteredClientes = clientes.filter(c => 
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.telefono && c.telefono.includes(searchTerm))
    );

    const getInteresColor = (interes) => {
        switch (interes) {
            case 'Interesado 0km': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'Interesado Usado': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Entrega Vehículo': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'Entrega Dinero': return 'bg-green-500/10 text-green-400 border-green-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Gestión de Clientes</h2>
                    <p className="text-gray-400">Control de leads y potenciales compradores.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-accent"
                        />
                    </div>
                    <button 
                        onClick={handleCreate}
                        className="flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 active:scale-95"
                    >
                        <UserPlus size={20} />
                        <span>Nuevo Lead</span>
                    </button>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700/50 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Nombre Completo</th>
                                <th className="px-6 py-4">Teléfono</th>
                                <th className="px-6 py-4">Interés</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 text-sm">
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Cargando clientes...</td></tr>
                            ) : filteredClientes.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No se encontraron clientes.</td></tr>
                            ) : filteredClientes.map((cliente) => (
                                <tr key={cliente.id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{cliente.nombre} {cliente.apellido}</td>
                                    <td className="px-6 py-4 text-gray-300">{cliente.telefono || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs border font-medium whitespace-nowrap ${getInteresColor(cliente.estado_interes)}`}>
                                            {cliente.estado_interes}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{new Date(cliente.created_at || cliente.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleEdit(cliente)}
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
                <ClienteModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSubmit={handleModalSubmit} 
                    initialData={selectedCliente} 
                />
            )}
        </AdminLayout>
    );
};

export default ClientesList;
