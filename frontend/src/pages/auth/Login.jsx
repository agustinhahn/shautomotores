import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/admin'); // Redirect to dashboard/admin
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light text-dark">
      <div className="bg-surface p-8 rounded-3xl shadow-2xl shadow-primary/10 w-full max-w-md border border-secondary/20">
        <div className="text-center mb-8">
            <img src={logo} alt="SH Automotores" className="h-24 mx-auto mb-4 object-contain" />
        </div>
        <h3 className="text-2xl font-bold mb-6 text-center text-primary">Iniciar Sesión</h3>
        {error && <p className="text-red-500 mb-4 text-center text-sm font-medium">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-secondary text-sm font-bold mb-2 ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-light border border-secondary/30 focus:border-accent focus:ring-1 focus:ring-accent outline-none text-primary transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-secondary text-sm font-bold mb-2 ml-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-light border border-secondary/30 focus:border-accent focus:ring-1 focus:ring-accent outline-none text-primary transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent text-primary font-bold py-3.5 rounded-xl hover:bg-primary hover:text-white transition duration-300 shadow-lg shadow-accent/20"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
