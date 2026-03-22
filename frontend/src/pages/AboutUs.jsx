import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Target, Eye, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const AboutUs = () => {
    const clientsImages = [
        '/clientes/clientes1.webp',
        '/clientes/clientes2.webp',
        '/clientes/clientes3.webp',
        '/clientes/clientes4.webp',
        '/clientes/clientes5.webp',
        '/clientes/clientes6.webp',
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-scroll logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % clientsImages.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [clientsImages.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % clientsImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + clientsImages.length) % clientsImages.length);
    };

    return (
        <div className="min-h-screen bg-light text-dark font-sans selection:bg-accent selection:text-white pb-20">
            {/* Simple Navbar (Copy from Home or reuse if extracted) - For now, let's just make a simple header or reuse the Back button style from VehicleDetail to keep it focus on content, OR better: A proper consistency requires the main Navbar. 
               Since the user asked to add "Conócenos" to the MAIN Navbar, this page will likely be accessed FROM there.
               Replicating the Navbar here without extraction might be messy if it has state.
               Let's stick to a simple "Back to Home" header or similar for now, OR better, let's create a Layout component later.
               For this specific file, I'll add a simple header with Logo that links to home.
            */}
             <div className="bg-primary/95 backdrop-blur-md border-b border-primary/50 shadow-lg shadow-primary/20 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src={logo} alt="SH Automotores" className="h-14 w-auto object-contain transition-transform group-hover:scale-110" />
                    </Link>
                    <Link to="/" className="text-gray-300 hover:text-white font-medium transition">Volver al Inicio</Link>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative bg-primary py-24 px-4 text-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
                
                <h1 className="relative z-10 text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                    Sobre <span className="text-accent">Nosotros</span>
                </h1>
                <p className="relative z-10 text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
                    Compromiso, transparencia y la mejor atención para ayudarte a encontrar tu próximo vehículo.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
                {/* Information Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Mision */}
                     <div className="bg-surface p-8 rounded-3xl border border-secondary/20 shadow-xl shadow-primary/5 hover:border-accent/30 transition duration-300 group">
                        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Target className="text-accent w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary mb-4">Nuestra Misión</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Nuestra misión es ser el nexo estratégico definitivo entre las necesidades de movilidad y las mejores soluciones del mercado automotriz. Nos especializamos en captar, filtrar y derivar cada consulta hacia un asesoramiento experto y honesto, garantizando que el usuario reciba una respuesta inmediata y de calidad. Nos esforzamos por optimizar el proceso de compra, construyendo una red de confianza donde la tecnología y el factor humano se unen para facilitar el acceso a vehículos 0km y usados en todo el país.
                        </p>
                     </div>

                     {/* Vision */}
                     <div className="bg-surface p-8 rounded-3xl border border-secondary/20 shadow-xl shadow-primary/5 hover:border-accent/30 transition duration-300 group">
                        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Eye className="text-accent w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary mb-4">Nuestra Visión</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Nuestra visión es consolidarnos como la plataforma líder en generación y gestión de contactos del sector automotriz, donde nuestra labor principal es que cada consulta digital se transforme en una venta concreta. Queremos llevar este modelo de gestión más lejos, asegurando que cada cliente sea derivado con los mejores asesores comerciales para garantizar una experiencia altamente satisfactoria y referida. Apostamos a la eficiencia máxima: que ningún lead quede sin respuesta y que cada respuesta sea una oportunidad de negocio cerrada.
                        </p>
                     </div>
                </div>

                {/* Tu tiempo vale section */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-secondary/20 relative overflow-hidden group">
                     {/* Decorative elements */}
                     <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors duration-500"></div>
                     <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                     
                     <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-wider mb-6">
                            Tu tiempo vale
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-6">
                            Encontrá tu próximo vehículo <span className="text-accent relative inline-block">sin presiones.<span className="absolute bottom-0 left-0 w-full h-1 bg-accent/30 rounded-full"></span></span>
                        </h2>
                        
                        <div className="space-y-6 text-gray-700 leading-relaxed md:text-lg">
                            <p>
                                En <strong>SH Automotores</strong>, sabemos que comprar un vehículo es una de las decisiones más importantes de tu economía. Por eso, hemos creado un ecosistema digital diseñado para que vos tengas el control total, eliminando el estrés de recorrer concesionaria por concesionaria y la presión de vendedores que solo buscan cerrar una operación en el momento.
                            </p>
                            
                            <p>
                                Nuestra plataforma te ofrece la libertad de explorar, desde un solo lugar, la mayor variedad de marcas, modelos, sistemas de financiación y modalidades de entrega del mercado. Queremos que compares opciones de manera transparente y segura, sin distracciones y enfocándote únicamente en tu objetivo.
                            </p>
                            
                            <div className="mt-8 bg-surface p-6 rounded-2xl border border-gray-100">
                                <h3 className="text-xl font-bold text-primary mb-4 border-b border-gray-200 pb-2">¿Cuál es nuestra diferencia?</h3>
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <div className="min-w-6 text-accent font-bold mt-1">✓</div>
                                        <p><strong>Neutralidad:</strong> No te empujamos a una marca específica; te mostramos todas para que elijas la que realmente te apasiona.</p>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="min-w-6 text-accent font-bold mt-1">✓</div>
                                        <p><strong>Asesoría de Élite:</strong> Al consultar con nosotros, tu solicitud es derivada automáticamente al asesor mejor capacitado para esa marca y segmento, garantizando una experiencia de compra profesional y sin vueltas.</p>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="min-w-6 text-accent font-bold mt-1">✓</div>
                                        <p><strong>Eficiencia:</strong> Te ahorramos horas de traslados y charlas repetitivas, centralizando la mejor información financiera en un solo contacto.</p>
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="mt-8 p-6 bg-gradient-to-br from-primary to-primary-light text-white rounded-2xl shadow-lg text-center relative overflow-hidden">
                                <p className="relative z-10 text-lg md:text-xl font-light mb-4 text-gray-100">
                                    Nuestro propósito es simple: que cada persona que confía en nuestra red termine manejando el vehículo que siempre quiso, con la financiación que mejor le calza y la tranquilidad de haber sido asesorada por expertos.
                                </p>
                                <p className="relative z-10 text-2xl font-bold text-accent">
                                    Tu búsqueda termina acá. Tu decisión empieza ahora.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Clients Slider Section */}
                <div>
                    <div className="text-center mb-12">
                         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent font-bold text-sm uppercase tracking-wider mb-4">
                            <Users size={16} /> Comunidad
                         </div>
                         <h2 className="text-4xl font-extrabold text-primary">Nuestros Clientes</h2>
                         <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                            Ellos ya confiaron en nosotros. Sumate a la familia de SH Automotores.
                         </p>
                    </div>

                    <div className="relative max-w-5xl mx-auto">
                        <div className="overflow-hidden rounded-3xl shadow-2xl border border-secondary/20 aspect-[4/3] md:aspect-video bg-gray-100 relative group">
                            {/* Slides */}
                            <div 
                                className="flex transition-transform duration-700 ease-in-out h-full"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {clientsImages.map((src, index) => (
                                    <div key={index} className="min-w-full h-full relative">
                                        <img 
                                            src={src} 
                                            alt={`Cliente feliz ${index + 1}`} 
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Buttons */}
                            <button 
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/90 hover:text-primary transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button 
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/90 hover:text-primary transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                                <ChevronRight size={24} />
                            </button>

                            {/* Indicators */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                {clientsImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-accent w-8' : 'bg-white/50 hover:bg-white'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
