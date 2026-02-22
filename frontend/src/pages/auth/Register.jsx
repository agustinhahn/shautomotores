import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        role: 'seller' // Default
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await register(formData);
        if (result.success) {
            navigate('/admin');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light text-dark">
            <div className="bg-surface p-8 rounded-3xl shadow-2xl shadow-primary/10 w-full max-w-md border border-secondary/20">
                <h2 className="text-3xl font-extrabold mb-2 text-center text-primary tracking-tight">SH AUTOMOTORES</h2>
                <h3 className="text-lg font-medium mb-8 text-center text-secondary">Registro de Vendedor</h3>
                {error && <p className="text-red-500 mb-4 text-center text-sm font-medium">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-secondary text-sm font-bold mb-2 ml-1">Nombre Completo</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl bg-light border border-secondary/30 focus:border-accent focus:ring-1 focus:ring-accent outline-none text-primary transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-secondary text-sm font-bold mb-2 ml-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl bg-light border border-secondary/30 focus:border-accent focus:ring-1 focus:ring-accent outline-none text-primary transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-secondary text-sm font-bold mb-2 ml-1">Teléfono</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl bg-light border border-secondary/30 focus:border-accent focus:ring-1 focus:ring-accent outline-none text-primary transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-secondary text-sm font-bold mb-2 ml-1">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl bg-light border border-secondary/30 focus:border-accent focus:ring-1 focus:ring-accent outline-none text-primary transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-accent text-primary font-bold py-3.5 rounded-xl hover:bg-primary hover:text-white transition duration-300 shadow-lg shadow-accent/20"
                    >
                        Registrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
