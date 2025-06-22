import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { collection, doc, getDoc, getDocs, query, where, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { UserProfile, Report } from './types';
import Auth from './components/features/auth/Auth';
import SplashScreen from './components/layout/SplashScreen';
import Footer from './components/layout/Footer';
import SearchPanel from './components/shared/SearchPanel';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { searchableContent } from './data/content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import Switch from './components/shared/Switch';
import LanguageSwitch from './components/shared/LanguageSwitch';
import BottomNav from './components/layout/BottomNav';
import MobileMenu from './components/layout/MobileMenu';

interface SearchResult {
  id: string;
  category: string;
  title: string;
  snippet?: string;
}

// Lazy load page components
const HomePage = lazy(() => import('./components/features/pages/HomePage'));
const Deportes = lazy(() => import('./components/features/pages/Deportes'));
const Salud = lazy(() => import('./components/features/pages/Salud'));
const Grasa = lazy(() => import('./components/features/pages/Grasa'));
const Mujer = lazy(() => import('./components/features/pages/Mujer'));
const Cognitivo = lazy(() => import('./components/features/pages/Cognitivo'));
const FAQ = lazy(() => import('./components/features/pages/FAQ'));
const Terms = lazy(() => import('./components/features/pages/Terms'));
const Privacy = lazy(() => import('./components/features/pages/Privacy'));
const Contact = lazy(() => import('./components/features/pages/Contact'));
const StepForm = lazy(() => import('./components/features/reports/StepForm'));
const ReportView = lazy(() => import('./components/features/reports/ReportView'));

const NAVS = [
  { key: 'home', label: 'nav.home' },
  { key: 'custom', label: 'nav.custom' },
  { key: 'reports', label: 'nav.reports' },
];

const megaMenuItems = [
  { key: 'deportes', label: 'megaMenu.deportes', nav: 'deportes' },
  { key: 'salud', label: 'megaMenu.salud', nav: 'salud' },
  { key: 'grasa', label: 'megaMenu.grasa', nav: 'grasa' },
  { key: 'mujer', label: 'megaMenu.mujer', nav: 'mujer' },
  { key: 'cognitivo', label: 'megaMenu.cognitivo', nav: 'cognitivo' },
];

// NAVBAR_HEIGHT constante para altura base del header
const NAVBAR_HEIGHT = 64;

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full flex-1 py-20">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
  </div>
);

