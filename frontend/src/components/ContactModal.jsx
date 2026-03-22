import { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ContactModal = ({ isOpen, onClose, vehicle = null, defaultMessage = '', mode = 'consult' }) => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const [isTradeIn, setIsTradeIn] = useState(false);
    const [contactForm, setContactForm] = useState({
        name: '',
        surname: '',
        dni: '',
        age: '',
        civilStatus: '',
        employment: '',
        city: '',
        preferredTime: '',
        hasCapital: false,
        phone: '',
        dealership: '',
        vehicleCount: '',
        message: defaultMessage,
        brand: '',
        model: '',
        year: '',
        mileage: '',
        tradeInDetails: ''
    });

    const timeSlots = [];
    for (let i = 7; i <= 21; i++) {
        timeSlots.push(`${i}:00 a ${i}:30`);
        timeSlots.push(`${i}:30 a ${i+1}:00`);
    }

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
        const { name, value, type, checked } = e.target;
        setContactForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleWhatsAppClick = (phone, message) => {
        const text = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    };

    const submitContact = async () => {
        // Determine Target Phone
        let targetPhone = "5493415810277"; // Admin default
        
        if (vehicle && vehicle.seller && vehicle.seller.role !== 'super_admin' && vehicle.seller.phone) {
            // Clean up the phone string to ensure it has only numbers
            let cleanPhone = vehicle.seller.phone.replace(/\D/g, '');
            // Simple logic: if user entered a local number without 549, prepend it
            if (!cleanPhone.startsWith('549') && cleanPhone.length >= 10) {
                cleanPhone = `549${cleanPhone}`;
            }
            targetPhone = cleanPhone;
        }

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
            if (contactForm.dni) message += `*DNI:* ${contactForm.dni}\n`;
            if (contactForm.age) message += `*Edad:* ${contactForm.age}\n`;
            if (contactForm.civilStatus) message += `*Estado Civil:* ${contactForm.civilStatus}\n`;
            if (contactForm.employment) message += `*Situación:* ${contactForm.employment}\n`;
            if (contactForm.city) message += `*Ciudad:* ${contactForm.city}\n`;
            if (contactForm.phone) message += `*Teléfono:* ${contactForm.phone}\n`;
            if (contactForm.preferredTime) message += `*Horario de contacto:* ${contactForm.preferredTime}\n`;
            message += `*Cuenta con capital:* ${contactForm.hasCapital ? 'Sí' : 'No'}\n\n`;
            
            message += `*Mensaje:*\n${contactForm.message || "Hola, quería hacer una consulta."}\n`;
            
            if (isTradeIn) {
                message += `\n*Vehículo a Entregar:*\n`;
                message += `*Marca:* ${contactForm.brand || '-'}\n`;
                message += `*Modelo:* ${contactForm.model || '-'}\n`;
                message += `*Año:* ${contactForm.year || '-'}\n`;
                message += `*Km:* ${contactForm.mileage || '-'}\n`;
                if (contactForm.tradeInDetails) message += `*Detalles:* ${contactForm.tradeInDetails}\n`;
            }
        }

        // Fire off email proxy event asynchronously. Unblocks UI.
        try {
            await axios.post(`${API_BASE}/leads`, { 
                message: message,
                vehicleId: vehicle ? vehicle.id : null,
                sellerId: vehicle && vehicle.seller ? vehicle.seller.id : null,
                name: contactForm.name || "Cliente Web",
                phone: contactForm.phone || ""
            });
        } catch (error) {
            console.error('Failed to register lead on backend', error);
            // We ignore frontend crash since WhatsApp is the main goal.
        }

        handleWhatsAppClick(targetPhone, message);
        onClose();
        
        // Optional quick success alert
        if (mode === 'publish') {
            Swal.fire({
                title: '¡Solicitud Iniciada!',
                text: 'Te redirigiremos a WhatsApp para finalizar con un asesor.',
                icon: 'success',
                confirmButtonColor: '#C0A080'
            });
        }
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
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1 pb-4 scrollbar-hide">
                                <input type="text" name="name" value={contactForm.name} onChange={handleInputChange} placeholder="Nombre Completo" className="w-full bg-light border border-gray-200 rounded-xl p-3 text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition" />
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" name="dni" value={contactForm.dni} onChange={handleInputChange} placeholder="DNI" className="w-full bg-light border border-gray-200 rounded-xl p-3 text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition" />
                                    <input type="number" name="age" value={contactForm.age} onChange={handleInputChange} placeholder="Edad" className="w-full bg-light border border-gray-200 rounded-xl p-3 text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition" />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <select name="civilStatus" value={contactForm.civilStatus} onChange={handleInputChange} className="w-full bg-light border border-gray-200 rounded-xl p-3 text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition">
                                        <option value="">Estado Civil</option>
                                        <option value="Soltero">Soltero/a</option>
                                        <option value="Casado">Casado/a</option>
                                        <option value="Divorciado">Divorciado/a</option>
                                    </select>
                                    <select name="employment" value={contactForm.employment} onChange={handleInputChange} className="w-full bg-light border border-gray-200 rounded-xl p-3 text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition">
                                        <option value="">Situación Laboral</option>
                                        <option value="Monotributista">Monotributista</option>
                                        <option value="Relación de dependencia">Relación de dependencia</option>
                                        <option value="Recibo de sueldo garante">Recibo de sueldo garante</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" name="city" value={contactForm.city} onChange={handleInputChange} placeholder="Ciudad" className="w-full bg-light border border-gray-200 rounded-xl p-3 text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition" />
                                    <input type="tel" name="phone" value={contactForm.phone} onChange={handleInputChange} placeholder="Teléfono" className="w-full bg-light border border-gray-200 rounded-xl p-3 text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition" />
                                </div>

                                <select name="preferredTime" value={contactForm.preferredTime} onChange={handleInputChange} className="w-full bg-light border border-gray-200 rounded-xl p-3 text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition">
                                    <option value="">Horario preferente de contacto</option>
                                    {timeSlots.map(slot => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>

                                <div className="flex items-center gap-3 py-1">
                                    <input 
                                        type="checkbox" 
                                        name="hasCapital"
                                        id="has-capital" 
                                        checked={contactForm.hasCapital}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 accent-accent rounded border-gray-300 cursor-pointer" 
                                    />
                                    <label htmlFor="has-capital" className="text-gray-600 text-sm cursor-pointer select-none font-medium">Cuento con capital</label>
                                </div>

                                <textarea rows="2" name="message" value={contactForm.message} onChange={handleInputChange} placeholder="¿En qué podemos ayudarte?" className="w-full bg-light border border-gray-200 rounded-xl p-3 text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition resize-none"></textarea>
                            
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
                                <div className="grid grid-cols-2 gap-3 animate-fade-in bg-light p-4 rounded-xl border border-secondary/20">
                                    <input type="text" name="brand" value={contactForm.brand} onChange={handleInputChange} placeholder="Marca" className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition" />
                                    <input type="text" name="model" value={contactForm.model} onChange={handleInputChange} placeholder="Modelo" className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition" />
                                    <input type="number" name="year" value={contactForm.year} onChange={handleInputChange} placeholder="Año" className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition" />
                                    <input type="number" name="mileage" value={contactForm.mileage} onChange={handleInputChange} placeholder="Kilómetros" className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition" />
                                    <textarea name="tradeInDetails" value={contactForm.tradeInDetails} onChange={handleInputChange} placeholder="Detalles que me gustaría aclarar (por ej. reparaciones necesarias)" className="w-full col-span-2 bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition resize-none" rows="2"></textarea>
                                </div>
                            )}

                            </div>
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
