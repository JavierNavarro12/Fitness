import React from 'react';

interface UserDrawerProps {
  open: boolean;
  onClose: () => void;
  user: { firstName: string; lastName: string; email: string; photo?: string };
  onProfile: () => void;
  onReports: () => void;
  onLogout: () => void;
  isGuest: boolean;
  onLogin: () => void;
  onRegister: () => void;
}

const iconClass = 'w-6 h-6 mr-4 text-gray-600 flex-shrink-0';
const arrowIcon = (
  <svg className="w-6 h-6 ml-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const UserDrawer: React.FC<UserDrawerProps> = ({
  open,
  onClose,
  user,
  onProfile,
  onReports,
  onLogout,
  isGuest,
  onLogin,
  onRegister,
}) => {
  if (!open) return null;
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-50"
        onClick={onClose}
      />
      {/* Drawer lateral derecho, responsivo */}
      <aside className="fixed top-0 right-0 h-full w-full sm:w-[500px] max-w-full bg-white shadow-2xl z-50 flex flex-col rounded-none sm:rounded-r-2xl border-l border-gray-200 animate-slide-in">
        <div className="flex flex-col h-full min-h-0 flex-1 overflow-y-auto">
          {/* Cabecera */}
          <div className="flex items-center justify-between px-4 sm:px-10 py-6 sm:py-8 border-b border-gray-200">
            <span className="text-xl sm:text-2xl font-bold text-gray-800">Mi cuenta</span>
            <button
              className="text-2xl text-gray-400 hover:text-red-600 font-bold"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          {/* Avatar y datos */}
          <div className="flex items-center gap-4 sm:gap-6 px-4 sm:px-10 py-6 sm:py-8 border-b border-gray-100">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {user.photo ? (
                <img src={user.photo} alt="Foto de perfil" className="object-cover w-full h-full" />
              ) : (
                <span className="text-gray-400 text-4xl sm:text-5xl">👤</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800 text-lg sm:text-xl">{user.firstName || 'Invitado'}</span>
              <span className="text-gray-500 text-sm sm:text-base">{user.email}</span>
            </div>
          </div>
          {/* Botones grandes para invitado */}
          {isGuest && (
            <div className="flex flex-col gap-4 sm:gap-5 px-4 sm:px-10 py-6 sm:py-10 border-b border-gray-100">
              <button
                className="w-full flex items-center justify-between bg-black hover:bg-gray-900 text-white font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-lg text-lg sm:text-xl transition shadow-md"
                style={{lineHeight: 'normal'}}
                onClick={() => { onLogin(); onClose(); }}
              >
                <span className="font-bold text-lg sm:text-xl">Iniciar sesión</span>
                {arrowIcon}
              </button>
              <button
                className="w-full flex items-center justify-between bg-white border-2 border-black hover:bg-gray-100 text-black font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-lg text-lg sm:text-xl transition shadow-md"
                style={{lineHeight: 'normal'}}
                onClick={() => { onRegister(); onClose(); }}
              >
                <span className="font-bold text-lg sm:text-xl">Registro</span>
                {arrowIcon}
              </button>
            </div>
          )}
          {/* Opciones */}
          <nav className="flex flex-col gap-2 sm:gap-3 px-4 sm:px-10 py-6 sm:py-10 flex-1">
            <button
              className="flex items-center w-full px-2 py-4 sm:py-5 rounded-lg hover:bg-gray-100 text-left font-semibold text-gray-700 text-lg sm:text-xl transition"
              onClick={() => { onProfile(); onClose(); }}
            >
              <span className={iconClass}>👤</span> Ver perfil
            </button>
            {!isGuest && (
              <button
                className="flex items-center w-full px-2 py-4 sm:py-5 rounded-lg hover:bg-gray-100 text-left font-semibold text-gray-700 text-lg sm:text-xl transition"
                onClick={() => { onLogout(); onClose(); }}
              >
                <span className={iconClass}>🚪</span> Cerrar sesión
              </button>
            )}
          </nav>
        </div>
      </aside>
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 0.2s ease; }
      `}</style>
    </>
  );
};

export default UserDrawer; 