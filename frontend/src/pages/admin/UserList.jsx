import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import UserFormModal from '../../components/admin/UserFormModal';
import userService from '../../services/userService';
import { User, Trash2, Edit, CheckCircle, XCircle, Search } from 'lucide-react';
import Swal from 'sweetalert2';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (user) => {
        const result = await Swal.fire({
            title: `¿Eliminar a ${user.full_name}?`,
            text: "Esta acción no se puede deshacer.",
            // icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#374151',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#1F2937',
            color: '#fff',
            iconColor: '#EF4444'
        });

        if (result.isConfirmed) {
            try {
                await userService.deleteUser(user.id);
                setUsers(users.filter(u => u.id !== user.id));
                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El usuario ha sido eliminado.',
                    icon: 'success',
                    background: '#1F2937',
                    color: '#fff',
                    confirmButtonColor: '#EAB308',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo eliminar el usuario',
                    icon: 'error',
                    background: '#1F2937',
                    color: '#fff'
                });
            }
        }
    };

    const handleCreateUser = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (formData) => {
        setCreating(true);
        try {
            if (selectedUser) {
                // Update existing user
                const updatedUser = await userService.updateUser(selectedUser.id, formData);
                // The backend returns { message, user: { ... } }
                setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...updatedUser.user } : u));
                Swal.fire({
                    title: '¡Actualizado!',
                    text: 'Usuario actualizado exitosamente',
                    icon: 'success',
                    background: '#1F2937',
                    color: '#fff',
                    confirmButtonColor: '#EAB308',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                // Create new user
                const newUser = await userService.createUser(formData);
                setUsers([newUser, ...users]);
                Swal.fire({
                    title: '¡Creado!',
                    text: 'Usuario creado exitosamente',
                    icon: 'success',
                    background: '#1F2937',
                    color: '#fff',
                    confirmButtonColor: '#EAB308',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Operación fallida',
                icon: 'error',
                background: '#1F2937',
                color: '#fff'
            });
        } finally {
            setCreating(false);
        }
    };

    const filteredUsers = users.filter(user => 
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Gestión de Usuarios</h2>
                    <p className="text-gray-400">Administra los usuarios, roles y permisos.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar usuario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-accent transition-colors"
                        />
                    </div>
                    <button 
                        onClick={handleCreateUser}
                        className="flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 active:scale-95"
                    >
                        <User size={20} />
                        <span>Nuevo</span>
                    </button>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700/50 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Usuario</th>
                                <th className="px-6 py-4">Rol</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Registro</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Cargando usuarios...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No se encontraron usuarios.</td></tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-700/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-accent font-bold shrink-0">
                                                {user.full_name ? user.full_name.charAt(0).toUpperCase() : <User size={20} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white group-hover:text-accent transition-colors">{user.full_name}</div>
                                                <div className="text-sm text-gray-400">{user.email}</div>
                                                {user.phone && <div className="text-xs text-gray-500 mt-0.5">{user.phone}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs border font-medium ${
                                            user.role === 'super_admin' || user.role === 'admin' 
                                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>
                                            {user.role === 'super_admin' ? 'ADMINISTRADOR' : user.role === 'admin' ? 'ADMINISTRADOR' : 'VENDEDOR'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-2 text-sm font-medium ${
                                            user.status === 'active' ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            {user.status === 'active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                            {user.status === 'active' ? 'Activo' : 'Suspendido'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleEditUser(user)}
                                                title="Editar Usuario"
                                                className="p-2 text-blue-400 hover:text-white hover:bg-blue-600 rounded-lg transition-all active:scale-95 bg-blue-500/10 border border-blue-500/20"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user)}
                                                title="Eliminar Usuario"
                                                className="p-2 text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-all active:scale-95 bg-red-500/10 border border-red-500/20"
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

            <UserFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                isLoading={creating}
                initialData={selectedUser}
            />
        </AdminLayout>
    );
};

export default UserList;
