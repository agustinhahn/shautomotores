import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { registrosService } from '../../../services/registrosService';
import Swal from 'sweetalert2';

const RegistroModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const isEdit = !!initialData;
    const [formData, setFormData] = useState({
        vendedor_id: '',
        vehiculo_id: '',
        titulo: '',
        estado: 'Abierto'
    });
    const [options, setOptions] = useState({ vendors: [], vehicles: [] });
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchOptions();
            if (initialData) {
                setFormData({
                    vendedor_id: initialData.vendedor_id,
                    vehiculo_id: initialData.vehiculo_id,
                    titulo: initialData.titulo,
                    descripcion: initialData.descripcion || '',
                    estado: initialData.estado
                });
            } else {
                setFormData({
                    vendedor_id: '',
                    vehiculo_id: '',
                    titulo: '',
                    descripcion: '',
                    estado: 'Abierto'
                });
            }
        }
    }, [isOpen, initialData]);

    useEffect(() => {
        if (formData.vendedor_id) {
            setFilteredVehicles(options.vehicles.filter(v => v.user_id === formData.vendedor_id));
        } else {
            setFilteredVehicles([]);
            // Clear selected vehicle if vendor is deselected
            if (formData.vehiculo_id) {
                setFormData(prev => ({ ...prev, vehiculo_id: '' }));
            }
        }
    }, [formData.vendedor_id, options.vehicles]);

    const fetchOptions = async () => {
        setLoadingOptions(true);
        try {
            const data = await registrosService.getOptions();
            setOptions(data);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar opciones de vendedores o vehículos', 'error');
        } finally {
            setLoadingOptions(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl w-full max-w-lg overflow-hidden border border-gray-700 shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                    <h3 className="text-xl font-bold text-white">
                        {isEdit ? 'Editar Registro' : 'Nuevo Registro'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Título</label>
                            <input 
                                type="text" 
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                required
                                disabled={isEdit}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 flex items-center focus:outline-none focus:border-accent text-white disabled:opacity-50" 
                            />
                        </div>

                        {!isEdit && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Vendedor</label>
                                    <select 
                                        name="vendedor_id"
                                        value={formData.vendedor_id}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 flex items-center focus:outline-none focus:border-accent text-white" 
                                    >
                                        <option value="">Seleccione vendedor...</option>
                                        {options.vendors.map(v => (
                                            <option key={v.id} value={v.id}>{v.full_name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Vehículo (Seleccione un vendedor primero)</label>
                                    <select 
                                        name="vehiculo_id"
                                        value={formData.vehiculo_id}
                                        onChange={handleChange}
                                        required
                                        disabled={!formData.vendedor_id}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 flex items-center focus:outline-none focus:border-accent text-white disabled:opacity-50" 
                                    >
                                        <option value="">Seleccione vehículo...</option>
                                        {filteredVehicles.map(v => (
                                            <option key={v.id} value={v.id}>{v.brand} {v.model}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                        
                        {isEdit && (
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Estado</label>
                                <select 
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 flex items-center focus:outline-none focus:border-accent text-white" 
                                >
                                    <option value="Abierto">Abierto</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Cerrado">Cerrado</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                            <textarea 
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows="3"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 flex items-center focus:outline-none focus:border-accent text-white" 
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-5 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={loadingOptions && !isEdit}
                            className="bg-accent text-primary px-5 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
                        >
                            {isEdit ? 'Guardar Cambios' : 'Crear Registro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistroModal;
