import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ClienteModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const isEdit = !!initialData;
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        descripcion: '',
        estado_interes: 'Interesado Usado'
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    nombre: initialData.nombre,
                    apellido: initialData.apellido,
                    telefono: initialData.telefono || '',
                    descripcion: initialData.descripcion || '',
                    estado_interes: initialData.estado_interes
                });
            } else {
                setFormData({
                    nombre: '',
                    apellido: '',
                    telefono: '',
                    descripcion: '',
                    estado_interes: 'Interesado Usado'
                });
            }
        }
    }, [isOpen, initialData]);

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
                        {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
                                <input 
                                    type="text" 
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-accent text-white" 
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-400 mb-1">Apellido</label>
                                <input 
                                    type="text" 
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-accent text-white" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Teléfono</label>
                            <input 
                                type="text" 
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-accent text-white" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Interés</label>
                            <select 
                                name="estado_interes"
                                value={formData.estado_interes}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-accent text-white" 
                            >
                                <option value="Interesado 0km">Interesado 0km</option>
                                <option value="Interesado Usado">Interesado Usado</option>
                                <option value="Entrega Vehículo">Entrega Vehículo</option>
                                <option value="Entrega Dinero">Entrega Dinero</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Descripción / Notas</label>
                            <textarea 
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows="3"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-accent text-white" 
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
                            className="bg-accent text-primary px-5 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
                        >
                            {isEdit ? 'Guardar Cambios' : 'Agregar Cliente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClienteModal;
