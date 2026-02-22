import { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';

const ContactModal = ({ isOpen, onClose, vehicle = null, defaultMessage = '', mode = 'consult' }) => {
    const [isTradeIn, setIsTradeIn] = useState(false);
    const [contactForm, setContactForm] = useState({
        name: '',
        surname: '',
        phone: '',
        dealership: '',
        vehicleCount: '',
        message: defaultMessage,
        brand: '',
        model: '',
        year: '',
        mileage: ''
    });

    // Reset form when modal opens/closes or vehicle changes
    useEffect(() => {
        if (isOpen) {
             setContactForm(prev => ({
                ...prev,
                message: defaultMessage,
            }));
        }
    }, [isOpen, defaultMessage, vehicle]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContactForm(prev => ({ ...prev, [name]: value }));
    };

    const handleWhatsAppClick = (message) => {
        const phone = "5493416524078"; // Replace with actual number
        const text = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    };

    const submitContact = () => {
        let message = "";

        if (mode === 'publish') {
            message += `*SOLICITUD DE PUBLICACIÓN*\n`;
            message += `--------------------------------\n\n`;
            message += `*Datos del Solicitante:*\n`;
            if (contactForm.name) message += `*Nombre:* ${contactForm.name}\n`;
            if (contactForm.surname) message += `*Apellido:* ${contactForm.surname}\n`;
            if (contactForm.phone) message += `*Teléfono:* ${contactForm.phone}\n`;
            if (contactForm.dealership) message += `*Concesionaria:* ${contactForm.dealership}\n`;
            if (contactForm.vehicleCount) message += `*Cant. Vehículos:* ${contactForm.vehicleCount}\n`;
        } else {
            if (vehicle) {
                message += `*CONSULTA POR VEHÍCULO*\n`;
                message += `--------------------------------\n`;
                message += `*Vehículo:* ${vehicle.brand} ${vehicle.model}\n`;
                message += `*Link:* ${window.location.href}\n\n`;
            } else {
                message += `*CONSULTA GENERAL - WEB*\n`;
                message += `--------------------------------\n\n`;
            }

            message += `*Datos del Cliente:*\n`;
            if (contactForm.name) message += `*Nombre:* ${contactForm.name}\n`;
            if (contactForm.phone) message += `*Teléfono:* ${contactForm.phone}\n\n`;
            
            message += `*Mensaje:*\n${contactForm.message || "Hola, quería hacer una consulta."}\n`;
            
            if (isTradeIn) {
                message += `\n*Vehículo a Entregar:*\n`;
                message += `*Marca:* ${contactForm.brand || '-'}\n`;
                message += `*Modelo:* ${contactForm.model || '-'}\n`;
                message += `*Año:* ${contactForm.year || '-'}\n`;
                message += `*Km:* ${contactForm.mileage || '-'}\n`;
            }
        }

        handleWhatsAppClick(message);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl p-8 relative scale-100 animate-scale-up border border-secondary/20">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-primary bg-light hover:bg-gray-200 rounded-full p-2 transition"><X size={20}/></button>
                
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-primary mb-2">
                        {mode === 'publish' ? 'Publicá tu Vehículo' : 'Hablemos'}
                    </h3>
                    <p className="text-gray-500">
                        {mode === 'publish' 
                            ? "Completa tus datos y nos pondremos en contacto."
                            : (vehicle ? `Consultar por ${vehicle.brand} ${vehicle.model}` : "Déjanos tus datos o contáctanos directamente por WhatsApp.")}
                    </p>
                </div>
                
                <div className="space-y-4">
                    {mode === 'publish' ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" name="name" value={contactForm.name} onChange={handleInputChange} placeholder="Nombre" className="w-full bg-light border border-gray-200 rounded-xl p-4 text-primary focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition" />
                                <input type="text" name="surname" value={contactForm.surname} onChange={handleInputChange} placeholder="Apellido" className="w-full bg-light border border-gray-200 rounded-xl p-4 text-primary focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition" />
                            </div>
                            <input type="tel" name="phone" value={contactForm.phone} onChange={handleInputChange} placeholder="Teléfono / WhatsApp" className="w-full bg-light border border-gray-200 rounded-xl p-4 text-primary focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition" />
                            <input type="text" name="dealership" value={contactForm.dealership} onChange={handleInputChange} placeholder="Concesionaria (Opcional)" className="w-full bg-light border border-gray-200 rounded-xl p-4 text-primary focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition" />
                            <input type="number" name="vehicleCount" value={contactForm.vehicleCount} onChange={handleInputChange} placeholder="Cantidad aprox. de vehículos" className="w-full bg-light border border-gray-200 rounded-xl p-4 text-primary focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition" />
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <input type="text" name="name" value={contactForm.name} onChange={handleInputChange} placeholder="Tu Nombre" className="w-full bg-light border border-gray-200 rounded-xl p-4 text-primary focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition" />
                                <input type="tel" name="phone" value={contactForm.phone} onChange={handleInputChange} placeholder="Tu Teléfono" className="w-full bg-light border border-gray-200 rounded-xl p-4 text-primary focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition" />
                                <textarea rows="3" name="message" value={contactForm.message} onChange={handleInputChange} placeholder="¿En qué podemos ayudarte?" className="w-full bg-light border border-gray-200 rounded-xl p-4 text-primary focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition resize-none"></textarea>
                            </div>
                            
                            <div className="flex items-center gap-3 py-2 px-1">
                                <input 
                                    type="checkbox" 
                                    id="trade-in" 
                                    checked={isTradeIn}
                                    onChange={(e) => setIsTradeIn(e.target.checked)}
                                    className="w-5 h-5 accent-accent rounded border-gray-300 cursor-pointer" 
                                />
                                <label htmlFor="trade-in" className="text-gray-600 cursor-pointer select-none font-medium">Tengo un vehículo para entregar</label>
                            </div>

                            {isTradeIn && (
                                <div className="grid grid-cols-2 gap-4 animate-fade-in bg-light p-4 rounded-xl border border-secondary/20">
                                    <input type="text" name="brand" value={contactForm.brand} onChange={handleInputChange} placeholder="Marca" className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition" />
                                    <input type="text" name="model" value={contactForm.model} onChange={handleInputChange} placeholder="Modelo" className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition" />
                                    <input type="number" name="year" value={contactForm.year} onChange={handleInputChange} placeholder="Año" className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition" />
                                    <input type="number" name="mileage" value={contactForm.mileage} onChange={handleInputChange} placeholder="Kilómetros" className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition" />
                                </div>
                            )}
                        </>
                    )}

                        <button onClick={submitContact} className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#20bd5a] transition shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
                        <MessageCircle size={22} /> Iniciar Chat por WhatsApp
                        </button>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
