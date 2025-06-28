import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { startTransition } from 'react';
import Auth from '../auth/Auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Obtener el destino de redirección de la query string
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/';

  const handleAuthSuccess = (isInvitado?: boolean) => {
    if (isInvitado) {
      // Si es invitado, devolver a la home en vez de a la sección protegida
      startTransition(() => navigate('/', { replace: true }));
    } else {
      // Si se autentica, ir a la sección que estaba intentando acceder
      startTransition(() => navigate(redirect, { replace: true }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Auth onAuthSuccess={handleAuthSuccess} />
    </div>
  );
};

export default LoginPage; 