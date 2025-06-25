import React, { useState, useRef, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useTranslation } from 'react-i18next';

interface AuthProps {
  onAuthSuccess: (isInvitado?: boolean) => void;
}

// Función utilitaria para guardar usuario en Firestore
export async function saveUserToFirestore(user: any, extraData: any = {}) {
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
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Focus automático en email al abrir
  useEffect(() => {
    if (emailRef.current) emailRef.current.focus();
  }, []);

  // Si autocompleta el email, enfoca la contraseña (con retardo para evitar el menú de autocompletar)
  useEffect(() => {
    if (email && passwordRef.current && document.activeElement === emailRef.current && !password) {
      setTimeout(() => {
        passwordRef.current && passwordRef.current.focus();
      }, 100);
    }
  }, [email, password]);

  // Si autocompleta la contraseña y ambos campos están completos, envía el formulario SOLO si el foco está en la contraseña
  useEffect(() => {
    if (email && password && formRef.current && document.activeElement === passwordRef.current) {
      formRef.current.requestSubmit();
    }
  }, [password, email]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const auth = getAuth();
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await saveUserToFirestore(userCredential.user); // Guardar usuario tras login
        setMessage(t('¡Sesión iniciada correctamente!'));
        onAuthSuccess();
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await saveUserToFirestore(userCredential.user, { firstName, lastName }); // Guardar usuario tras registro
        setMessage(t('¡Cuenta creada correctamente!'));
        setIsLogin(true);
      }
    } catch (err: any) {
      const errorCode = err.code;
      if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
        setError(t('Email o contraseña incorrectos.'));
      } else if (errorCode === 'auth/email-already-in-use') {
        setError(t('Este correo electrónico ya está en uso.'));
      } else {
        setError(t('Ocurrió un error. Por favor, inténtalo de nuevo.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setMessage('');
    if (!email) {
      setError(t('Introduce tu email para recuperar la contraseña.'));
      return;
    }
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setMessage(t('Se ha enviado un email para restablecer la contraseña.'));
    } catch (err) {
      setError(t('No se pudo enviar el email. ¿Seguro que el correo es correcto?'));
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
      await saveUserToFirestore(result.user); // Guardar usuario tras login con Google
      setMessage(t('¡Sesión iniciada con Google!'));
      onAuthSuccess();
    } catch (err) {
      setError(t('No se pudo iniciar sesión con Google.'));
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, type, value, onChange, placeholder, inputRef, onKeyDown }: any) => (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-gray-900 dark:text-gray-100 font-semibold text-base">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#f9fafb] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-3 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all shadow-sm"
        autoComplete={type === 'password' ? 'current-password' : 'on'}
        ref={inputRef}
        onKeyDown={onKeyDown}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 bg-opacity-95 z-50">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-0 overflow-hidden animate-fade-in">
        <div className="flex flex-col items-center justify-center pt-8 pb-2 bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-t-3xl">
          <img src="/logo-header.png" alt="EGN Logo" className="h-24 w-auto mb-2" />
          <h1 className="text-3xl font-extrabold text-red-700 dark:text-red-400 mb-1 text-center tracking-tight">{isLogin ? t('Iniciar Sesión') : t('Crear Cuenta')}</h1>
        </div>
        <form onSubmit={handleAuth} ref={formRef} className="space-y-6 px-8 py-8 flex flex-col items-center mt-0">
          {!isLogin && (
            <>
              <InputField label={t('Nombre')} type="text" value={firstName} onChange={(e:any) => setFirstName(e.target.value)} placeholder={t('Introduce tu nombre')} />
              <InputField label={t('Apellido')} type="text" value={lastName} onChange={(e:any) => setLastName(e.target.value)} placeholder={t('Introduce tus apellidos')} />
            </>
          )}
          <InputField
            label={t('Correo electrónico')}
            type="email"
            value={email}
            onChange={(e:any) => setEmail(e.target.value)}
            placeholder="email@example.com"
            inputRef={emailRef}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' && passwordRef.current) {
                e.preventDefault();
                passwordRef.current.focus();
              }
            }}
          />
          <InputField
            label={t('Contraseña')}
            type="password"
            value={password}
            onChange={(e:any) => setPassword(e.target.value)}
            placeholder="••••••••"
            inputRef={passwordRef}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' && email && password && formRef.current) {
                formRef.current.requestSubmit();
              }
            }}
          />
          <div className="flex items-center justify-between w-full text-sm mt-2">
            <div className="flex items-center gap-2">
              <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
              <label htmlFor="remember-me" className="text-gray-600 dark:text-gray-300">{t('Recuérdame')}</label>
            </div>
            <span onClick={handleForgotPassword} className="font-semibold text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 cursor-pointer transition-colors">
              {t('¿Olvidaste tu contraseña?')}
            </span>
          </div>
          {message && <div className="text-green-600 dark:text-green-400 text-center font-medium w-full">{message}</div>}
          {error && <div className="text-red-600 dark:text-red-400 text-center font-medium w-full">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-2xl shadow-lg transition-all duration-300 disabled:bg-red-400 disabled:cursor-not-allowed text-lg mt-2">
            {loading ? t('Cargando...') : isLogin ? t('Iniciar Sesión') : t('Crear Cuenta')}
          </button>
        </form>
        <div className="text-center text-sm text-gray-600 dark:text-gray-300 pb-2">
          <p>
            {isLogin ? t('¿No tienes cuenta?') : t('¿Ya tienes cuenta?')}
            <span onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} className="font-semibold text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 cursor-pointer transition-colors ml-1">
              {isLogin ? t('Regístrate') : t('Inicia sesión')}
            </span>
          </p>
        </div>
        <div className="flex items-center justify-center px-8 pb-8">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          <span className="flex-shrink mx-4 text-gray-400 dark:text-gray-500 text-sm">{t('O continuar con')}</span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="px-8 pb-8">
          <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-2xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 text-lg mb-4">
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.712,35.619,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            {t('Continuar con Google')}
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 rounded-2xl shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 text-lg"
            onClick={() => onAuthSuccess(true)}
          >
            <span>👤</span> {t('Seguir como invitado')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth; 