import React, { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import StepForm from './components/StepForm';
import ChatAI from './components/ChatAI';
import Auth from './components/Auth';
import { UserProfile, UserAccount } from './types';

const NAVS = [
  { key: 'welcome', label: 'Bienvenida' },
  { key: 'reports', label: 'Mis informes' },
  { key: 'profile', label: 'Mi perfil' },
];

function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nutrimind_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [showWelcome, setShowWelcome] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [nav, setNav] = useState('welcome');
  const [user, setUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('nutrimind_user');
    return saved ? JSON.parse(saved) : { firstName: '', lastName: '', email: '', photo: '' };
  });

  const [reports, setReports] = useState<{date: string, content: string}[]>(() => {
    const savedUser = localStorage.getItem('nutrimind_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const savedReports = localStorage.getItem(`nutrimind_reports_${userData.email}`);
      return savedReports ? JSON.parse(savedReports) : [];
    }
    return [];
  });

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('nutrimind_user_loggedin');
  });

  // Guardar informes en localStorage cada vez que cambian
  useEffect(() => {
    if (user.email) {
      localStorage.setItem(`nutrimind_reports_${user.email}`, JSON.stringify(reports));
    }
  }, [reports, user.email]);

  // Guardar perfil en localStorage cuando se edita
  useEffect(() => {
    if (profile) {
      localStorage.setItem('nutrimind_profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('nutrimind_profile');
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('nutrimind_user', JSON.stringify(user));
  }, [user]);

  const handleProfileComplete = (completedProfile: UserProfile) => {
    setProfile(completedProfile);
    localStorage.setItem('nutrimind_profile', JSON.stringify(completedProfile));
    setNav('welcome');
  };

  const handleStart = () => {
    setShowWelcome(false);
    setProfile(null);
    localStorage.removeItem('nutrimind_profile');
    setNav('welcome');
  };

  const handleGenerateReport = async () => {
    if (!profile) return;
    setShowModal(true);
    setLoading(true);
    setReport('');
    setError('');
    setCopied(false);
    const prompt = `Eres un experto en suplementación deportiva. Genera un informe personalizado y profesional para el siguiente perfil de usuario.\n\nPerfil:\nEdad: ${profile.age}\nGénero: ${profile.gender}\nPeso: ${profile.weight} kg\nAltura: ${profile.height} cm\nDeporte: ${profile.sport}\nNivel de experiencia: ${profile.experience}\nFrecuencia de entrenamiento: ${profile.trainingFrequency}\nObjetivos: ${Array.isArray(profile.goals) ? (profile.goals.length > 0 ? profile.goals.join(', ') : 'No especificado') : (profile.goals || 'No especificado')}\nRestricciones alimentarias: ${Array.isArray(profile.dietaryRestrictions) ? (profile.dietaryRestrictions.length > 0 ? profile.dietaryRestrictions.join(', ') : 'Ninguna') : (profile.dietaryRestrictions || 'Ninguna')}\nCondiciones médicas: ${Array.isArray(profile.medicalConditions) ? (profile.medicalConditions.length > 0 ? profile.medicalConditions.join(', ') : 'Ninguna') : (profile.medicalConditions || 'Ninguna')}\n\nEl informe debe ser claro, profesional y adaptado a este perfil. Incluye recomendaciones de suplementación, consejos de uso y advertencias si es necesario.`;
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
      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        setReport(data.choices[0].message.content.trim());
        setReports(prev => [{date: new Date().toLocaleString(), content: data.choices[0].message.content.trim()}, ...prev]);
        setNav('reports');
      } else if (data.error && data.error.message) {
        setError(data.error.message);
      } else {
        setError('No se pudo generar el informe.');
      }
    } catch (e) {
      setError('Ocurrió un error al conectar con la IA.');
    }
    setLoading(false);
  };

  const handleCopy = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Manejar login/registro exitoso
  const handleAuthSuccess = (userData: { firstName: string; lastName: string; email: string; photo?: string }) => {
    setUser(userData);
    localStorage.setItem('nutrimind_user', JSON.stringify(userData));
    localStorage.setItem('nutrimind_user_loggedin', 'true');
    setIsLoggedIn(true);
  };

  // Log out
  const handleLogout = () => {
    setUser({ firstName: '', lastName: '', email: '', photo: '' });
    localStorage.removeItem('nutrimind_user');
    localStorage.removeItem('nutrimind_user_loggedin');
    setIsLoggedIn(false);
    setReports([]);
    setNav('welcome');
  };

  return (
    <>
      {!isLoggedIn ? (
        <Auth onAuthSuccess={handleAuthSuccess} />
      ) : (
        <div className="min-h-screen flex flex-col bg-gray-100">
          {/* NAVBAR */}
          <nav className="bg-white shadow-md py-4 px-2 sticky top-0 z-40">
            <div className="container mx-auto flex flex-col items-center relative">
              <h1 className="text-3xl font-bold text-red-700 mb-2 text-center">NutriMind</h1>
              <ul className="flex gap-8 justify-center items-center">
                {NAVS.map(tab => (
                  <li key={tab.key}>
                    <button
                      className={`text-lg font-semibold px-4 py-2 rounded transition-all duration-200 ${nav === tab.key ? 'bg-red-600 text-white shadow' : 'text-red-700 hover:bg-red-100'}`}
                      onClick={() => setNav(tab.key)}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
              {/* Foto de perfil y menú a la derecha */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 hover:bg-red-50 p-2 rounded-lg transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      {user.photo ? (
                        <img src={user.photo} alt="Foto de perfil" className="w-full h-full object-cover" />
                      ) : (
                        <span className="flex items-center justify-center w-full h-full text-gray-400 text-xl">👤</span>
                      )}
                    </div>
                    <span className="text-red-700 font-semibold">{user.firstName}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <button
                        onClick={() => { setNav('profile'); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50"
                      >
                        Ver perfil
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>

          <main className="flex-1 container mx-auto py-8">
            {/* BIENVENIDA Y FORMULARIO */}
            {nav === 'welcome' && (
              showWelcome ? (
                <Welcome onStart={handleStart} />
              ) : !profile ? (
                <StepForm onComplete={handleProfileComplete} />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[40vh]">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-8 flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-red-700 mb-6">Resumen de tu perfil</h2>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div>
                        <p className="text-gray-600">Edad</p>
                        <p className="font-semibold">{profile.age} años</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Género</p>
                        <p className="font-semibold">
                          {profile.gender === 'male' ? 'Masculino' : profile.gender === 'female' ? 'Femenino' : 'Otro'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Peso</p>
                        <p className="font-semibold">{profile.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Altura</p>
                        <p className="font-semibold">{profile.height} cm</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Deporte</p>
                        <p className="font-semibold">{profile.sport}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Nivel de experiencia</p>
                        <p className="font-semibold">
                          {profile.experience === 'beginner' ? 'Principiante' : profile.experience === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-600">Frecuencia de entrenamiento</p>
                        <p className="font-semibold">{
                          profile.trainingFrequency === 'low' ? 'Baja (1-2 veces/semana)' :
                          profile.trainingFrequency === 'medium' ? 'Media (3-4 veces/semana)' : 'Alta (5+ veces/semana)'
                        }</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-600">Objetivos</p>
                        <p className="font-semibold">{Array.isArray(profile.goals) ? (profile.goals.length > 0 ? profile.goals.join(', ') : 'No especificado') : (profile.goals || 'No especificado')}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-600">Restricciones alimentarias</p>
                        <p className="font-semibold">{Array.isArray(profile.dietaryRestrictions) ? (profile.dietaryRestrictions.length > 0 ? profile.dietaryRestrictions.join(', ') : 'Ninguna') : (profile.dietaryRestrictions || 'Ninguna')}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-600">Condiciones médicas</p>
                        <p className="font-semibold">{Array.isArray(profile.medicalConditions) ? (profile.medicalConditions.length > 0 ? profile.medicalConditions.join(', ') : 'Ninguna') : (profile.medicalConditions || 'Ninguna')}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleGenerateReport}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg text-2xl transition-all duration-200 mb-2 w-full"
                    >
                      Generar informe personalizado
                    </button>
                  </div>
                  {/* Modal para el informe personalizado */}
                  {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-fade-in">
                        <button
                          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-600 font-bold"
                          onClick={() => setShowModal(false)}
                        >
                          ×
                        </button>
                        <h3 className="text-2xl font-bold mb-4 text-red-700">Informe Personalizado</h3>
                        {loading && (
                          <div className="text-center text-gray-500 py-12">Generando informe... <span className="animate-pulse">⏳</span></div>
                        )}
                        {error && (
                          <div className="text-center text-red-600 py-8">{error}</div>
                        )}
                        {report && !loading && !error && (
                          <div>
                            <pre className="whitespace-pre-wrap text-gray-800 bg-gray-50 rounded-lg p-4 max-h-[50vh] overflow-y-auto border mb-4">{report}</pre>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleCopy(report)}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition"
                              >
                                {copied ? '¡Copiado!' : 'Copiar informe'}
                              </button>
                              <button
                                onClick={() => {
                                  const printWindow = window.open('', '', 'width=800,height=600');
                                  printWindow?.document.write(`
                                    <html>
                                      <head>
                                        <title>Informe Personalizado</title>
                                        <style>
                                          body { font-family: Arial, sans-serif; padding: 40px; }
                                          pre { white-space: pre-wrap; word-break: break-word; }
                                        </style>
                                      </head>
                                      <body>
                                        <h2>Informe Personalizado</h2>
                                        <pre>${report.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
                                      </body>
                                    </html>
                                  `);
                                  printWindow?.document.close();
                                  printWindow?.print();
                                }}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-2 rounded-lg transition"
                              >
                                Descargar PDF
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
            {/* MIS INFORMES */}
            {nav === 'reports' && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-red-700 mb-6 text-center">Mis informes</h2>
                {reports.length === 0 ? (
                  <div className="text-center text-gray-500">Aún no has generado ningún informe.</div>
                ) :
                  <div className="space-y-6">
                    {reports.map((r, i) => (
                      <div key={i} className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-500 text-sm">{r.date}</span>
                          <button
                            onClick={() => handleCopy(r.content)}
                            className="text-red-600 hover:underline text-sm font-semibold"
                          >
                            {copied ? '¡Copiado!' : 'Copiar'}
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap text-gray-800 bg-gray-50 rounded-lg p-4 max-h-[40vh] overflow-y-auto border mb-2">{r.content}</pre>
                        <button
                          onClick={() => {
                            const printWindow = window.open('', '', 'width=800,height=600');
                            printWindow?.document.write(`
                              <html>
                                <head>
                                  <title>Informe Personalizado</title>
                                  <style>
                                    body { font-family: Arial, sans-serif; padding: 40px; }
                                    pre { white-space: pre-wrap; word-break: break-word; }
                                  </style>
                                </head>
                                <body>
                                  <h2>Informe Personalizado</h2>
                                  <pre>${r.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
                                </body>
                              </html>
                            `);
                            printWindow?.document.close();
                            printWindow?.print();
                          }}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-2 rounded-lg transition"
                        >
                          Descargar PDF
                        </button>
                      </div>
                    ))}
                  </div>
                }
              </div>
            )}
            {/* MI PERFIL */}
            {nav === 'profile' && (
              <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-red-700 mb-6 text-center">Mi perfil</h2>
                <form className="flex flex-col items-center gap-6" onSubmit={e => { e.preventDefault(); localStorage.setItem('nutrimind_user', JSON.stringify(user)); }}>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-2">
                      {user.photo ? (
                        <img src={user.photo} alt="Foto de perfil" className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-gray-400 text-4xl">👤</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = ev => {
                            setUser((u: UserAccount) => ({ ...u, photo: ev.target?.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 mb-1">Nombre</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        value={user.firstName}
                        onChange={e => setUser((u: UserAccount) => ({ ...u, firstName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Apellidos</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        value={user.lastName}
                        onChange={e => setUser((u: UserAccount) => ({ ...u, lastName: e.target.value }))}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-600 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full border rounded-lg p-2"
                        value={user.email}
                        onChange={e => setUser((u: UserAccount) => ({ ...u, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow transition-all duration-200 w-full mt-4"
                  >
                    Guardar perfil
                  </button>
                </form>
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
          <ChatAI />
        </div>
      )}
    </>
  );
}

export default App; 