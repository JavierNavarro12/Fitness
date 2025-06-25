import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { collection, doc, getDoc, getDocs, query, where, setDoc, deleteDoc } from 'firebase/firestore';
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
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import Switch from './components/shared/Switch';
import LanguageSwitch from './components/shared/LanguageSwitch';
import BottomNav from './components/layout/BottomNav';
import MobileMenu from './components/layout/MobileMenu';
import PersonalizedChatAI from './components/features/ia/PersonalizedChatAI';
import { saveUserToFirestore } from './components/features/auth/Auth';
import ProfileSummary from './components/layout/ProfileSummary';

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
  const [showSummary, setShowSummary] = useState(false);
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

  // Modal de login controlado
  const [showLogin, setShowLogin] = useState(false);

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
        await saveUserToFirestore(user);
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

  // Función para requerir login antes de acceder a secciones privadas
  const requireLogin = (navTarget: string) => {
    if (!user) {
      setShowLogin(true);
    } else {
      setNav(navTarget);
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
      setShowSummary(true);
      setNav('custom');
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
    }
  };

  if (showSplash) return <SplashScreen />;

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
            <button onClick={() => { setNav('home'); setShowSummary(false); }} className="focus:outline-none">
              <img src="/logo-header.png" alt="EGN Logo" className="hidden sm:block h-24 w-auto mr-4 -my-5" style={{ maxHeight: 96 }} />
              <img src="/logo-header.png" alt="EGN Logo" className="sm:hidden h-24 w-auto mr-4" style={{ maxHeight: 96 }} />
            </button>
            <nav className="ml-16">
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
                  onClick={() => setShowLogin(true)}
                >
                  {t('Iniciar sesión')}
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
          onClick={() => setNav('home')}
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
          setNav(navKey);
          setShowSummary(false);
          setMobileMenuOpen(false);
        }}
        menuItems={megaMenuItems}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(v => !v)}
        i18n={i18n}
        showLoginButton={!user}
        onLoginClick={() => { setShowLogin(true); setMobileMenuOpen(false); }}
      />

      {/* MODAL PERFIL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <ProfileSummary user={user} userProfile={userProfile} onLogout={handleLogout} />
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-2xl font-bold"
            onClick={() => setShowProfileModal(false)}
            style={{ right: 24, top: 24, zIndex: 10 }}
          >
            ×
          </button>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col container mx-auto px-4 pt-20 sm:pt-8 pb-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100" data-aos="fade-up" style={{ position: 'relative' }}>
        {(['custom', 'reports', 'profile'].includes(nav) && !user && !showLogin) ? (
          <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center animate-fade-in mx-auto flex flex-col items-center justify-center">
              <span className="block text-red-700 dark:text-red-300 font-extrabold text-2xl mb-6">
                {t('Debes iniciar sesión para acceder a esta sección.')}
              </span>
              <button
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-bold text-xl shadow-lg"
                onClick={() => setShowLogin(true)}
              >
                {t('Iniciar sesión')}
              </button>
            </div>
          </div>
        ) : (
          <Suspense fallback={<LoadingSpinner />}>
            {nav === 'home' && <HomePage onStart={() => requireLogin('custom')} />}
            {nav === 'deportes' && <Deportes itemToHighlight={searchResultToHighlight} onHighlightComplete={handleHighlightComplete} />}
            {nav === 'salud' && <Salud itemToHighlight={searchResultToHighlight} onHighlightComplete={handleHighlightComplete} />}
            {nav === 'grasa' && <Grasa itemToHighlight={searchResultToHighlight} onHighlightComplete={handleHighlightComplete} />}
            {nav === 'mujer' && <Mujer itemToHighlight={searchResultToHighlight} onHighlightComplete={handleHighlightComplete} />}
            {nav === 'cognitivo' && <Cognitivo itemToHighlight={searchResultToHighlight} onHighlightComplete={handleHighlightComplete} />}
            {nav === 'faq' && <FAQ setNav={setNav} />}
            {nav === 'terms' && <Terms />}
            {nav === 'privacy' && <Privacy />}
            {nav === 'contact' && <Contact />}
            {nav === 'custom' && !showSummary && !isEditingProfile && user && (
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
            {nav === 'reports' && user && (
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
            {nav === 'profile' && user && (
              <ProfileSummary user={user} userProfile={userProfile} onLogout={handleLogout} />
            )}
          </Suspense>
        )}
      </main>
      {/* Footer solo si no está en sección privada sin login */}
      {!( ['custom', 'reports', 'profile'].includes(nav) && !user && !showLogin ) && <Footer setNav={setNav} />}
      {/* Bottom navigation bar solo visible en móvil */}
      {!showLogin && (
        <BottomNav
          nav={nav}
          setNav={(navKey) => {
            setNav(navKey);
            setShowSummary(false);
          }}
          user={user}
          onSignOut={() => signOut(auth)}
        />
      )}
      
      {/* Chat IA Personalizado */}
      {nav !== 'profile' && (
        <PersonalizedChatAI userProfile={userProfile} mobileMenuOpen={mobileMenuOpen} />
      )}

      {/* Modal de login */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto">
          <div className="w-full max-w-sm px-2 sm:px-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-8 relative animate-fade-in">
              <Auth onAuthSuccess={(isInvitado) => {
                setShowLogin(false);
                if (!isInvitado) window.location.reload();
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 