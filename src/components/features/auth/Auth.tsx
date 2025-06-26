import React, { useState, useRef, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

interface AuthProps {
  onAuthSuccess?: (isInvitado?: boolean) => void;
}

// Función utilitaria para guardar usuario en Firestore
async function saveUserToFirestore(user: any, extraData: any = {}) {
  if (!user) return;
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email || '',
      firstName: user.displayName || extraData.firstName || '',
      lastName: extraData.lastName || '',
      photo: user.photoURL || '',
      createdAt: new Date().toISOString(),
    });
  }
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const auth = getAuth();
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await saveUserToFirestore(userCredential.user);
        setMessage('¡Sesión iniciada correctamente!');
        if (onAuthSuccess) onAuthSuccess();
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await saveUserToFirestore(userCredential.user, { firstName, lastName });
        setMessage('¡Cuenta creada correctamente!');
        setIsLogin(true);
        if (onAuthSuccess) onAuthSuccess();
      }
    } catch (err: any) {
      setError('Error: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Por favor, ingresa tu correo electrónico.');
      return;
    }
    
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setMessage('¡Email de recuperación enviado! Revisa tu bandeja de entrada y carpeta de spam. Si no lo encuentras, espera unos minutos y revisa nuevamente.');
      setShowForgotPassword(false);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No existe una cuenta con este correo electrónico.');
      } else if (err.code === 'auth/invalid-email') {
        setError('El correo electrónico no es válido.');
      } else {
        setError('Error al enviar el email de recuperación. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user);
      setMessage('¡Sesión iniciada con Google!');
      if (onAuthSuccess) onAuthSuccess();
    } catch (err) {
      setError('No se pudo iniciar sesión con Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    if (onAuthSuccess) onAuthSuccess(true);
  };

  const resetForm = () => {
    setShowForgotPassword(false);
    setError('');
    setMessage('');
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  // Si estamos en modo recuperación de contraseña
  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
        <img
          src="/logo-header.png"
          alt="EGN Logo"
          className="block mx-auto w-full max-w-[340px] h-auto mb-0 mt-[-120px] sm:hidden"
        />
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 flex flex-col items-center mt-[-48px] sm:mt-0">
          <h1 className="text-3xl font-extrabold text-red-700 mb-6 text-center">
            Recuperar Contraseña
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>💡 Consejo:</strong> Si no recibes el email, revisa tu carpeta de spam y asegúrate de que el correo esté correctamente escrito.
            </p>
          </div>
          <form className="w-full space-y-6" onSubmit={handleForgotPassword}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full bg-[#f9fafb] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-3 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all shadow-sm"
              ref={emailRef}
            />
            {message && <div className="text-green-600 dark:text-green-400 text-center font-medium w-full">{message}</div>}
            {error && <div className="text-red-600 dark:text-red-400 text-center font-medium w-full">{error}</div>}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-2xl shadow-lg transition-all duration-300 text-lg mt-2 disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Email de Recuperación'}
            </button>
          </form>
          <button
            onClick={resetForm}
            className="w-full text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium py-2 transition-colors"
          >
            ← Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      {/* Logo grande arriba, solo fuera del card */}
      <img
        src="/logo-header.png"
        alt="EGN Logo"
        className="block mx-auto w-full max-w-[340px] h-auto mb-0 mt-[-120px] sm:hidden"
      />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 flex flex-col items-center mt-[-48px] sm:mt-0">
        <h1 className="text-3xl font-extrabold text-red-700 mb-6 text-center">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h1>
        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="Nombre"
                className="w-full bg-[#f9fafb] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-3 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all shadow-sm"
              />
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Apellido"
                className="w-full bg-[#f9fafb] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-3 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all shadow-sm"
              />
            </>
          )}
          <input
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="w-full bg-[#f9fafb] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-3 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all shadow-sm"
            ref={emailRef}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full bg-[#f9fafb] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-3 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all shadow-sm"
          />
          {isLogin && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors mx-auto"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}
          {message && <div className="text-green-600 dark:text-green-400 text-center font-medium w-full">{message}</div>}
          {error && <div className="text-red-600 dark:text-red-400 text-center font-medium w-full">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-2xl shadow-lg transition-all duration-300 text-lg mt-2 disabled:bg-red-400 disabled:cursor-not-allowed">
            {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-2xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 text-lg mt-4 mb-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.712,35.619,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          Continuar con Google
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 rounded-2xl shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 text-lg mb-2"
          onClick={handleGuest}
          disabled={loading}
        >
          <span>👤</span> Seguir como invitado
        </button>
        <div className="text-center text-sm text-gray-600 dark:text-gray-300 pb-2 mt-4">
          <p>
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <span onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} className="font-semibold text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 cursor-pointer transition-colors ml-1">
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth; 