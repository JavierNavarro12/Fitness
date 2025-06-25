import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLock, FaSignInAlt } from 'react-icons/fa';
import { useTranslation, Trans } from 'react-i18next';

interface LoginRequiredProps {
  sectionName: string;
  className?: string;
}

const LoginRequired: React.FC<LoginRequiredProps> = ({ sectionName, className = '' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    navigate(`/login?redirect=${location.pathname.substring(1)}&msg=protected`);
  };

  // Traducción del nombre de la sección si existe clave
  const sectionLabel = t(`sections.${sectionName.toLowerCase()}`, sectionName);

  return (
    <div className={`min-h-screen flex flex-col justify-start items-center py-0 ${className}`}>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center w-full mt-14">
        <div className="text-center space-y-6">
          {/* Icono */}
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            {FaLock({ className: "text-red-600 dark:text-red-400 text-3xl" })}
          </div>

          {/* Título */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('loginRequired.title')}
          </h2>

          {/* Mensaje */}
          <div className="space-y-4">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              <Trans i18nKey="loginRequired.message" components={{ 1: <span className="font-semibold text-red-600 dark:text-red-400" /> }} values={{ section: sectionLabel }} />
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('loginRequired.subtext')}
            </p>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mx-auto">
            <button
              onClick={handleLogin}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200"
            >
              {FaSignInAlt({ className: "text-lg" })}
              {t('loginRequired.loginButton')}
            </button>
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>{t('loginRequired.whyTitle')}</strong><br />
              {t('loginRequired.whyText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRequired; 