const SearchIcon = ({ className = '' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const HamburgerIcon = ({ className = '' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const UserCircleIcon = ({ className = '' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = ({ className = '' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </svg>
);

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
  const [menuPanelTop, setMenuPanelTop] = useState(NAVBAR_HEIGHT);
  const [menuContentMargin, setMenuContentMargin] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchResultToHighlight, setSearchResultToHighlight] = useState<{ page: string; id: string } | null>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navChangedBySearch = useRef(false);

  useEffect(() => {
    // Inicializar AOS
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100
    });

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
      if (showMobileSearch) return;

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
  }, [showUserMenu, showMobileSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showMobileSearch) return;

      if (searchPanelRef.current && !searchPanelRef.current.contains(event.target as Node)) {
        setSearchQuery('');
        setSearchResults([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchResults, showMobileSearch]);

  useEffect(() => {
    if (navChangedBySearch.current) {
      // Si la navegación fue por búsqueda, el efecto de abajo se encargará.
      return;
    }
    // Para navegación normal, ir al principio.
    window.scrollTo(0, 0);
  }, [nav]);

  const handleHighlightComplete = () => {
    navChangedBySearch.current = false;
    setSearchResultToHighlight(null);
  };

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
      console.error('Error al eliminar el informe.');
      console.error(error);
    }
  };

  // Funciones de mapeo para mostrar los valores traducidos
  const mapGender = (g: string) => {
    if (g === 'male') return t('gender.male');
    if (g === 'female') return t('gender.female');
    if (g === 'other') return t('gender.other');
    return g;
  };
  const mapExperience = (e: string) => {
    if (e === 'beginner') return t('experience.beginner');
    if (e === 'intermediate') return t('experience.intermediate');
    if (e === 'advanced') return t('experience.advanced');
    return e;
  };
  const mapFrequency = (f: string) => {
    if (f === 'low') return t('frequency.low');
    if (f === 'medium') return t('frequency.medium');
    if (f === 'high') return t('frequency.high');
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
    function updateMenuPanelPosition() {
      if (megaMenuOpen && inicioBtnRef.current) {
        const btnRect = inicioBtnRef.current.getBoundingClientRect();
        setMenuPanelTop(btnRect.bottom);
        setMenuContentMargin(btnRect.left - 16);
      }
    }
    updateMenuPanelPosition();
    window.addEventListener('resize', updateMenuPanelPosition);
    return () => window.removeEventListener('resize', updateMenuPanelPosition);
  }, [megaMenuOpen]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerCaseQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const results = searchableContent.reduce((acc: SearchResult[], item) => {
      const translatedTitle = t(item.title).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const translatedContent = t(item.content);
      const normalizedContent = translatedContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const titleMatch = translatedTitle.includes(lowerCaseQuery);
      const contentMatch = normalizedContent.includes(lowerCaseQuery);

      if (titleMatch || contentMatch) {
        let snippet = '';
        if (contentMatch) {
          const sentences = translatedContent.split('. ');
          const matchingSentence = sentences.find((sentence: string) =>
            sentence.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(lowerCaseQuery)
          );
          if (matchingSentence) {
            snippet = matchingSentence.trim();
            if(!snippet.endsWith('.')) {
              snippet += '.';
            }
          }
        }
        
        acc.push({
          id: item.id,
          category: item.category,
          title: item.title,
          snippet: snippet || undefined,
        });
      }
      return acc;
    }, []);

    setSearchResults(results);
  };

  const handleResultClick = (result: { category: string; id: string; }) => {
    navChangedBySearch.current = true;
    setNav(result.category);
    setSearchResultToHighlight({ page: result.category, id: result.id });
    setSearchQuery('');
    setSearchResults([]);
    setShowSummary(false);
  };

  const handleMobileNav = (nav: string) => {
    setNav(nav);
    setShowSummary(false);
  };

  if (showSplash) return <SplashScreen />;

  if (!user) {
    return <Auth onAuthSuccess={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col pb-20 sm:pb-0">
      {/* HEADER */}
      <header
        ref={headerRef}
        className="bg-white dark:bg-gray-900 sticky top-0 z-50 hidden sm:block"
      >
        <div className="max-w-7xl mx-auto flex items-center py-2 px-4" style={{ minHeight: NAVBAR_HEIGHT }}>
          {/* Izquierda: Logo y Nav */}
          <div className="flex items-center flex-shrink-0">
            <span className="text-3xl font-bold text-red-700 dark:text-red-300">EGN</span>
            <nav className="ml-24">
              <ul className="flex gap-8 items-center">
                <li key="home" className="flex">
                  <button
                    className={`whitespace-nowrap text-sm md:text-lg font-semibold px-4 py-2 rounded transition-all duration-200 ${nav === 'home' ? 'bg-red-600 text-white shadow' : 'text-red-700 hover:bg-red-100'}`}
                    onClick={() => {
                      setNav('home');
                      setShowSummary(false);
                    }}
                  >
                    {t('nav.home')}
                  </button>
                </li>
                <li className="static group">
                  <div
                    onMouseEnter={() => setMegaMenuOpen(true)}
                    onMouseLeave={() => setMegaMenuOpen(false)}
                    style={{ display: 'inline-block' }}
                  >
                    <button
                      ref={inicioBtnRef}
                      className={`whitespace-nowrap text-sm md:text-lg font-semibold px-4 py-2 rounded transition-all duration-200 text-red-700 hover:bg-red-100`}
                    >
                      {t('nav.categories')}
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
                          <div className="px-4 py-8" style={{ marginLeft: menuContentMargin }}>
                            {megaMenuItems.map(section => (
                              <button
                                key={section.key}
                                className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-red-600 transition-colors py-2 text-left w-full"
                                onClick={() => { setNav(section.nav); setMegaMenuOpen(false); }}
                              >
                                {t(section.label)}
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
          </div>

          {/* Spacer para empujar a la derecha */}
          <div className="flex-grow" />

          {/* Derecha: Búsqueda y Perfil */}
          <div className="flex items-center flex-shrink-0" ref={searchPanelRef}>
            <SearchPanel
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              results={searchResults}
              onResultClick={handleResultClick}
            />
            <div className="flex items-center ml-20 relative" ref={userMenuRef}>
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
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 overflow-hidden z-50 animate-fade-in">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{user?.displayName || user?.email?.split('@')[0]}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>

                  <div className="py-2">
                  <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => { setShowProfileModal(true); setShowUserMenu(false); }}
                  >
                      <UserCircleIcon className="w-5 h-5" />
                      <span>{t('userDropdown.viewProfile')}</span>
                  </button>
                  <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
                    onClick={handleLogout}
                  >
                      <LogoutIcon className="w-5 h-5" />
                      <span>{t('userDropdown.logout')}</span>
                  </button>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-2">
                    <div className="flex justify-center items-center gap-2">
                      <LanguageSwitch
                        checked={i18n.language === 'en'}
                        onChange={() => {
                          const newLang = i18n.language === 'es' ? 'en' : 'es';
                          i18n.changeLanguage(newLang);
                          localStorage.setItem('lang', newLang);
                        }}
                      />
                      <Switch checked={darkMode} onChange={() => setDarkMode(v => !v)} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Header móvil fijo */}
      <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow z-40 flex items-center justify-between h-14 sm:hidden px-6">
        <span
          className="text-2xl font-bold text-red-700 dark:text-red-300 cursor-pointer"
          onClick={() => setNav('home')}
        >
          EGN
        </span>
        <div className="flex items-center gap-4">
            <button onClick={() => setShowMobileSearch(v => !v)} className="text-gray-600 dark:text-gray-300">
                <SearchIcon className="h-6 w-6" />
            </button>
            <button onClick={() => setMobileMenuOpen(true)} className="text-gray-600 dark:text-gray-300">
                <HamburgerIcon className="h-7 w-7" />
            </button>
        </div>
      </header>
      
      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed top-14 left-0 w-full bg-white dark:bg-gray-800 p-4 z-30 shadow-md sm:hidden animate-fade-in-down">
           <SearchPanel
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              results={searchResults}
              onResultClick={(result: { id: string; category: string; }) => {
                handleResultClick(result);
                setShowMobileSearch(false);
              }}
            />
        </div>
      )}

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={handleMobileNav}
        menuItems={megaMenuItems}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(v => !v)}
        i18n={i18n}
      />

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
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-6 text-center">{t('profileSummary.title')}</h2>
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
                <li><b>{t('profileSummary.age')}:</b> {userProfile.age}</li>
                <li><b>{t('profileSummary.gender')}:</b> {mapGender(userProfile.gender)}</li>
                <li><b>{t('profileSummary.weight')}:</b> {userProfile.weight} kg</li>
                <li><b>{t('profileSummary.height')}:</b> {userProfile.height} cm</li>
                <li><b>{t('profileSummary.objective')}:</b> {userProfile.objective}</li>
                <li><b>{t('profileSummary.experience')}:</b> {mapExperience(userProfile.experience)}</li>
                <li><b>{t('profileSummary.trainingFrequency')}:</b> {mapFrequency(userProfile.frequency)}</li>
                <li><b>{t('profileSummary.mainSport')}:</b> {t(userProfile.sport)}</li>
                <li><b>{t('profileSummary.medicalConditions')}:</b> {userProfile.medicalConditions.join(', ') || t('profileSummary.none')}</li>
                <li><b>{t('profileSummary.allergies')}:</b> {userProfile.allergies.join(', ') || t('profileSummary.none')}</li>
                <li><b>{t('profileSummary.currentSupplements')}:</b> {userProfile.currentSupplements.join(', ') || t('profileSummary.none')}</li>
              </ul>
            )}
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col container mx-auto px-4 pt-20 sm:pt-8 pb-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100" data-aos="fade-up">
        <Suspense fallback={<LoadingSpinner />}>
        {nav === 'home' && <HomePage onStart={() => setNav('custom')} />}
        {nav === 'deportes' && <Deportes itemToHighlight={searchResultToHighlight} onHighlightComplete={handleHighlightComplete} />}
        {nav === 'salud' && <Salud itemToHighlight={searchResultToHighlight} onHighlightComplete={handleHighlightComplete} />}
        {nav === 'grasa' && <Grasa itemToHighlight={searchResultToHighlight} onHighlightComplete={handleHighlightComplete} />}
        {nav === 'mujer' && <Mujer itemToHighlight={searchResultToHighlight} onHighlightComplete={handleHighlightComplete} />}
        {nav === 'cognitivo' && <Cognitivo itemToHighlight={searchResultToHighlight} onHighlightComplete={handleHighlightComplete} />}
          {nav === 'faq' && <FAQ setNav={setNav} />}
          {nav === 'terms' && <Terms />}
          {nav === 'privacy' && <Privacy />}
          {nav === 'contact' && <Contact />}

        {nav === 'custom' && !showSummary && !isEditingProfile && (
          <>
            {/* Móvil: centrado vertical */}
            <div className="flex flex-1 flex-col items-center justify-center min-h-[calc(100vh-136px)] sm:hidden -translate-y-6">
              <div className="mt-2 w-full flex justify-center">
                <StepForm onComplete={handleSaveProfile} />
              </div>
            </div>
            {/* Desktop: layout original */}
              <div className="hidden sm:flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <StepForm onComplete={handleSaveProfile} />
            </div>
          </>
        )}
        {nav === 'custom' && showSummary && customProfile && !isEditingProfile && (
          <div className="flex flex-col items-center justify-center flex-1 min-h-[calc(100vh-8rem)]">
            <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl"
                title={t('Editar perfil')}
                onClick={() => setIsEditingProfile(true)}
              >
                <FontAwesomeIcon icon={faPencil} size="lg" />
              </button>
              <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-6 text-center">{t('profileSummary.title')}</h2>
              <ul className="mb-6 space-y-2 text-gray-900 dark:text-gray-100">
                <li><b>{t('profileSummary.age')}:</b> {customProfile.age}</li>
                <li><b>{t('profileSummary.gender')}:</b> {mapGender(customProfile.gender)}</li>
                <li><b>{t('profileSummary.weight')}:</b> {customProfile.weight} kg</li>
                <li><b>{t('profileSummary.height')}:</b> {customProfile.height} cm</li>
                <li><b>{t('profileSummary.objective')}:</b> {customProfile.objective}</li>
                <li><b>{t('profileSummary.experience')}:</b> {mapExperience(customProfile.experience)}</li>
                <li><b>{t('profileSummary.trainingFrequency')}:</b> {mapFrequency(customProfile.frequency)}</li>
                <li><b>{t('profileSummary.mainSport')}:</b> {t(customProfile.sport)}</li>
                <li><b>{t('profileSummary.medicalConditions')}:</b> {customProfile.medicalConditions.join(', ') || t('profileSummary.none')}</li>
                <li><b>{t('profileSummary.allergies')}:</b> {customProfile.allergies.join(', ') || t('profileSummary.none')}</li>
                <li><b>{t('profileSummary.currentSupplements')}:</b> {customProfile.currentSupplements.join(', ') || t('profileSummary.none')}</li>
              </ul>
              <button
                onClick={handleGenerateReport}
                className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                disabled={generating}
              >
                {generating ? t('profileSummary.generatingButton') : t('profileSummary.generateButton')}
              </button>
            </div>
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
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 mt-4 mb-24 flex flex-col items-center" data-aos="fade-up" data-aos-delay="200">
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center mb-2" data-aos="zoom-in" data-aos-delay="300">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-4xl">👤</span>
              )}
            </div>
              <div className="text-center mb-4" data-aos="fade-up" data-aos-delay="400">
              <div className="font-bold text-lg text-gray-900 dark:text-gray-100">{user?.displayName || user?.email?.split('@')[0]}</div>
              <div className="text-gray-500 dark:text-gray-300 text-sm">{user?.email}</div>
            </div>
            {userProfile && (
                <ul className="w-full mb-6 space-y-2 text-gray-900 dark:text-gray-100 text-[15px]" data-aos="fade-up" data-aos-delay="500">
                  <li data-aos="fade-left" data-aos-delay="600"><b>{t('Edad')}:</b> {userProfile.age}</li>
                  <li data-aos="fade-left" data-aos-delay="700"><b>{t('Género')}:</b> {mapGender(userProfile.gender)}</li>
                  <li data-aos="fade-left" data-aos-delay="800"><b>{t('Peso')}:</b> {userProfile.weight} kg</li>
                  <li data-aos="fade-left" data-aos-delay="900"><b>{t('Altura')}:</b> {userProfile.height} cm</li>
                  <li data-aos="fade-left" data-aos-delay="1000"><b>{t('Objetivo')}:</b> {userProfile.objective}</li>
                  <li data-aos="fade-left" data-aos-delay="1100"><b>{t('Experiencia')}:</b> {mapExperience(userProfile.experience)}</li>
                  <li data-aos="fade-left" data-aos-delay="1200"><b>{t('Frecuencia de entrenamiento')}:</b> {mapFrequency(userProfile.frequency)}</li>
                  <li data-aos="fade-left" data-aos-delay="1300"><b>{t('Deporte principal')}:</b> {t(userProfile.sport)}</li>
                  <li data-aos="fade-left" data-aos-delay="1400"><b>{t('Condiciones médicas')}:</b> {userProfile.medicalConditions.join(', ') || t('Ninguna')}</li>
                  <li data-aos="fade-left" data-aos-delay="1500"><b>{t('Alergias')}:</b> {userProfile.allergies.join(', ') || t('Ninguna')}</li>
                  <li data-aos="fade-left" data-aos-delay="1600"><b>{t('Suplementos actuales')}:</b> {userProfile.currentSupplements.join(', ') || t('Ninguno')}</li>
              </ul>
            )}
            <button
              onClick={() => signOut(auth)}
              className="mt-auto w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow text-lg transition-all duration-200"
                data-aos="zoom-in"
                data-aos-delay="1700"
            >
                {t('Cerrar sesión')}
            </button>
          </div>
        )}
        </Suspense>
      </main>
      <Footer setNav={setNav} />
      {/* Bottom navigation bar solo visible en móvil */}
      <BottomNav nav={nav} setNav={setNav} user={user} onSignOut={() => signOut(auth)} />
    </div>
  );
}

export default App; 