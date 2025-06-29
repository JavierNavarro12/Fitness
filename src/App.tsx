import React, { useEffect, useState, useRef, lazy, startTransition } from 'react';
import { collection, doc, getDoc, getDocs, query, where, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
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
import ReportAccordionList from './components/features/reports/ReportAccordionList';
import Loader from './components/shared/Loader';

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
  const [customProfile, setCustomProfile] = useState<UserProfile | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    // Inicializar AOS solo si no estamos en test
    if (process.env.NODE_ENV !== 'test') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
      });
    }

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showMobileSearch) return;
      // Si el menú está abierto y el click es fuera del menú, ciérralo
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
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
    startTransition(() => navigate(result.category));
    setSearchResultToHighlight({ page: result.category, id: result.id });
    setSearchQuery('');
    setSearchResults([]);
    setShowProfileModal(false);
  };

  // Nueva función para requerir login y redirigir a /login
  const requireLogin = (navTarget: string) => {
    // Navegar directamente a la sección, el componente LoginRequired se encargará de mostrar el mensaje de login
    startTransition(() => navigate(`/${navTarget}`));
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
      setCustomProfile(profile);
      setShowSummary(true);
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
    }
  };

  // Restaurar función para generar informes
  const handleGenerateReport = async () => {
    if (!user || !customProfile) return;
    
    setGenerating(true);
    
    const prompt = i18n.language === 'en' 
      ? `
You are a sports supplementation expert. Generate a personalized report for a user with the following profile:

**Physical Profile:**
- Age: ${customProfile.age} years
- Gender: ${customProfile.gender}
- Weight: ${customProfile.weight} kg
- Height: ${customProfile.height} cm
- Objective: ${customProfile.objective}
- Experience Level: ${customProfile.experience}
- Training Frequency: ${customProfile.frequency}
- Main Sport: ${t(customProfile.sport)}
- Medical Conditions: ${customProfile.medicalConditions.join(', ') || 'None'}
- Allergies: ${customProfile.allergies.join(', ') || 'None'}
- Current Supplements: ${customProfile.currentSupplements.join(', ') || 'None'}

Based on this profile, provide a comprehensive supplementation plan.

For each recommended supplement, specify:
- The recommended daily dose (in grams, milligrams, capsules, etc)
- The best time of day to take it (e.g., before/after training, breakfast, night, etc)
- Any important usage recommendations or warnings

The format for each supplement should be:
- **Supplement Name**  
  - Recommended dose: X  
  - Timing: Y  
  - Notes: Z

Do not repeat the profile summary, only the report and the product list.
The report must be clear, professional, and easy to read.

Provide a detailed report in Spanish with the following sections in Markdown format:
1.  **Introducción Personalizada**: Brief and motivating introduction.
2.  **Suplementos Base (Fundamentales)**: Recommended supplements regardless of the goal (e.g., protein, creatine, Omega-3), explaining why for this user, and for each, specify dose, timing, and notes as above.
3.  **Suplementos para tu Objetivo (${customProfile.objective})**: Specific supplements for the user's goal, with dose, timing, and notes.
4.  **Suplementos para tu Deporte (${t(customProfile.sport)})**: Specific supplements for the user's sport, with dose, timing, and notes.
5.  **Consideraciones Adicionales**: Health warnings, importance of diet, etc.
6.  **Resumen y Siguientes Pasos**: Final summary and recommendations.

Finally, add a separate section with the title '### Recommended Products' and under it, a bulleted list of 3-5 specific products (e.g., 'Whey Protein - Optimum Nutrition Gold Standard Whey'). Do not add links, just the text.
`
      : `
Eres un experto en suplementación deportiva. Genera un informe personalizado para un usuario con el siguiente perfil:

**Perfil Físico:**
- Edad: ${customProfile.age} años
- Género: ${customProfile.gender}
- Peso: ${customProfile.weight} kg
- Altura: ${customProfile.height} cm
- Objetivo: ${customProfile.objective}
- Nivel de experiencia: ${customProfile.experience}
- Frecuencia de entrenamiento: ${customProfile.frequency}
- Deporte principal: ${t(customProfile.sport)}
- Condiciones médicas: ${customProfile.medicalConditions.join(', ') || 'Ninguna'}
- Alergias: ${customProfile.allergies.join(', ') || 'Ninguna'}
- Suplementos actuales: ${customProfile.currentSupplements.join(', ') || 'Ninguno'}

Basándote en este perfil, proporciona un plan de suplementación completo.

Para cada suplemento recomendado, indica:
- La dosis diaria recomendada (en gramos, miligramos, cápsulas, etc)
- El mejor momento del día para tomarlo (por ejemplo: antes/después de entrenar, desayuno, noche, etc)
- Observaciones o advertencias importantes de uso

El formato para cada suplemento debe ser:
- **Nombre del suplemento**  
  - Dosis recomendada: X  
  - Momento de toma: Y  
  - Observaciones: Z

No repitas el resumen del perfil, solo el informe y la lista de productos.
El informe debe ser claro, profesional y fácil de leer.

Proporciona un informe detallado en español con las siguientes secciones en formato Markdown:
1.  **Introducción Personalizada**: Introducción breve y motivadora.
2.  **Suplementos Base (Fundamentales)**: Suplementos recomendados independientemente del objetivo (ej. proteína, creatina, Omega-3), explicando el porqué para este usuario, y para cada uno, especifica dosis, momento y observaciones como arriba.
3.  **Suplementos para tu Objetivo (${customProfile.objective})**: Suplementos específicos para el objetivo del usuario, con dosis, momento y observaciones.
4.  **Suplementos para tu Deporte (${t(customProfile.sport)})**: Suplementos específicos para el deporte del usuario, con dosis, momento y observaciones.
5.  **Consideraciones Adicionales**: Advertencias de salud, importancia de la dieta, etc.
6.  **Resumen y Siguientes Pasos**: Resumen final y recomendaciones.

Finalmente, añade una sección separada con el título '### Productos Recomendados' y, debajo, una lista de viñetas con 3-5 productos específicos (ej. 'Proteína en Polvo - Optimum Nutrition Gold Standard Whey'). No añadas enlaces, solo el texto.
`;

    try {
      const response = await fetch('/.netlify/functions/openai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const reportContent = data.reply || 'Error: No se pudo generar el contenido del reporte.';

      // --- Lógica para parsear enlaces ---
      let finalReportContent = reportContent;
      const productSectionRegex = /###\s*(Productos Recomendados|Recommended Products)[\s\S]*/;
      const productSectionMatch = reportContent.match(productSectionRegex);

      if (productSectionMatch) {
        // Extrae solo el contenido de la sección de productos
        const productsBlock = productSectionMatch[0];
        const productLines = productsBlock.split('\n').slice(1); // Omitir el título de la sección

        const productLinks = productLines
          .map((line: string) => {
            // Limpiar la línea para obtener solo el nombre del producto
            const productName = line.replace(/[-\s*]/g, '').trim();
            if (productName) {
              const searchUrl = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(productName)}`;
              return `- [${productName}](${searchUrl})`;
            }
            return null;
          })
          .filter(Boolean)
          .join('\n');
        
        if (productLinks) {
            const linkTitle = i18n.language === 'en' ? '### Product Links' : '### Enlaces a Productos Recomendados';
            finalReportContent += `\n\n${linkTitle}\n${productLinks}`;
        }
      }
      // --- Fin de la lógica ---

      const newReport = {
        userId: user.uid,
        profile: customProfile,
        content: finalReportContent, // Guardamos el contenido con los enlaces añadidos
        createdAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(collection(db, 'reports'), newReport);
      setUserReports(prev => [{ id: docRef.id, ...newReport }, ...prev]);
      setGenerating(false);
      startTransition(() => navigate('/reports', { state: { expandId: docRef.id } }));

    } catch (error) {
      console.error("Error generating report:", error);
      // Opcional: guardar un reporte de error en Firebase
      const errorReport = {
        userId: user.uid,
        profile: customProfile,
        content: `Error al generar el reporte: ${error instanceof Error ? error.message : String(error)}`,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, 'reports'), errorReport);
      setUserReports(prev => [{ id: docRef.id, ...errorReport }, ...prev]);
    }

    setGenerating(false);
  };

  useEffect(() => {
    if (location.pathname === '/custom') {
      setCustomProfile(null);
      setShowSummary(false);
      setIsEditingProfile(false);
    }
  }, [location.pathname]);

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
              <button onClick={() => { startTransition(() => navigate('/')); }} className="focus:outline-none">
                <picture className="hidden sm:block">
                  <source srcSet="/logo-header.webp" type="image/webp" />
                  <img src="/logo-header.png" alt="EGN Logo" className="h-24 w-auto mr-4 -my-5" style={{ maxHeight: 96 }} width="96" height="96" />
                </picture>
                <picture className="sm:hidden">
                  <source srcSet="/logo-header-96.webp" type="image/webp" />
                  <img src="/logo-header.png" alt="EGN Logo" className="h-24 w-auto mr-4" style={{ maxHeight: 96 }} width="96" height="96" loading="eager" />
                </picture>
              </button>
              <nav className="flex justify-center w-full ml-20">
              <ul className="flex gap-8 items-center">
                <li key="home" className="flex">
                  <button
                      className={`whitespace-nowrap text-sm md:text-lg font-semibold px-4 py-2 rounded transition-all duration-200 ${location.pathname === '/' ? 'bg-red-600 text-white shadow' : 'text-red-700 hover:bg-red-100'}`}
                    onClick={() => {
                        startTransition(() => navigate('/'));
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
                                  onClick={() => { startTransition(() => navigate(section.nav)); setMegaMenuOpen(false); }}
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
                            startTransition(() => navigate(path));
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
            <div className="flex items-center flex-1 justify-between gap-4">
              <div className="flex-1 flex justify-center ml-2 mr-8 max-lg:hidden">
            <SearchPanel
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              results={searchResults}
              onResultClick={handleResultClick}
                  autoFocus={false}
            />
              </div>
              <div className="flex items-center justify-end gap-2">
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
                    className="ml-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow transition text-base max-lg:px-2 max-lg:py-1 max-lg:text-sm"
                    onClick={() => startTransition(() => navigate('/login'))}
                  >
                    {t('loginRequired.loginButton')}
                  </button>
                )}
              {showUserMenu && (
                <>
                  {/* Overlay visual, pero el cierre lo gestiona el event listener global */}
                  <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40 pointer-events-none"
                  ></div>
                  <div ref={userMenuRef} className="absolute top-full mt-0 right-0 mr-4 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 overflow-hidden z-50 animate-fade-in">
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
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Header móvil fijo */}
      <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow z-40 flex items-center justify-between h-14 sm:hidden px-6">
          <button
            className="focus:outline-none"
            onClick={() => startTransition(() => navigate('/'))}
        >
            <span className="text-3xl font-bold text-red-600 tracking-tight">EGN</span>
          </button>
        <div className="flex items-center gap-4">
            <button onClick={() => setShowMobileSearch(v => !v)} className="text-gray-600 dark:text-gray-300">
                <SearchIcon className="h-6 w-6" />
            </button>
            <button onClick={() => setMobileMenuOpen(true)} className="text-gray-600 dark:text-gray-300" data-testid="hamburger-menu">
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
            startTransition(() => navigate(navKey));
            setShowProfileModal(false);
            setMobileMenuOpen(false);
          }}
        menuItems={megaMenuItems}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(v => !v)}
        i18n={i18n}
          showLoginButton={!user}
          onLoginClick={() => { startTransition(() => navigate('/login')); setMobileMenuOpen(false); }}
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
            <Route path="/custom" element={
              user ? (
                <>
                  {(isEditingProfile || (!showSummary && !isEditingProfile)) && (
                    <div className="flex flex-1 flex-col items-center justify-center min-h-[calc(100vh-136px)] sm:hidden -mt-16">
                      <div className="mt-2 w-full flex justify-center">
                        <StepForm
                          onComplete={isEditingProfile ? (profile) => {
                            setCustomProfile(profile);
                            setIsEditingProfile(false);
                            setShowSummary(true);
                          } : handleSaveProfile}
                          initialProfile={isEditingProfile ? customProfile : undefined}
                          isEditing={isEditingProfile}
                          user={user}
                        />
                      </div>
                    </div>
                  )}
                  {(isEditingProfile || (!showSummary && !isEditingProfile)) && (
                    <div className="hidden sm:flex items-center justify-center min-h-[calc(100vh-8rem)] -mt-16">
                      <StepForm
                        onComplete={isEditingProfile ? (profile) => {
                          setCustomProfile(profile);
                          setIsEditingProfile(false);
                          setShowSummary(true);
                        } : handleSaveProfile}
                        initialProfile={isEditingProfile ? customProfile : undefined}
                        isEditing={isEditingProfile}
                        user={user}
                      />
                    </div>
                  )}
                  {showSummary && customProfile && !isEditingProfile && (
                    <div className="flex flex-col items-center justify-center flex-1 min-h-[calc(100vh-8rem)]">
                      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 relative">
                        <button
                          className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl"
                          title={t('profileSummary.title')}
                          onClick={() => startTransition(() => setIsEditingProfile(true))}
                        >
                          <span className="-scale-x-100 inline-block">✏️</span>
                        </button>
                        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-6">{t('profileSummary.title')}</h2>
                        <ul className="space-y-2 mb-8 text-gray-700 dark:text-gray-300">
                          <li><b>{t('profileSummary.age')}:</b> {customProfile.age} {t('profileSummary.years')}</li>
                          <li><b>{t('profileSummary.gender')}:</b> {t('gender.' + customProfile.gender)}</li>
                          <li><b>{t('profileSummary.weight')}:</b> {customProfile.weight} {t('profileSummary.kg')}</li>
                          <li><b>{t('profileSummary.height')}:</b> {customProfile.height} cm</li>
                          <li><b>{t('profileSummary.objective')}:</b> {customProfile.objective}</li>
                          <li><b>{t('profileSummary.experience')}:</b> {t('experience.' + customProfile.experience)}</li>
                          <li><b>{t('profileSummary.trainingFrequency')}:</b> {t('frequency.' + customProfile.frequency)}</li>
                          <li><b>{t('profileSummary.mainSport')}:</b> {t(customProfile.sport)}</li>
                          <li><b>{t('profileSummary.medicalConditions')}:</b> {customProfile.medicalConditions.length ? customProfile.medicalConditions.join(', ') : t('profileSummary.none')}</li>
                          <li><b>{t('profileSummary.allergies')}:</b> {customProfile.allergies.length ? customProfile.allergies.join(', ') : t('profileSummary.none')}</li>
                          <li><b>{t('profileSummary.currentSupplements')}:</b> {customProfile.currentSupplements.length ? customProfile.currentSupplements.join(', ') : t('profileSummary.none')}</li>
                        </ul>
                        {generating && (
                          <div className="flex justify-center items-center py-8">
                            <Loader />
                          </div>
                        )}
                        <button
                          onClick={handleGenerateReport}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-2xl shadow-lg transition-all duration-300 text-lg mt-2 disabled:bg-red-400 disabled:cursor-not-allowed"
                          disabled={generating}
                        >
                          {generating ? t('profileSummary.generatingButton') : t('profileSummary.generateButton')}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <LoginRequired sectionName="Personalización" />
              )
            } />
            <Route path="/reports" element={
              user ? (
          <div className="max-w-4xl mx-auto">
            {userReports.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                {t('No tienes informes generados aún.')}
              </div>
            ) : (
              <ReportAccordionList
                reports={userReports}
                onDelete={handleDeleteReport}
                initialExpandedId={location.state?.expandId}
              />
            )}
          </div>
              ) : (
                <LoginRequired sectionName="Informes" />
              )
            } />
            <Route path="/profile" element={
              user ? (
                <ProfileSummary user={user} userProfile={userProfile} onLogout={handleLogout} onClose={() => startTransition(() => navigate('/'))} />
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