import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

interface AuthProps {
  onAuthSuccess: (user: { firstName: string; lastName: string; email: string; photo?: string }) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    photo: '' as string | undefined,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const saved = localStorage.getItem('nutrimind_users');
      if (!saved) {
        setError('No existe ningún usuario registrado con ese email.');
        setLoading(false);
        return;
      }
      const users = JSON.parse(saved);
      const user = users.find((u: any) => u.email === loginEmail && u.password === loginPassword);
      if (user) {
        onAuthSuccess(user);
      } else {
        setError('Email o contraseña incorrectos.');
      }
      setLoading(false);
    }, 500);
  };

  // Handle register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!registerData.firstName || !registerData.lastName || !registerData.email || !registerData.password) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Obtener usuarios existentes
      const saved = localStorage.getItem('nutrimind_users');
      const users = saved ? JSON.parse(saved) : [];
      
      // Verificar si el email ya está registrado
      if (users.some((u: any) => u.email === registerData.email)) {
        setError('Este email ya está registrado.');
        setLoading(false);
        return;
      }

      // Guardar usuario registrado sin foto
      const userToSave = { ...registerData };
      delete userToSave.photo;
      users.push(userToSave);
      localStorage.setItem('nutrimind_users', JSON.stringify(users));
      
      setLoading(false);
      setRegistered(true);
      setTimeout(() => {
        setRegistered(false);
        setTab('login');
      }, 1500);
    }, 700);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-100 to-red-300 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in border-t-8 border-red-600 relative">
        <h1 className="text-4xl font-extrabold text-red-700 text-center mb-8 tracking-tight drop-shadow">NutriMind</h1>
        <div className="flex justify-center mb-8 gap-4">
          <button
            className={`px-6 py-2 rounded-t-lg font-bold text-lg transition-all duration-200 ${tab === 'login' ? 'bg-red-600 text-white' : 'bg-gray-100 text-red-700 hover:bg-red-200'}`}
            onClick={() => setTab('login')}
          >
            Iniciar sesión
          </button>
          <button
            className={`px-6 py-2 rounded-t-lg font-bold text-lg transition-all duration-200 ${tab === 'register' ? 'bg-red-600 text-white' : 'bg-gray-100 text-red-700 hover:bg-red-200'}`}
            onClick={() => setTab('register')}
          >
            Registrarse
          </button>
        </div>
        {registered && (
          <div className="bg-green-100 text-green-800 rounded-lg px-4 py-3 mb-4 text-center font-semibold animate-fade-in">
            ¡Registro exitoso! Ahora puedes iniciar sesión.
          </div>
        )}
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-lg">
                {FaEnvelope({})}
              </div>
              <input
                type="email"
                className="border rounded-lg p-3 pl-10 w-full focus:ring-2 focus:ring-red-400"
                placeholder="Email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-lg">
                {FaLock({})}
              </div>
              <input
                type="password"
                className="border rounded-lg p-3 pl-10 w-full focus:ring-2 focus:ring-red-400"
                placeholder="Contraseña"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-600 text-center text-sm">{error}</div>}
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow transition-all duration-200 mt-2 text-lg"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-lg">
                {FaUser({})}
              </div>
              <input
                type="text"
                className="border rounded-lg p-3 pl-10 w-full focus:ring-2 focus:ring-red-400"
                placeholder="Nombre"
                value={registerData.firstName}
                onChange={e => setRegisterData(d => ({ ...d, firstName: e.target.value }))}
                required
              />
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-lg">
                {FaUser({})}
              </div>
              <input
                type="text"
                className="border rounded-lg p-3 pl-10 w-full focus:ring-2 focus:ring-red-400"
                placeholder="Apellidos"
                value={registerData.lastName}
                onChange={e => setRegisterData(d => ({ ...d, lastName: e.target.value }))}
                required
              />
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-lg">
                {FaEnvelope({})}
              </div>
              <input
                type="email"
                className="border rounded-lg p-3 pl-10 w-full focus:ring-2 focus:ring-red-400"
                placeholder="Email"
                value={registerData.email}
                onChange={e => setRegisterData(d => ({ ...d, email: e.target.value }))}
                required
              />
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-lg">
                {FaLock({})}
              </div>
              <input
                type="password"
                className="border rounded-lg p-3 pl-10 w-full focus:ring-2 focus:ring-red-400"
                placeholder="Contraseña"
                value={registerData.password}
                onChange={e => setRegisterData(d => ({ ...d, password: e.target.value }))}
                required
              />
            </div>
            {error && <div className="text-red-600 text-center text-sm">{error}</div>}
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow transition-all duration-200 mt-2 text-lg"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth; 