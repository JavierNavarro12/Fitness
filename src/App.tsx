import React, { useEffect, useState, useRef, lazy } from 'react';
import { collection, doc, getDoc, getDocs, query, where, setDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { UserProfile, Report } from './types';
import SplashScreen from './components/layout/SplashScreen';
import Footer from './components/layout/Footer';
import SearchPanel from './components/shared/SearchPanel';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { searchableContent } from './data/content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import Switch from './components/shared/Switch';
import LanguageSwitch from './components/shared/LanguageSwitch';
import BottomNav from './components/layout/BottomNav';
import MobileMenu from './components/layout/MobileMenu';
import PersonalizedChatAI from './components/features/ia/PersonalizedChatAI';
import ProfileSummary from './components/layout/ProfileSummary';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './components/features/pages/LoginPage';
import ScrollToTop from './components/layout/ScrollToTop';
import LoginRequired from './components/shared/LoginRequired';

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
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
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
  const navigate = useNavigate();
  const location = useLocation();

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
        // await saveUserToFirestore(user); // Si quieres guardar usuario aquí, descomenta
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
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
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
    navigate(result.category);
    setSearchResultToHighlight({ page: result.category, id: result.id });
    setSearchQuery('');
    setSearchResults([]);
    setShowProfileModal(false);
  };

  // Nueva función para requerir login y redirigir a /login
  const requireLogin = (navTarget: string) => {
    if (!user) {
      navigate(`/login?redirect=${navTarget}`);
    } else {
      navigate(navTarget);
    }
  };

  // Restaurar función para eliminar informes
  const handleDeleteReport = async (reportId: string) => {
    try {
      await deleteDoc(doc(db, 'reports', reportId));
      setUserReports(prev => prev.filter(r => r.id !== reportId));
    } catch (error) {
      console.error('Error al eliminar el informe.');
      console.error(error);
    }
  };

  // Restaurar función para guardar perfil
  const handleSaveProfile = async (profile: UserProfile) => {
    if (!user) return;
    try {
      const profileRef = doc(db, 'profiles', user.uid);
      await setDoc(profileRef, profile);
      setUserProfile(profile);
      navigate('/custom');
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
    }
  };

  if (location.pathname === '/login') {
    return <LoginPage />;
  }

  if (showSplash) return <SplashScreen />;

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col pb-20 sm:pb-0">
        {/* HEADER */}
        <header
          ref={headerRef}
          className="bg-white dark:bg-gray-900 sticky top-0 z-50 hidden sm:block"
        >
          <div className="max-w-7xl mx-auto flex items-center py-2 px-4" style={{ minHeight: NAVBAR_HEIGHT }}>
            {/* Izquierda: Logo y Nav */}
            <div className="flex items-center flex-shrink-0">
              <button onClick={() => { navigate('/'); }} className="focus:outline-none">
                <img src="/logo-header.png" alt="EGN Logo" className="hidden sm:block h-24 w-auto mr-4 -my-5" style={{ maxHeight: 96 }} />
                <img src="/logo-header.png" alt="EGN Logo" className="sm:hidden h-24 w-auto mr-4" style={{ maxHeight: 96 }} />
              </button>
              <nav className="flex justify-center w-full">
                <ul className="flex gap-8 items-center">
                  <li key="home" className="flex">
                    <button
                      className={`whitespace-nowrap text-sm md:text-lg font-semibold px-4 py-2 rounded transition-all duration-200 ${location.pathname === '/' ? 'bg-red-600 text-white shadow' : 'text-red-700 hover:bg-red-100'}`}
                      onClick={() => {
                        navigate('/');
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
                      {(() => {
                        // Rutas de categorías
                        const categoryPaths = ['/deportes', '/salud', '/grasa', '/mujer', '/cognitivo'];
                        const isCategoryActive = categoryPaths.some(path => location.pathname.startsWith(path));
                        return (
                          <button
                            ref={inicioBtnRef}
                            className={`whitespace-nowrap text-sm md:text-lg font-semibold px-4 py-2 rounded transition-all duration-200 ${isCategoryActive ? 'bg-red-600 text-white shadow' : 'text-red-700 hover:bg-red-100'}`}
                          >
                            {t('nav.categories')}
                          </button>
                        );
                      })()}
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
                                  onClick={() => { navigate(section.nav); setMegaMenuOpen(false); }}
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
                  {NAVS.filter(tab => tab.key !== 'home').map(tab => {
                    // Definir el path base para cada tab
                    const path = tab.key === 'custom' ? '/custom' : tab.key === 'reports' ? '/reports' : `/${tab.key}`;
                    const isActive = location.pathname.startsWith(path);
                    return (
                      <li key={tab.key} className="flex">
                        <button
                          className={`whitespace-nowrap text-sm md:text-lg font-semibold px-4 py-2 rounded transition-all duration-200 ${isActive ? 'bg-red-600 text-white shadow' : 'text-red-700 hover:bg-red-100'}`}
                          onClick={() => {
                            navigate(path);
                            if (tab.key === 'custom') {
                              setShowProfileModal(false);
                            }
                          }}
                        >
                          {t(tab.label)}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
            {/* Derecha: Búsqueda y Perfil */}
            <div className="flex items-center flex-1">
              <div className="flex-1 flex justify-center mr-8">
                <SearchPanel
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                  results={searchResults}
                  onResultClick={handleResultClick}
                  autoFocus={false}
                />
              </div>
              <div className="flex items-center justify-end min-w-[180px] absolute right-0 top-0 h-full pr-12" ref={userMenuRef} style={{ position: 'absolute', right: 0, top: 0, height: '100%', paddingRight: 48 }}>
                {user ? (
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
                ) : (
                  <button
                    className="ml-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow transition text-base"
                    onClick={() => navigate('/login')}
                  >
                    {t('loginRequired.loginButton')}
                  </button>
                )}
                {showUserMenu && (
                  <div className="absolute top-full mt-2 right-0 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 overflow-hidden z-50 animate-fade-in">
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
          <button
            className="focus:outline-none"
            onClick={() => navigate('/')}
          >
            <img src="/logo-header.png" alt="EGN Logo" className="h-24 w-auto" style={{ maxHeight: 96 }} />
          </button>
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
                autoFocus={true}
              />
          </div>
        )}

        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          onNavigate={(navKey) => {
            navigate(navKey);
            setShowProfileModal(false);
            setMobileMenuOpen(false);
          }}
          menuItems={megaMenuItems}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(v => !v)}
          i18n={i18n}
          showLoginButton={!user}
          onLoginClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
        />

        {/* MODAL PERFIL */}
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <ProfileSummary user={user} userProfile={userProfile} onLogout={handleLogout} onClose={() => setShowProfileModal(false)} />
          </div>
        )}

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 flex flex-col container mx-auto px-4 pt-20 sm:pt-8 pb-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-[calc(100vh-80px)]" data-aos="fade-up" style={{ position: 'relative' }}>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<HomePage onStart={() => requireLogin('custom')} />} />
            <Route path="/deportes" element={<Deportes itemToHighlight={searchResultToHighlight} onHighlightComplete={handleHighlightComplete} />} />
            <Route path="/salud" element={<Salud itemToHighlight={searchResultToHighlight} onHighlightComplete={handleHighlightComplete} />} />
            <Route path="/grasa" element={<Grasa itemToHighlight={searchResultToHighlight} onHighlightComplete={handleHighlightComplete} />} />
            <Route path="/mujer" element={<Mujer itemToHighlight={searchResultToHighlight} onHighlightComplete={handleHighlightComplete} />} />
            <Route path="/cognitivo" element={<Cognitivo itemToHighlight={searchResultToHighlight} onHighlightComplete={handleHighlightComplete} />} />
            <Route path="/faq" element={<FAQ setNav={setNav} />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Rutas protegidas */}
            <Route path="/custom" element={<StepForm onComplete={handleSaveProfile} user={user} />} />
            <Route path="/reports" element={
              user ? (
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
              ) : (
                <LoginRequired sectionName="Informes" />
              )
            } />
            <Route path="/profile" element={
              user ? (
                <ProfileSummary user={user} userProfile={userProfile} onLogout={handleLogout} onClose={() => navigate('/')} />
              ) : (
                <LoginRequired sectionName="Perfil" />
              )
            } />
          </Routes>
        </main>
        {/* Footer solo si no está en sección privada sin login */}
        {!( ['custom', 'reports', 'profile'].includes(nav) && !user ) && <Footer />}
        {/* Bottom navigation bar solo visible en móvil */}
        <BottomNav
          user={user}
          onSignOut={() => signOut(auth)}
        />
        
        {/* Chat IA Personalizado */}
        {location.pathname !== '/profile' && !showProfileModal && (
          <PersonalizedChatAI userProfile={userProfile} mobileMenuOpen={mobileMenuOpen} />
        )}
      </div>
    </>
  );
}

export default App; 