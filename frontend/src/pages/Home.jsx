
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import { Car, Search, Menu, X, ChevronRight } from 'lucide-react';
import logo from '../assets/logo.png';
import ContactModal from '../components/ContactModal';
import JoinTeamModal from '../components/JoinTeamModal';

const Home = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, direct, financed, savings, used
    const [searchFilters, setSearchFilters] = useState({
        brand: '',
        model: '',
        yearFrom: ''
    });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showJoinTeamModal, setShowJoinTeamModal] = useState(false);
    const [contactMode, setContactMode] = useState('consult');
    const [isScrolled, setIsScrolled] = useState(false);
    
    // Base URL for Images (fallback to localhost for local dev if env not set)
    const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';
    
    useEffect(() => {
        fetchVehicles();
    }, [filter]); // fetch on tab change

    // Handle Navbar scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchVehicles();
    };

    const handleFilterChange = (e) => {
        setSearchFilters({
            ...searchFilters,
            [e.target.name]: e.target.value
        });
    };

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const params = { status: 'published' };
            
            // Tab Filters
            if (filter === 'direct') params.sale_type = 'direct';
            
            // Search Filters
            if (searchFilters.brand) params.brand = searchFilters.brand;
            if (searchFilters.model) params.model = searchFilters.model;
            if (searchFilters.yearFrom) params.yearFrom = searchFilters.yearFrom;

            const allPublished = await vehicleService.getAllVehicles(params);
            
            let filtered = Array.isArray(allPublished) ? allPublished : [];

            // Client-side filtering for complex types not handled by backend query yet (optional)
            if (filter === 'savings') {
                filtered = filtered.filter(v => v.sale_type && v.sale_type.startsWith('savings'));
            } else if (filter === 'used') {
                filtered = filtered.filter(v => v.condition === 'used');
            }

            setVehicles(filtered);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppClick = (message) => {
        const phone = "5493415810277"; // Replace with actual number
        const text = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    };

    const formatSaleType = (type) => {
        const types = {
            'direct': 'Venta Directa',
            'savings_plan': 'Plan de Ahorro',
            'consignment': 'Consignación'
        };
        return types[type] || type;
    };

    return (
        <div className="min-h-screen bg-light text-dark font-sans selection:bg-accent selection:text-white">
            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-primary/95 backdrop-blur-md border-b border-primary/50 shadow-lg shadow-primary/20 py-0' : 'bg-transparent border-transparent py-2'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link to="/" className="flex items-center gap-2 group">
                             {/* Logo */}
                            <img src={logo} alt="SH Automotores" className="h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md" />
                        </Link>
                        
                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button onClick={() => setFilter('all')} className={`${filter === 'all' ? 'text-accent font-bold' : 'text-gray-200'} hover:text-accent hover:scale-105 cursor-pointer transition-all duration-300 capitalize drop-shadow-sm`}>Inicio</button>
                            <button onClick={() => setFilter('savings')} className={`${filter === 'savings' ? 'text-accent font-bold' : 'text-gray-200'} hover:text-accent hover:scale-105 cursor-pointer transition-all duration-300 capitalize drop-shadow-sm`}>Planes de Ahorro</button>
                            <button onClick={() => setFilter('direct')} className={`${filter === 'direct' ? 'text-accent font-bold' : 'text-gray-200'} hover:text-accent hover:scale-105 cursor-pointer transition-all duration-300 capitalize drop-shadow-sm`}>Venta Directa</button>
                            <Link to="/conocenos" className="text-gray-200 hover:text-accent hover:scale-105 cursor-pointer transition-all duration-300 font-medium drop-shadow-sm">Conócenos</Link>
                            <button onClick={() => setShowJoinTeamModal(true)} className={`px-6 py-2.5 rounded-full font-bold cursor-pointer transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 ${isScrolled ? 'bg-accent text-primary hover:bg-white' : 'bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-accent hover:text-primary hover:border-transparent'}`}>
                                Unite al equipo
                            </button>
                            <Link to="/login" className="text-gray-300 hover:text-accent hover:scale-105 cursor-pointer text-sm font-medium drop-shadow-sm transition-all duration-300">Ingresar</Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2 hover:bg-white/10 rounded-lg transition drop-shadow-md">
                                {isMenuOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-primary/95 backdrop-blur-xl border-t border-white/10 shadow-xl absolute w-full">
                         <div className="px-4 pt-4 pb-6 space-y-2">
                            <button onClick={() => {setFilter('all'); setIsMenuOpen(false)}} className="block w-full text-left px-4 py-3 rounded-lg hover:bg-accent/10 hover:text-accent cursor-pointer text-gray-200 font-medium transition-colors">Inicio</button>
                            <Link to="/conocenos" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-4 py-3 rounded-lg hover:bg-accent/10 hover:text-accent cursor-pointer text-gray-200 font-medium transition-colors">Conócenos</Link>
                            <button onClick={() => {setFilter('savings'); setIsMenuOpen(false)}} className="block w-full text-left px-4 py-3 rounded-lg hover:bg-accent/10 hover:text-accent cursor-pointer text-gray-200 font-medium transition-colors">Planes de Ahorro</button>
                            <button onClick={() => {setFilter('direct'); setIsMenuOpen(false)}} className="block w-full text-left px-4 py-3 rounded-lg hover:bg-accent/10 hover:text-accent cursor-pointer text-gray-200 font-medium transition-colors">Venta Directa</button>
                            <button onClick={() => { setShowJoinTeamModal(true); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-lg cursor-pointer bg-accent text-primary hover:bg-white font-bold mt-4 shadow-lg transition-colors">Unite al equipo</button>
                         </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-32 px-4 text-center overflow-hidden min-h-[85vh] flex items-center justify-center">
                {/* Video Background */}
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    poster="https://static.comparaencasa.com/pt/images/2021/4/22/fiat-cronos-exterior_original_930x620_n.jpg"
                    className="absolute inset-0 w-full h-full object-cover z-0 opacity-90"
                >
                    <source src="/videobanner.mp4" type="video/mp4" />
                    Tu navegador no soporta el tag de video.
                </video>

                {/* Subtle Gradient Overlay - Reduced opacity for better video visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-primary/30 to-primary/80 z-0"></div>

                {/* Decorative gradients */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] z-0 pointer-events-none"></div>

                {/* Hero Content text-dark removed, explicit white used for optimal contrast */}
                <div className="max-w-4xl mx-auto relative z-10 w-full mt-10">
                    <span className="inline-block py-1.5 px-6 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-bold mb-8 tracking-widest uppercase border border-white/20 shadow-lg animate-fade-in-up">
                        Exclusividad y Confianza
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight text-white leading-tight drop-shadow-2xl animate-fade-in-up animation-delay-100">
                        Tu próximo auto <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-yellow-100 to-accent bg-300% animate-gradient filter drop-shadow">
                            te espera aquí.
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-100 mb-12 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-xl animate-fade-in-up animation-delay-200">
                        La forma más rápida y transparente de comprar, vender o financiar tu vehículo.
                        Asesoramiento de nivel experto.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-6 animate-fade-in-up animation-delay-300">
                        <button onClick={() => { window.scrollTo({ top: document.getElementById('search-bar')?.offsetTop - 80 || 700, behavior: 'smooth' }) }} className="bg-accent text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 shadow-xl shadow-accent/20 hover:shadow-accent/40 transform hover:-translate-y-1 flex items-center justify-center gap-2 group">
                            Ver Catálogo <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform"/>
                        </button>
                        <button onClick={() => { setContactMode('consult'); setShowContactModal(true); }} className="bg-white/10 text-white border border-white/30 backdrop-blur-md px-10 py-4 rounded-full font-bold text-lg hover:bg-accent hover:text-primary hover:border-transparent transition-all duration-300 shadow-lg transform hover:-translate-y-1">
                            Contactanos
                        </button>
                    </div>
                </div>
            </div>

            {/* Anchors para la Búsqueda */}
            <div id="search-bar" className="relative z-30 -mt-8 mb-12 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Marca</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={20} />
                                <input 
                                    type="text" 
                                    name="brand"
                                    placeholder="Ej. Toyota" 
                                    value={searchFilters.brand}
                                    onChange={handleFilterChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Modelo</label>
                            <input 
                                type="text" 
                                name="model"
                                placeholder="Ej. Corolla" 
                                value={searchFilters.model}
                                onChange={handleFilterChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-gray-400"
                            />
                        </div>
                        <div className="w-full md:w-32">
                            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Año Desde</label>
                            <input 
                                type="number" 
                                name="yearFrom"
                                placeholder="2015" 
                                value={searchFilters.yearFrom}
                                onChange={handleFilterChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-gray-400"
                            />
                        </div>
                        <div className="flex items-end">
                            <button 
                                type="submit"
                                className="w-full md:w-auto bg-accent text-primary font-bold py-3 px-8 rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Search size={20} />
                                <span>Buscar</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="sticky top-20 z-40 bg-light/95 backdrop-blur-md border-y border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex overflow-x-auto gap-3 scrollbar-hide no-scrollbar">
                    {[
                        { id: 'all', label: 'Todos' },
                        { id: 'direct', label: 'Venta Directa' },
                        { id: 'savings', label: 'Planes de Ahorro' },
                        { id: 'used', label: 'Usados' }
                    ].map((f) => (
                        <button 
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`whitespace-nowrap px-6 py-2.5 rounded-full cursor-pointer text-sm font-bold transition-all duration-300 ${
                                filter === f.id 
                                ? 'bg-primary text-white shadow-lg shadow-primary/25 transform -translate-y-0.5' 
                                : 'bg-white text-gray-500 border border-secondary/30 hover:border-accent hover:text-primary hover:scale-105'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Vehicle Grid */}
            <div className="max-w-7xl mx-auto px-4 py-16 min-h-[50vh]">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto mb-6"></div>
                        <p className="text-gray-500 font-medium">Cargando vehículos...</p>
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="text-center py-24 bg-surface rounded-3xl border border-secondary/20 shadow-sm">
                        <div className="bg-light w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search size={32} className="text-secondary" />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">No se encontraron vehículos</h3>
                        <p className="text-gray-500">Intenta cambiar los filtros de búsqueda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vehicles.map((vehicle) => (
                            <div key={vehicle.id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-accent/40 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 relative flex flex-col h-full">
                                {/* Decorator line */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>

                                {/* Image Section */}
                                <div className="h-64 overflow-hidden relative bg-gray-100">
                                    {vehicle.promotional_text && (
                                        <div className="absolute top-4 left-4 z-10 bg-primary/95 backdrop-blur-md text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-white/10 transform -rotate-1">
                                            {vehicle.promotional_text}
                                        </div>
                                    )}
                                    {vehicle.sale_type && (
                                        <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-md text-primary text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wide border border-gray-100">
                                            {formatSaleType(vehicle.sale_type)}
                                        </div>
                                    )}
                                    {vehicle.images && vehicle.images.length > 0 ? (
                                        <img 
                                            src={`${API_BASE}${vehicle.images[0].url}`} 
                                            alt={vehicle.model} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Car className="text-gray-300 w-16 h-16" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                                </div>

                                {/* Details Section */}
                                <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-white to-gray-50 relative z-10 -mt-6 rounded-t-3xl shadow-[0_-15px_20px_-10px_rgba(0,0,0,0.05)] border-t border-gray-100">
                                    <div className="mb-4">
                                        <h3 className="text-2xl font-black text-primary leading-none tracking-tight mb-3">
                                            {vehicle.brand} <span className="text-accent">{vehicle.model}</span>
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 font-bold mb-4">
                                            <span className="bg-white px-2.5 py-1 rounded-md border border-gray-100 shadow-sm">{vehicle.year}</span>
                                            <span className="bg-white px-2.5 py-1 rounded-md border border-gray-100 shadow-sm">{Number(vehicle.mileage).toLocaleString()} km</span>
                                            <span className="bg-white px-2.5 py-1 rounded-md border border-gray-100 shadow-sm capitalize">{vehicle.condition === 'new' ? 'Nuevo' : 'Usado'}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col mt-auto pt-4 border-t border-gray-200/50 mb-6">
                                        <p className="text-[11px] text-secondary uppercase tracking-widest font-black mb-1">Precio Contado</p>
                                        <p className="text-3xl font-extrabold text-primary font-mono tracking-tighter group-hover:text-accent transition-colors duration-300">
                                            <span className="text-gray-400 text-xl font-medium">{vehicle.currency} </span>{Number(vehicle.price).toLocaleString()}
                                        </p>
                                    </div>
                                    
                                    <Link to={`/vehicles/${vehicle.id}`} className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-accent hover:text-primary hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 flex items-center justify-center gap-2 group/btn relative overflow-hidden">
                                        <span className="relative z-10 flex items-center gap-2">Ver Detalles <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform"/></span>
                                        <div className="absolute inset-0 h-full w-full border-t-[2px] border-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-500"></div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-dark border-t border-white/5 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <img src={logo} alt="SH Automotores" className="h-32 w-auto object-contain mx-auto mb-6" />
                    <p className="text-secondary text-sm mb-3">© 2026 SH Automotores. Todos los derechos reservados.</p>
                    <p className="text-secondary text-sm">
                        Desarrollado por: {' '}
                        <a 
                            href="https://portfolio-ten-tan-61.vercel.app/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="font-bold text-accent hover:text-yellow-100 hover:scale-105 cursor-pointer transition-all duration-300 inline-block drop-shadow-md"
                        >
                            Agustin Hahn
                        </a>
                    </p>
                </div>
            </footer>

            <ContactModal 
                isOpen={showContactModal} 
                onClose={() => setShowContactModal(false)} 
                mode={contactMode}
            />

            <JoinTeamModal 
                isOpen={showJoinTeamModal}
                onClose={() => setShowJoinTeamModal(false)}
            />
        </div>
    );
};

export default Home;
