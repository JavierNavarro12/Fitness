import React, { useEffect, useState, useRef } from 'react';
import { collection, doc, getDoc, getDocs, query, where, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { UserProfile, Report } from './types';
import Auth from './components/Auth';
import Home from './components/Home';
import StepForm from './components/StepForm';
import ReportView from './components/ReportView';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import Switch from './components/Switch';
import LanguageSwitch from './components/LanguageSwitch';
import BottomNav from './components/BottomNav';
import SplashScreen from './components/SplashScreen';
import { FaMoon, FaSun } from 'react-icons/fa';

const NAVS = [
  { key: 'home', label: 'Inicio' },
  { key: 'custom', label: 'Personalización' },
  { key: 'reports', label: 'Mis informes' },
];
// NAVBAR_HEIGHT constante para altura base del header
const NAVBAR_HEIGHT = 64;

function App() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userReports, setUserReports] = useState<Report[]>([]);
  const [nav, setNav] = useState('home');
  const [customProfile, setCustomProfile] = useState<UserProfile | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [showSplash, setShowSplash] = useState(true);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const inicioBtnRef = useRef<HTMLButtonElement>(null);
  const megaMenuPanelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [menuContentMargin, setMenuContentMargin] = useState(0);
  const [menuPanelTop, setMenuPanelTop] = useState(NAVBAR_HEIGHT);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          // Cargar perfil del usuario
          const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
          if (profileDoc.exists()) {
            setUserProfile(profileDoc.data() as UserProfile);
          }
          // Cargar reportes del usuario
          const reportsQuery = query(collection(db, 'reports'), where('userId', '==', user.uid));
          const reportsSnapshot = await getDocs(reportsQuery);
          const reports = reportsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Report))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setUserReports(reports);
        } catch (error: any) {
          if (
            error.code === 'unavailable' ||
            error.message?.includes('client is offline')
          ) {
            // Ignorar el error de offline
            return;
          } else {
            console.error(error);
          }
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setUserReports([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Cerrar el menú si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleSaveProfile = async (profile: UserProfile) => {
    if (!user) return;
    try {
      const profileRef = doc(db, 'profiles', user.uid);
      await setDoc(profileRef, profile);
      setUserProfile(profile);
      setCustomProfile(profile);
      setShowSummary(true);
      setNav('custom');
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
    }
  };

  const handleGenerateReport = async () => {
    if (!customProfile || !user) return;
    setGenerating(true);

    const lang = i18n.language;
    const prompt = lang === 'en'
      ? `
You are an expert in sports supplementation.
Generate a personalized and professional supplementation report for the following profile:

- Goal: ${customProfile.objective}
- Main sport: ${customProfile.sport}
- Experience level: ${mapExperience(customProfile.experience)}
- Training frequency: ${mapFrequency(customProfile.frequency)}
- Weight: ${customProfile.weight} kg
- Height: ${customProfile.height} cm
- Age: ${customProfile.age}
- Gender: ${mapGender(customProfile.gender)}
- Medical conditions: ${customProfile.medicalConditions.join(', ') || 'None'}
- Allergies: ${customProfile.allergies.join(', ') || 'None'}
- Current supplements: ${customProfile.currentSupplements.join(', ') || 'None'}

First, write the personalized report with explanations and advice.
For each recommended supplement, include the recommended dose (in grams, capsules, etc.) and the best time of day to take it (e.g., after training, with breakfast, etc.).
Then, add a section titled "Recommended products" with a list of direct links to real products of the recommended supplements in online stores (e.g., Amazon, Decathlon, etc.).
The format of the list should be:
- [Supplement name](Product URL)

Do not repeat the profile summary, only the report and the product list.
The report must be clear, professional, and easy to read.
`
      : `
Eres un experto en suplementación deportiva.
Genera un informe de suplementación personalizado y profesional para el siguiente perfil:

- Objetivo: ${customProfile.objective}
- Deporte principal: ${customProfile.sport}
- Nivel de experiencia: ${mapExperience(customProfile.experience)}
- Frecuencia de entrenamiento: ${mapFrequency(customProfile.frequency)}
- Peso: ${customProfile.weight} kg
- Altura: ${customProfile.height} cm
- Edad: ${customProfile.age}
- Género: ${mapGender(customProfile.gender)}
- Condiciones médicas: ${customProfile.medicalConditions.join(', ') || 'Ninguna'}
- Alergias: ${customProfile.allergies.join(', ') || 'Ninguna'}
- Suplementos actuales: ${customProfile.currentSupplements.join(', ') || 'Ninguno'}

Primero, escribe el informe personalizado con explicaciones y consejos.
Para cada suplemento recomendado, incluye la dosis recomendada (en gramos, cápsulas, etc.) y el mejor momento del día para tomarlo (por ejemplo: después de entrenar, con el desayuno, etc.).
Después, añade una sección titulada "Productos recomendados" con una lista de enlaces directos a productos reales de los suplementos recomendados en tiendas online (por ejemplo, Amazon España, Decathlon, etc.).
El formato de la lista debe ser:
- [Nombre del suplemento](URL del producto)

No repitas el resumen del perfil, solo el informe y la lista de productos.
El informe debe ser claro, profesional y fácil de leer.
`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Eres un experto en suplementación deportiva.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 700,
        }),
      });

      const data = await response.json();
      let aiContent = 'No se pudo generar el informe.';
      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        aiContent = data.choices[0].message.content.trim();
      } else if (data.error && data.error.message) {
        aiContent = data.error.message;
      }

      const newReport: Report = {
        content: aiContent,
        createdAt: new Date().toISOString(),
        userId: user.uid,
      };

      const docRef = await addDoc(collection(db, 'reports'), newReport);
      setUserReports(prev => [{ ...newReport, id: docRef.id }, ...prev]);
      setShowSummary(false);
      setNav('reports');
    } catch (error) {
      console.error('Error al generar el informe:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      await deleteDoc(doc(db, 'reports', reportId));
      setUserReports(prev => prev.filter(r => r.id !== reportId));
    } catch (error) {
      alert('Error al eliminar el informe.');
      console.error(error);
    }
  };

  // Funciones de mapeo para mostrar los valores en español
  const mapGender = (g: string) => {
    if (g === 'male') return 'Masculino';
    if (g === 'female') return 'Femenino';
    if (g === 'other') return 'Otro';
    return g;
  };
  const mapExperience = (e: string) => {
    if (e === 'beginner') return 'Principiante';
    if (e === 'intermediate') return 'Intermedio';
    if (e === 'advanced') return 'Avanzado';
    return e;
  };
  const mapFrequency = (f: string) => {
    if (f === 'low') return 'Baja (1-2 veces/semana)';
    if (f === 'medium') return 'Media (3-4 veces/semana)';
    if (f === 'high') return 'Alta (5+ veces/semana)';
    return f;
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    const lang = localStorage.getItem('lang');
    if (lang) i18n.changeLanguage(lang);
  }, [i18n]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!megaMenuOpen) return;
    function handleMouseMove(e: MouseEvent) {
      const btn = inicioBtnRef.current;
      const panel = megaMenuPanelRef.current;
      if (!btn || !panel) return;
      const btnRect = btn.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const { clientX: x, clientY: y } = e;
      const overBtn =
        x >= btnRect.left && x <= btnRect.right && y >= btnRect.top && y <= btnRect.bottom;
      const overPanel =
        x >= panelRect.left && x <= panelRect.right && y >= panelRect.top && y <= panelRect.bottom;
      if (!overBtn && !overPanel) {
        setMegaMenuOpen(false);
      }
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [megaMenuOpen]);

  useEffect(() => {
    if (megaMenuOpen && inicioBtnRef.current && megaMenuPanelRef.current) {
      const btnRect = inicioBtnRef.current.getBoundingClientRect();
      const panelRect = megaMenuPanelRef.current.getBoundingClientRect();
      // Alinea el contenido con el borde izquierdo del botón Inicio
      const margin = btnRect.left - panelRect.left;
      setMenuContentMargin(margin);
    }
  }, [megaMenuOpen, menuPanelTop]);

  useEffect(() => {
    function updateMenuPanelTop() {
      if (megaMenuOpen && inicioBtnRef.current) {
        const btnRect = inicioBtnRef.current.getBoundingClientRect();
        setMenuPanelTop(btnRect.bottom);
      }
    }
    updateMenuPanelTop();
    window.addEventListener('resize', updateMenuPanelTop);
    return () => window.removeEventListener('resize', updateMenuPanelTop);
  }, [megaMenuOpen]);

  if (showSplash) return <SplashScreen />;

  if (!user) {
    return <Auth onAuthSuccess={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* HEADER */}
      <header
        ref={headerRef}
        className="bg-white dark:bg-gray-900 sticky top-0 z-50 hidden sm:block relative"
      >
        <div className="max-w-7xl mx-auto flex flex-row items-center justify-between py-2 px-4 relative" style={{ minHeight: NAVBAR_HEIGHT }}>
          {/* EGN a la izquierda */}
          <span className="text-3xl font-bold text-red-700 dark:text-red-300">EGN</span>
          {/* NAVBAR en el centro */}
          <nav className="flex-1 flex justify-center">
            <ul className="flex gap-8 items-center">
              <li className="relative group">
                <div
                  className="relative"
                  onMouseEnter={() => setMegaMenuOpen(true)}
                  onMouseLeave={() => setMegaMenuOpen(false)}
                  style={{ display: 'inline-block' }}
                >
                  <button
                    ref={inicioBtnRef}
                    className={`whitespace-nowrap text-sm md:text-lg font-semibold px-4 py-2 rounded transition-all duration-200 ${nav === 'home' ? 'bg-red-600 text-white shadow' : 'text-red-700 hover:bg-red-100'}`}
                    onClick={() => {
                      setNav('home');
                      setShowSummary(false);
                      setMegaMenuOpen(false);
                    }}
                  >
                    {t('Inicio')}
                  </button>
                  {megaMenuOpen && (
                    <>
                      {/* Overlay blur más agresivo */}
                      <div className="fixed inset-0 z-40" style={{ top: menuPanelTop }}>
                        <div className="w-full h-full backdrop-blur-[16px] bg-white/70" />
                      </div>
                    <div
                      ref={megaMenuPanelRef}
                      className="fixed left-0 w-screen bg-white dark:bg-gray-900 animate-fade-in z-50"
                      style={{ borderRadius: 0, top: menuPanelTop }}
                    >
                      <div className="max-w-7xl mx-auto px-8 py-8" style={{ marginLeft: menuContentMargin > 0 ? menuContentMargin : undefined }}>
                        {[
                          { key: 'conocenos', label: 'Conócenos', nav: 'home' },
                          { key: 'deportes', label: 'Deportes', nav: 'custom' },
                          { key: 'salud', label: 'Salud y Bienestar', nav: 'salud' },
                          { key: 'grasa', label: 'Quema de Grasa', nav: 'grasa' },
                          { key: 'mujer', label: 'Específico Mujer', nav: 'mujer' },
                          { key: 'cognitivo', label: 'Rendimiento Cognitivo', nav: 'cognitivo' },
                        ].map(section => (
                          <button
                            key={section.key}
                            className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-red-600 transition-colors py-2 text-left w-full"
                            onClick={() => { setNav(section.nav); setMegaMenuOpen(false); }}
                          >
                            {section.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    </>
                  )}
                </div>
              </li>
              {NAVS.filter(tab => tab.key !== 'home').map(tab => (
                <li key={tab.key} className="flex">
                  <button
                    className={`whitespace-nowrap text-sm md:text-lg font-semibold px-4 py-2 rounded transition-all duration-200 ${nav === tab.key ? 'bg-red-600 text-white shadow' : 'text-red-700 hover:bg-red-100'}`}
                    onClick={() => {
                      setNav(tab.key);
                      setShowSummary(false);
                      if (tab.key === 'custom') {
                        setCustomProfile(null);
                        setIsEditingProfile(false);
                      }
                    }}
                  >
                    {t(tab.label)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          {/* Perfil a la derecha */}
          <div className="flex items-center" ref={userMenuRef}>
            <button
              className="flex items-center focus:outline-none"
              onClick={() => setShowUserMenu((v) => !v)}
              aria-label="Menú de usuario"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-red-200">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xl">👤</span>
                )}
              </div>
              <span className="ml-2 font-semibold text-gray-800 dark:text-gray-100 text-base hidden md:block">
                {user?.displayName || user?.email?.split('@')[0]}
              </span>
              <FontAwesomeIcon icon={faChevronDown} className="ml-1 text-gray-500 hidden md:block" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-50 animate-fade-in">
                <button
                  className="w-full text-center px-4 py-3 hover:bg-gray-100 text-gray-700 rounded-t-lg"
                  onClick={() => { setShowProfileModal(true); setShowUserMenu(false); }}
                >
                  {t('Ver perfil')}
                </button>
                <button
                  className="w-full text-center px-4 py-3 hover:bg-gray-100 text-gray-700"
                  onClick={handleLogout}
                >
                  {t('Cerrar sesión')}
                </button>
                <div className="border-t border-gray-200 my-1" />
                <div className="flex flex-row gap-3 justify-center items-center px-4 py-2">
                  <div style={{ transform: 'scale(0.8)' }}>
                    <LanguageSwitch
                      checked={i18n.language === 'en'}
                      onChange={() => {
                        const newLang = i18n.language === 'es' ? 'en' : 'es';
                        i18n.changeLanguage(newLang);
                        localStorage.setItem('lang', newLang);
                      }}
                    />
                  </div>
                  <div style={{ transform: 'scale(0.8)' }}>
                    <Switch checked={darkMode} onChange={() => setDarkMode(v => !v)} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Header móvil fijo */}
      <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow z-40 flex items-center justify-center h-14 sm:hidden">
        <h1 className="text-2xl font-bold text-red-700 dark:text-red-300">EGN</h1>
      </header>

      {/* MODAL PERFIL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-2xl font-bold"
              onClick={() => setShowProfileModal(false)}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-6 text-center">{t('Mi Perfil')}</h2>
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center mb-2">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-4xl">👤</span>
                )}
              </div>
              <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">{user?.displayName || user?.email?.split('@')[0]}</span>
              <span className="text-gray-500 dark:text-gray-300 text-sm">{user?.email}</span>
            </div>
            {userProfile && (
              <ul className="space-y-2 text-gray-700 dark:text-gray-200">
                <li><b>{t('Edad')}:</b> {userProfile.age}</li>
                <li><b>{t('Género')}:</b> {mapGender(userProfile.gender)}</li>
                <li><b>{t('Peso')}:</b> {userProfile.weight} kg</li>
                <li><b>{t('Altura')}:</b> {userProfile.height} cm</li>
                <li><b>{t('Objetivo')}:</b> {userProfile.objective}</li>
                <li><b>{t('Experiencia')}:</b> {mapExperience(userProfile.experience)}</li>
                <li><b>{t('Frecuencia de entrenamiento')}:</b> {mapFrequency(userProfile.frequency)}</li>
                <li><b>{t('Deporte principal')}:</b> {userProfile.sport}</li>
                <li><b>{t('Condiciones médicas')}:</b> {userProfile.medicalConditions.join(', ') || t('Ninguna')}</li>
                <li><b>{t('Alergias')}:</b> {userProfile.allergies.join(', ') || t('Ninguna')}</li>
                <li><b>{t('Suplementos actuales')}:</b> {userProfile.currentSupplements.join(', ') || t('Ninguno')}</li>
              </ul>
            )}
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 container mx-auto px-4 pt-20 pb-20 sm:pt-8 sm:pb-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {nav === 'home' && (
          <Home onStart={() => setNav('custom')} />
        )}
        {nav === 'custom' && !showSummary && !isEditingProfile && (
          <>
            {/* Móvil: centrado vertical */}
            <div className="flex flex-1 flex-col items-center justify-center min-h-[calc(100vh-136px)] sm:hidden -translate-y-6">
              <div className="mt-2 w-full flex justify-center">
                <StepForm onComplete={handleSaveProfile} />
              </div>
            </div>
            {/* Desktop: layout original */}
            <div className="hidden sm:block">
          <StepForm onComplete={handleSaveProfile} />
            </div>
          </>
        )}
        {nav === 'custom' && showSummary && customProfile && !isEditingProfile && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mt-8 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl"
              title={t('Editar perfil')}
              onClick={() => setIsEditingProfile(true)}
            >
              <FontAwesomeIcon icon={faPencil} size="lg" />
            </button>
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-6 text-center">{t('Resumen de tu perfil')}</h2>
            <ul className="mb-6 space-y-2 text-gray-900 dark:text-gray-100">
              <li><b>{t('Edad')}:</b> {customProfile.age}</li>
              <li><b>{t('Género')}:</b> {mapGender(customProfile.gender)}</li>
              <li><b>{t('Peso')}:</b> {customProfile.weight} kg</li>
              <li><b>{t('Altura')}:</b> {customProfile.height} cm</li>
              <li><b>{t('Objetivo')}:</b> {customProfile.objective}</li>
              <li><b>{t('Experiencia')}:</b> {mapExperience(customProfile.experience)}</li>
              <li><b>{t('Frecuencia de entrenamiento')}:</b> {mapFrequency(customProfile.frequency)}</li>
              <li><b>{t('Deporte principal')}:</b> {customProfile.sport}</li>
              <li><b>{t('Condiciones médicas')}:</b> {customProfile.medicalConditions.join(', ') || t('Ninguna')}</li>
              <li><b>{t('Alergias')}:</b> {customProfile.allergies.join(', ') || t('Ninguna')}</li>
              <li><b>{t('Suplementos actuales')}:</b> {customProfile.currentSupplements.join(', ') || t('Ninguno')}</li>
            </ul>
            <button
              onClick={handleGenerateReport}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg text-xl transition-all duration-200 w-full"
              disabled={generating}
            >
              {generating ? t('Generando informe...') : t('Generar informe')}
            </button>
          </div>
        )}
        {nav === 'custom' && isEditingProfile && customProfile && (
          <StepForm
            onComplete={(profile) => {
              setCustomProfile(profile);
              setIsEditingProfile(false);
            }}
            initialProfile={customProfile}
            isEditing={true}
          />
        )}
        {nav === 'reports' && (
          <div className="max-w-4xl mx-auto">
            {userReports.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                {t('No tienes informes generados aún.')}
              </div>
            ) : (
              <div className="space-y-6">
                {userReports.map((report, index) => (
                  <ReportView key={index} report={report} onDelete={handleDeleteReport} />
                ))}
              </div>
            )}
          </div>
        )}
        {nav === 'profile' && (
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 mt-4 mb-24 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center mb-2">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-4xl">👤</span>
              )}
            </div>
            <div className="text-center mb-4">
              <div className="font-bold text-lg text-gray-900 dark:text-gray-100">{user?.displayName || user?.email?.split('@')[0]}</div>
              <div className="text-gray-500 dark:text-gray-300 text-sm">{user?.email}</div>
            </div>
            {userProfile && (
              <ul className="w-full mb-6 space-y-2 text-gray-900 dark:text-gray-100 text-[15px]">
                <li><b>Edad:</b> {userProfile.age}</li>
                <li><b>Género:</b> {userProfile.gender === 'male' ? 'Masculino' : userProfile.gender === 'female' ? 'Femenino' : 'Otro'}</li>
                <li><b>Peso:</b> {userProfile.weight} kg</li>
                <li><b>Altura:</b> {userProfile.height} cm</li>
                <li><b>Objetivo:</b> {userProfile.objective}</li>
                <li><b>Experiencia:</b> {userProfile.experience === 'beginner' ? 'Principiante' : userProfile.experience === 'intermediate' ? 'Intermedio' : 'Avanzado'}</li>
                <li><b>Frecuencia de entrenamiento:</b> {userProfile.frequency === 'low' ? 'Baja (1-2 veces/semana)' : userProfile.frequency === 'medium' ? 'Media (3-4 veces/semana)' : 'Alta (5+ veces/semana)'}</li>
                <li><b>Deporte principal:</b> {userProfile.sport}</li>
                <li><b>Condiciones médicas:</b> {userProfile.medicalConditions.join(', ') || 'Ninguna'}</li>
                <li><b>Alergias:</b> {userProfile.allergies.join(', ') || 'Ninguna'}</li>
                <li><b>Suplementos actuales:</b> {userProfile.currentSupplements.join(', ') || 'Ninguno'}</li>
              </ul>
            )}
            <button
              onClick={() => signOut(auth)}
              className="mt-auto w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow text-lg transition-all duration-200"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </main>
      <footer className="bg-gray-800 dark:bg-gray-900 text-white p-6 mt-12 hidden sm:block">
        <div className="container mx-auto text-center">
          <p>© 2024 Fitness Supplements Advisor. {t('Todos los derechos reservados.')}</p>
          <p className="text-sm text-gray-400 dark:text-gray-300 mt-2">
            {t('Las recomendaciones son sugerencias generales. Consulta con un profesional de la salud antes de comenzar cualquier suplementación.')}
          </p>
        </div>
      </footer>
      {/* Bottom navigation bar solo visible en móvil */}
      <BottomNav nav={nav} setNav={setNav} user={user} onSignOut={() => signOut(auth)} />
      {/* Botón de modo oscuro simple solo en móvil, arriba a la derecha */}
      <div className="fixed top-2 right-4 z-50 sm:hidden">
        <button
          onClick={() => setDarkMode(d => !d)}
          className="bg-gray-200 dark:bg-gray-700 rounded-full p-2 shadow text-xl transition"
          aria-label="Cambiar modo oscuro"
        >
          {darkMode ? FaSun({ className: "text-yellow-400" }) : FaMoon({ className: "text-gray-800" })}
        </button>
      </div>
    </div>
  );
}

export default App; 