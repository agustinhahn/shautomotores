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
                            Brindar soluciones de movilidad confiables y accesibles, priorizando la satisfacción del cliente a través de un asesoramiento honesto y transparente. Nos esforzamos por construir relaciones duraderas basadas en la confianza y la calidad de nuestros servicios.
                        </p>
                     </div>

                     {/* Vision */}
                     <div className="bg-surface p-8 rounded-3xl border border-secondary/20 shadow-xl shadow-primary/5 hover:border-accent/30 transition duration-300 group">
                        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Eye className="text-accent w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary mb-4">Nuestra Visión</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Ser la concesionaria referente en la región, reconocida por nuestra integridad, innovación y excelencia en la atención. Aspiramos a liderar el mercado ofreciendo una experiencia de compra única y adaptada a las necesidades de cada cliente.
                        </p>
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
