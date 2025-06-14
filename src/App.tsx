import React, { useEffect, useState, useRef } from 'react';
import { collection, doc, getDoc, getDocs, query, where, setDoc, addDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { UserProfile, Report } from './types';
import Auth from './components/Auth';
import Home from './components/Home';
import StepForm from './components/StepForm';
import ReportView from './components/ReportView';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

const NAVS = [
  { key: 'home', label: 'Inicio' },
  { key: 'custom', label: 'Personalización' },
  { key: 'reports', label: 'Mis informes' },
];

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
          const reports = reportsSnapshot.docs.map(doc => doc.data() as Report);
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

    // Construye el prompt con los datos del usuario
    const prompt = `
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

      await addDoc(collection(db, 'reports'), newReport);
      setUserReports(prev => [newReport, ...prev]);
      setShowSummary(false);
      setNav('reports');
    } catch (error) {
      console.error('Error al generar el informe:', error);
    } finally {
      setGenerating(false);
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

  if (!user) {
    return <Auth onAuthSuccess={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-white shadow-md py-4 px-2 sticky top-0 z-40">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-3xl font-bold text-red-700 mb-2 md:mb-0">NutriMind</h1>
          <ul className="flex gap-2 md:gap-6 justify-center items-center">
            {NAVS.map(tab => (
              <li key={tab.key}>
                <button
                  className={`text-base md:text-lg font-semibold px-2 md:px-4 py-2 rounded transition-all duration-200 ${nav === tab.key ? 'bg-red-600 text-white shadow' : 'text-red-700 hover:bg-red-100'}`}
                  onClick={() => {
                    setNav(tab.key);
                    setShowSummary(false);
                    if (tab.key === 'custom') {
                      setCustomProfile(null);
                      setIsEditingProfile(false);
                    }
                  }}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="relative flex items-center gap-2" ref={userMenuRef}>
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setShowUserMenu((v) => !v)}
            >
              <span className="text-gray-700 font-semibold">{user?.displayName || user?.email?.split('@')[0]}</span>
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xl">👤</span>
                )}
              </div>
              <svg className="w-4 h-4 text-gray-500 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-50 animate-fade-in">
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700 rounded-t-lg"
                  onClick={() => { setShowProfileModal(true); setShowUserMenu(false); }}
                >
                  Ver perfil
                </button>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700 rounded-b-lg"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MODAL PERFIL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-2xl font-bold"
              onClick={() => setShowProfileModal(false)}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-red-700 mb-6 text-center">Mi Perfil</h2>
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-2">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-4xl">👤</span>
                )}
              </div>
              <span className="font-semibold text-lg text-gray-800">{user?.displayName || user?.email?.split('@')[0]}</span>
              <span className="text-gray-500 text-sm">{user?.email}</span>
            </div>
            {userProfile && (
              <ul className="space-y-2 text-gray-700">
                <li><b>Edad:</b> {userProfile.age}</li>
                <li><b>Género:</b> {userProfile.gender}</li>
                <li><b>Peso:</b> {userProfile.weight} kg</li>
                <li><b>Altura:</b> {userProfile.height} cm</li>
                <li><b>Objetivo:</b> {userProfile.objective}</li>
                <li><b>Experiencia:</b> {userProfile.experience}</li>
                <li><b>Frecuencia de entrenamiento:</b> {userProfile.frequency}</li>
                <li><b>Deporte principal:</b> {userProfile.sport}</li>
                <li><b>Condiciones médicas:</b> {userProfile.medicalConditions.join(', ') || 'Ninguna'}</li>
                <li><b>Alergias:</b> {userProfile.allergies.join(', ') || 'Ninguna'}</li>
                <li><b>Suplementos actuales:</b> {userProfile.currentSupplements.join(', ') || 'Ninguno'}</li>
              </ul>
            )}
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {nav === 'home' && (
          <Home onStart={() => setNav('custom')} />
        )}
        {nav === 'custom' && !showSummary && !isEditingProfile && (
          <StepForm onComplete={handleSaveProfile} />
        )}
        {nav === 'custom' && showSummary && customProfile && !isEditingProfile && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 mt-8 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl"
              title="Editar perfil"
              onClick={() => setIsEditingProfile(true)}
            >
              <FontAwesomeIcon icon={faPencil} size="lg" />
            </button>
            <h2 className="text-2xl font-bold text-red-700 mb-6 text-center">Resumen de tu perfil</h2>
            <ul className="mb-6 space-y-2">
              <li><b>Edad:</b> {customProfile.age}</li>
              <li><b>Género:</b> {mapGender(customProfile.gender)}</li>
              <li><b>Peso:</b> {customProfile.weight} kg</li>
              <li><b>Altura:</b> {customProfile.height} cm</li>
              <li><b>Objetivo:</b> {customProfile.objective}</li>
              <li><b>Experiencia:</b> {mapExperience(customProfile.experience)}</li>
              <li><b>Frecuencia de entrenamiento:</b> {mapFrequency(customProfile.frequency)}</li>
              <li><b>Deporte principal:</b> {customProfile.sport}</li>
              <li><b>Condiciones médicas:</b> {customProfile.medicalConditions.join(', ') || 'Ninguna'}</li>
              <li><b>Alergias:</b> {customProfile.allergies.join(', ') || 'Ninguna'}</li>
              <li><b>Suplementos actuales:</b> {customProfile.currentSupplements.join(', ') || 'Ninguno'}</li>
            </ul>
            <button
              onClick={handleGenerateReport}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg text-xl transition-all duration-200 w-full"
              disabled={generating}
            >
              {generating ? 'Generando informe...' : 'Generar informe'}
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
            <h2 className="text-2xl font-bold text-red-700 mb-6">Mis Informes</h2>
            {userReports.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                No tienes informes generados aún.
              </div>
            ) : (
              <div className="space-y-6">
                {userReports.map((report, index) => (
                  <ReportView key={index} report={report} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      <footer className="bg-gray-800 text-white p-6 mt-12">
        <div className="container mx-auto text-center">
          <p>© 2024 Fitness Supplements Advisor. Todos los derechos reservados.</p>
          <p className="text-sm text-gray-400 mt-2">
            Las recomendaciones son sugerencias generales. Consulta con un profesional de la salud antes de comenzar cualquier suplementación.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App; 