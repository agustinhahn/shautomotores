import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import vehicleService from '../../services/vehicleService';
import { Upload, X, ArrowLeft, Save, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const VehicleForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID if editing
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        currency: 'USD',
        mileage: '',
        condition: 'used',
        sale_type: 'direct',
        description: '',
        promotional_text: '',
        status: 'pending_approval'
    });

    const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';

    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [existingImages, setExistingImages] = useState([]); // For edit mode
    
    // Financing State
    const [showCalculator, setShowCalculator] = useState(false);
    const [financingParams, setFinancingParams] = useState({
        quota: 12,
        surcharge: 0 // 0 to 90
    });

    const [activePlans, setActivePlans] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchVehicleData();
        }
    }, [id]);

    const fetchVehicleData = async () => {
        try {
            const vehicle = await vehicleService.getVehicleById(id);
            setFormData({
                brand: vehicle.brand || '',
                model: vehicle.model || '',
                year: vehicle.year || new Date().getFullYear(),
                price: vehicle.price || '',
                currency: vehicle.currency || 'USD',
                mileage: vehicle.mileage || '',
                condition: vehicle.condition || 'used',
                sale_type: vehicle.sale_type || 'direct',
                description: vehicle.description || '',
                promotional_text: vehicle.promotional_text || '',
                status: vehicle.status || 'pending_approval'
            });
            
            if (vehicle.images) {
                setExistingImages(vehicle.images);
            }

            if (vehicle.pricing_details && vehicle.pricing_details.financing_plans) {
                setActivePlans(vehicle.pricing_details.financing_plans);
            }
        } catch (error) {
            console.error("Error fetching vehicle:", error);
            Swal.fire('Error', 'No se pudo cargar el vehículo para editar', 'error');
            navigate('/admin/vehicles');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);

        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => {
            URL.revokeObjectURL(prev[index]); 
            return prev.filter((_, i) => i !== index);
        });
    };

    // Financing Logic
    const calculatePlan = () => {
        const price = parseFloat(formData.price) || 0;
        if (price <= 0) return null;

        const quota = parseInt(financingParams.quota);
        const surcharge = parseInt(financingParams.surcharge);
        
        const downPayment = Math.round(price * 0.5); // 50% down payment base rule
        const remainder = price - downPayment;
        
        // Calculate total with surcharge
        const totalFinanced = remainder * (1 + (surcharge / 100));
        
        const installmentAmount = Math.round(totalFinanced / quota);

        return {
            quota,
            installment_amount: installmentAmount,
            down_payment: downPayment,
            total_financed: Math.round(totalFinanced), // Optional for debug
            surcharge_percentage: surcharge
        };
    };

    const addPlan = () => {
        const plan = calculatePlan();
        if (plan) {
            if (activePlans.some(p => p.quota === plan.quota)) {
                Swal.fire('Atención', 'Ya existe un plan con esta cantidad de cuotas.', 'warning');
                return;
            }
            setActivePlans([...activePlans, plan].sort((a,b) => a.quota - b.quota));
        }
    };

    const removePlan = (quota) => {
        setActivePlans(activePlans.filter(p => p.quota !== quota));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Create FormData object for file upload
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        // Append images
        images.forEach(image => {
            data.append('images', image);
    });

    // Append financing details
    // We send this as a generic 'pricing_details' JSON string. 
    // Backend should be set up to parse this.
    const pricingDetails = {
        financing_plans: activePlans
    };
    data.append('pricing_details', JSON.stringify(pricingDetails));

    try {
        if (isEditMode) {
            // Update
            // NOTE: If your backend supports FormData for PUT, this is fine. 
            // If it expects JSON for updates (common pattern in REST), we might need to change strategy.
            // As per previous context, let's assume valid handling or we might need to adjust user service.
            // If backend controller uses upload.array('images') middleware for PUT route, FormData is required.
            
            await vehicleService.updateVehicle(id, data); // Assuming service handles FormData correctly
            
            Swal.fire({
                title: '¡Actualizado!',
                text: 'Vehículo actualizado correctamente',
                icon: 'success',
                confirmButtonColor: '#EAB308'
            }).then(() => navigate('/admin/vehicles'));

        } else {
            // Create
            await vehicleService.createVehicle(data);
            Swal.fire({
                title: '¡Creado!',
                text: 'Vehículo creado correctamente',
                icon: 'success',
                confirmButtonColor: '#EAB308'
            }).then(() => navigate('/admin/vehicles'));
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire('Error', `Error al ${isEditMode ? 'actualizar' : 'crear'} el vehículo. Verifica los datos e intenta nuevamente.`, 'error');
    } finally {
        setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <button 
            onClick={() => navigate('/admin/vehicles')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
            <ArrowLeft size={20} />
            <span>Volver al listado</span>
        </button>

        <h2 className="text-3xl font-bold text-white mb-6">
            {isEditMode ? 'Editar Vehículo' : 'Nuevo Vehículo'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Section */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-6">
            <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Marca</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                  placeholder="Ej: Toyota"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Modelo</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                  placeholder="Ej: Corolla"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Año</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                  placeholder="Ej: 2020"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Kilometraje</label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                  placeholder="Ej: 50000"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-400 mb-2 text-sm">Condición</label>
                    <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                    >
                        <option value="new">Nuevo</option>
                        <option value="used">Usado</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-400 mb-2 text-sm">Tipo de Venta</label>
                    <select
                        name="sale_type"
                        value={formData.sale_type}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                    >
                        <option value="direct">Venta Directa</option>
                        <option value="financed">Financiado</option>
                        <option value="savings_plan">Plan de Ahorro</option>
                        <option value="consignment">Consignación</option>
                    </select>
                </div>
            </div>
            
             <div>
                <label className="block text-gray-400 mb-2 text-sm">Texto Promocional (Opcional)</label>
                <input
                  type="text"
                  name="promotional_text"
                  value={formData.promotional_text}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                  placeholder="Ej: ¡Oportunidad Única!"
                />
              </div>

            <div>
              <label className="block text-gray-400 mb-2 text-sm">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                placeholder="Detalles del vehículo..."
              ></textarea>
            </div>
          </div>

          {/* Pricing & Financing */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-6">
             <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Precio y Financiación</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                    <label className="block text-gray-400 mb-2 text-sm">Precio {formData.sale_type === 'financed' ? 'Final' : ''}</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                        <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                        placeholder="0.00"
                        required
                        />
                    </div>
                </div>
                 <div>
                    <label className="block text-gray-400 mb-2 text-sm">Moneda</label>
                    <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-accent outline-none"
                    >
                        <option value="USD">Dólares (USD)</option>
                        <option value="ARS">Pesos (ARS)</option>
                    </select>
                </div>
             </div>
            
             {/* Financing Calculator & List */}
             <div className="pt-4 border-t border-gray-700">
                 <div className="flex justify-between items-center mb-4">
                     <h4 className="text-lg font-semibold text-white">Planes de Financiación</h4>
                     <button 
                        type="button"
                        onClick={() => setShowCalculator(!showCalculator)}
                        className="text-accent text-sm hover:underline"
                     >
                         {showCalculator ? 'Ocultar Calculadora' : 'Mostrar Calculadora'}
                     </button>
                 </div>

                 {showCalculator && (
                     <div className="bg-gray-700/30 p-4 rounded-lg mb-6 border border-gray-600">
                         <h5 className="text-white text-sm font-bold mb-3">Agregar Plan Financiero</h5>
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                             <div>
                                 <label className="block text-xs text-gray-400 mb-1">Cuotas</label>
                                 <select 
                                    className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent"
                                    value={financingParams.quota}
                                    onChange={(e) => setFinancingParams({...financingParams, quota: parseInt(e.target.value)})}
                                 >
                                     {[12, 18, 24, 30, 36, 48, 60, 72, 84, 96].map(q => (
                                         <option key={q} value={q}>{q} Cuotas</option>
                                     ))}
                                 </select>
                             </div>
                             <div>
                                 <label className="block text-xs text-gray-400 mb-1">Recargo % (Interés)</label>
                                 <select 
                                    className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent"
                                    value={financingParams.surcharge}
                                    onChange={(e) => setFinancingParams({...financingParams, surcharge: parseInt(e.target.value)})}
                                 >
                                     {Array.from({length: 19}, (_, i) => i * 5).map(p => (
                                         <option key={p} value={p}>{p}%</option>
                                     ))}
                                 </select>
                             </div>
                             <button
                                type="button"
                                onClick={addPlan}
                                className="bg-accent text-primary font-bold py-2 px-4 rounded text-sm hover:bg-yellow-400 transition"
                             >
                                 Agregar Plan
                             </button>
                         </div>
                         {formData.price > 0 && (
                             <div className="mt-4 text-xs text-gray-400 bg-gray-800/50 p-2 rounded">
                                 <p>Simulación: {financingParams.quota} cuotas de <strong>{formData.currency} {calculatePlan()?.installment_amount.toLocaleString()}</strong></p>
                                 <p>Anticipo (50%): {formData.currency} {calculatePlan()?.down_payment.toLocaleString()} | Recargo: {financingParams.surcharge}%</p>
                             </div>
                         )}
                     </div>
                 )}

                 {activePlans.length === 0 ? (
                     <p className="text-gray-500 text-sm italic">No hay planes de financiación activos.</p>
                 ) : (
                     <div className="space-y-2">
                         {activePlans.map((plan, index) => (
                             <div key={index} className="flex justify-between items-center bg-gray-700/50 p-3 rounded border border-gray-600">
                                 <div>
                                     <p className="text-white text-sm font-bold">
                                         {plan.quota} cuotas de {formData.currency} {Number(plan.installment_amount).toLocaleString()}
                                     </p>
                                     <p className="text-xs text-gray-400">
                                         Anticipo:  {formData.currency} {Number(plan.down_payment).toLocaleString()}
                                         {plan.surcharge_percentage > 0 && ` | +${plan.surcharge_percentage}% Recargo`}
                                     </p>
                                 </div>
                                 <button 
                                    type="button" 
                                    onClick={() => removePlan(plan.quota)}
                                    className="text-red-400 hover:text-red-300 p-1"
                                 >
                                     <Trash2 size={16} />
                                 </button>
                             </div>
                         ))}
                     </div>
                 )}
             </div>
          </div>

          {/* Images Section */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-6">
            <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Imágenes</h3>
            
            {isEditMode && existingImages.length > 0 && (
                 <div className="mb-6">
                     <h4 className="text-sm text-gray-400 mb-3">Imágenes Actuales</h4>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {existingImages.map((img, idx) => (
                             <div key={img.id || idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-600 group">
                                <img src={`${API_BASE}${img.url}`} alt="Vehículo" className="w-full h-full object-cover" />
                             </div>
                        ))}
                     </div>
                     <p className="text-xs text-gray-500 mt-2">* Para eliminar imágenes existentes, utiliza el botón "Eliminar" en el listado principal.</p>
                 </div>
            )}

            <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-accent transition-colors cursor-pointer relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-300">Arrastra imágenes o haz clic para subir</p>
              <p className="text-gray-500 text-sm mt-1">Soporta JPG, PNG</p>
            </div>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-gray-600 group">
                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-accent text-primary font-bold py-4 rounded-xl hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20 disabled:opacity-50"
            >
              <Save size={20} />
              {isEditMode ? 'Actualizar Vehículo' : 'Crear Vehículo'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/vehicles')}
              className="px-6 border border-gray-600 text-gray-300 font-bold rounded-xl hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default VehicleForm;
