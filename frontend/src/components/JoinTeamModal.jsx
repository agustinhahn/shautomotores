import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';

const JoinTeamModal = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({
        name: '',
        specialty: [],
        brand: '',
        environment: [],
        zone: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e, arrayName) => {
        const { value, checked } = e.target;
        setForm(prev => {
            if (checked) {
                return { ...prev, [arrayName]: [...prev[arrayName], value] };
            } else {
                return { ...prev, [arrayName]: prev[arrayName].filter(item => item !== value) };
            }
        });
    };

    const handleWhatsAppClick = (message) => {
        const phone = "5493415810277"; 
        const text = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    };

    const submitForm = () => {
        let message = `*SOLICITUD: QUIERO UNIRME AL EQUIPO*\n`;
        message += `--------------------------------\n\n`;
        message += `*Nombre Completo:* ${form.name}\n`;
        message += `*Especialidad Principal:* ${form.specialty.length > 0 ? form.specialty.join(', ') : 'No especificada'}\n`;
        message += `*Marca / Terminal:* ${form.brand || 'No especificada'}\n`;
        message += `*Entorno de Trabajo:* ${form.environment.length > 0 ? form.environment.join(', ') : 'No especificado'}\n`;
        message += `*Zona de influencia:* ${form.zone || 'No especificada'}\n`;

        handleWhatsAppClick(message);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl p-6 md:p-8 relative scale-100 animate-scale-up border border-secondary/20 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-primary bg-light hover:bg-gray-200 rounded-full p-2 transition"
                >
                    <X size={20}/>
                </button>
                
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">¿Querés ser parte de nuestro plantel de vendedores?</h2>
                    <p className="text-sm text-gray-600 font-medium">
                        En <span className="text-accent font-bold">SH Automotores</span> no solo generamos contactos, creamos oportunidades reales de negocio. Nuestra plataforma es el nexo más eficiente entre clientes decididos y los mejores profesionales del sector.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Buscamos asesores comerciales con ambición, transparencia y capacidad de resolución que quieran potenciar sus ventas recibiendo leads calificados y listos para avanzar. Si sos un experto en tu área y compartís nuestra visión de convertir cada consulta en una entrega concreta, este es tu lugar.
                        <br/><br/>
                        Sumate a la red de gestión automotriz con mayor proyección y llevá tu carrera al siguiente nivel.
                    </p>
                </div>

                <div className="space-y-5">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo *</label>
                        <input 
                            type="text" 
                            name="name"
                            value={form.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none bg-gray-50 focus:bg-white"
                            placeholder="Ej: Juan Pérez"
                        />
                    </div>

                    {/* Especialidad */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Especialidad Principal</label>
                        <div className="space-y-2">
                            {['Vendedor de Plan de Ahorro', 'Vendedor Convencional (Venta Directa)', 'Vendedor de Usados Seleccionados'].map((opt) => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        name="specialty" 
                                        value={opt} 
                                        checked={form.specialty.includes(opt)}
                                        onChange={(e) => handleCheckboxChange(e, 'specialty')}
                                        className="text-accent focus:ring-accent w-4 h-4 rounded cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Marca */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Marca / Terminal con la que operás</label>
                        <input 
                            type="text" 
                            name="brand"
                            value={form.brand}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none bg-gray-50 focus:bg-white"
                            placeholder="Ej: Toyota, Ford, Fiat, Multimarca, etc."
                        />
                    </div>

                    {/* Entorno de Trabajo */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Entorno de Trabajo</label>
                        <div className="space-y-2">
                            {['Opero dentro de una Concesionaria Oficial', 'Opero de forma Independiente / Cuenta propia'].map((opt) => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        name="environment" 
                                        value={opt} 
                                        checked={form.environment.includes(opt)}
                                        onChange={(e) => handleCheckboxChange(e, 'environment')}
                                        className="text-accent focus:ring-accent w-4 h-4 rounded cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Zona */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tu zona de influencia</label>
                        <input 
                            type="text" 
                            name="zone"
                            value={form.zone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all outline-none bg-gray-50 focus:bg-white"
                            placeholder="Ciudad / Provincia"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 mt-2 border-t border-gray-100">
                        <button 
                            onClick={submitForm} 
                            disabled={!form.name}
                            className={`w-full text-white text-lg font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-xl transform transition-all ${!form.name ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-[#1a252f] shadow-primary/20 hover:-translate-y-1'}`}
                        >
                            <MessageCircle size={26} className={form.name ? "text-[#25D366]" : "text-white"}/> Enviar Info
                        </button>
                        {!form.name && <p className="text-center text-xs text-red-400 mt-2">* El nombre es obligatorio para poder enviar</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinTeamModal;
