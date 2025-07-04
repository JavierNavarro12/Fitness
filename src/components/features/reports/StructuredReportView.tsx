import React from 'react';
import { Report } from '../../../types';

interface StructuredReportViewProps {
  report: Report;
}

interface SupplementInfo {
  name: string;
  category?: string;
  dosage?: string;
  timing?: string;
  interactions?: string;
  notes?: string;
  image?: string;
}

// Función para parsear el contenido del informe y extraer información estructurada
function parseReportContent(content: string): {
  supplements: SupplementInfo[];
  additionalNotes: string[];
} {
  const supplements: SupplementInfo[] = [];
  const additionalNotes: string[] = [];

  // Buscar secciones de suplementos - tanto formato nuevo (##) como antiguo (**Nombre**)
  let supplementSections: string[] = [];

  // Intentar formato nuevo primero (##)
  const newFormatSections = content.split(/(?=##\s+(?![#])[^#\n]+)/);
  if (newFormatSections.length > 1) {
    supplementSections = newFormatSections;
  } else {
    // Formato antiguo con **Nombre del Suplemento**
    supplementSections = content.split(/(?=\*\*[^*\n]+\*\*)/);
  }

  for (const section of supplementSections) {
    const lines = section
      .split('\n')
      .map(line => line.trim())
      .filter(line => line);
    if (lines.length === 0) continue;

    const supplement: SupplementInfo = { name: '' };

    // Extraer nombre del suplemento - tanto formato nuevo como antiguo
    const titleLine = lines.find(
      line => line.startsWith('##') || /^\*\*[^*]+\*\*/.test(line)
    );
    if (titleLine) {
      if (titleLine.startsWith('##')) {
        supplement.name = titleLine.replace(/^##\s*/, '').trim();
      } else {
        supplement.name = titleLine.replace(/^\*\*|\*\*$/g, '').trim();
      }
    }

    // Si no hay nombre, saltar esta sección
    if (!supplement.name) continue;

    // Excluir secciones que no son suplementos - lista expandida
    const excludedSections = [
      'notas adicionales',
      'additional notes',
      'conclusión',
      'conclusion',
      'resumen',
      'summary',
      'importante',
      'important',
      'consideraciones',
      'considerations',
      'recomendaciones generales',
      'general recommendations',
      'introducción personalizada',
      'introduction',
      'suplementos para ganancia de masa muscular',
      'suplementos para pérdida de peso',
      'suplementos para rendimiento',
      'suplementos para crossfit',
      'suplementos para resistencia',
      'suplementos específicos para resistencia',
      'suplementos para tu deporte',
      'notas para principiantes',
      'notas para nivel intermedio',
      'notas para nivel avanzado',
      'productos recomendados',
      'enlaces a productos',
      'product links',
    ];

    if (
      excludedSections.some(excluded =>
        supplement.name.toLowerCase().includes(excluded)
      )
    ) {
      continue;
    }

    // Parsing optimizado para el formato específico de nuestro AIService
    const originalLines = section
      .split('\n')
      .map(line => line.trim())
      .filter(line => line);

    // Buscar dosis - formato específico "Dosis recomendada: X"
    const dosagePatterns = [
      /^Dosis\s+recomendada:\s*(.+)$/i,
      /^Recommended\s+dose:\s*(.+)$/i,
      /(?:dosis\s*recomendada|recommended\s*dose|dosificación|dosis)[\s:]+([^\n\r]+)/i,
      /[-•]\s*(?:dosis|dosificación)[\s:]+([^\n\r]+)/i,
    ];

    for (const pattern of dosagePatterns) {
      const match = section.match(pattern);
      if (match && match[1] && !supplement.dosage) {
        supplement.dosage = match[1].trim();
        break;
      }
    }

    // Buscar momento - formato específico "Momento de toma: X"
    const timingPatterns = [
      /^Momento\s+de\s+toma:\s*(.+)$/i,
      /^Timing:\s*(.+)$/i,
      /(?:momento\s*de\s*toma|timing|momento)[\s:]+([^\n\r]+)/i,
      /[-•]\s*(?:timing|momento)[\s:]+([^\n\r]+)/i,
    ];

    for (const pattern of timingPatterns) {
      const match = section.match(pattern);
      if (match && match[1] && !supplement.timing) {
        supplement.timing = match[1].trim();
        break;
      }
    }

    // Buscar observaciones - formato específico "Observaciones: X"
    const notesPatterns = [
      /^Observaciones:\s*(.+)$/i,
      /^Notes:\s*(.+)$/i,
      /(?:notas|notes|observaciones|interacciones|precauciones|consideraciones|advertencias|efectos|contraindicaciones|importante|recomendaciones)[\s:]+([^\n\r]+)/i,
      /[-•]\s*(?:notas|notes|observaciones|interacciones|precauciones|consideraciones)[\s:]+([^\n\r]+)/i,
      // Buscar cualquier línea que contenga palabras clave comunes en notas
      /(?:evitar|combinar|tomar\s+con|no\s+recomendado|cuidado|atención|puede\s+causar|efectos?\s+secundarios?)[\s:]([^\n\r]*)/i,
    ];

    for (const pattern of notesPatterns) {
      const match = section.match(pattern);
      if (
        match &&
        match[1] &&
        match[1].trim().length > 3 &&
        !supplement.interactions
      ) {
        supplement.interactions = match[1].trim();
        break;
      }
    }

    // Si no encontramos notas con patrones específicos, buscar líneas que parezcan notas
    if (!supplement.interactions) {
      for (const line of originalLines) {
        const lineLower = line.toLowerCase();
        // Buscar líneas que contengan palabras típicas de notas/advertencias
        if (
          (lineLower.includes('evitar') ||
            lineLower.includes('combinar') ||
            lineLower.includes('no tomar') ||
            lineLower.includes('cuidado') ||
            lineLower.includes('atención') ||
            lineLower.includes('puede causar') ||
            lineLower.includes('efectos') ||
            lineLower.includes('interactúa') ||
            lineLower.includes('precaución')) &&
          line.length > 10 && // Evitar líneas muy cortas
          !lineLower.includes('dosis') &&
          !lineLower.includes('momento') &&
          !supplement.name.toLowerCase().includes(lineLower)
        ) {
          supplement.interactions = line;
          break;
        }
      }
    }

    // Detectar categoría por el nombre del suplemento y momento de toma
    const name = supplement.name.toLowerCase();
    const timing = supplement.timing?.toLowerCase() || '';

    if (
      name.includes('proteína') ||
      name.includes('whey') ||
      name.includes('protein') ||
      timing.includes('post-entrenamiento') ||
      timing.includes('después del entrenamiento') ||
      timing.includes('after workout')
    ) {
      supplement.category = 'Post-entrenamiento';
    } else if (
      name.includes('cafeína') ||
      name.includes('caffeine') ||
      name.includes('beta-alanina') ||
      name.includes('citrulina') ||
      timing.includes('antes del entrenamiento') ||
      timing.includes('pre-entrenamiento') ||
      timing.includes('before workout')
    ) {
      supplement.category = 'Pre-entrenamiento';
    } else if (
      timing.includes('durante') ||
      timing.includes('during') ||
      name.includes('bcaa') ||
      name.includes('electrolitos') ||
      name.includes('maltodextrina')
    ) {
      supplement.category = 'Durante entrenamiento';
    } else {
      supplement.category = 'Diario';
    }

    // Solo agregar si tiene al menos nombre y una propiedad más
    if (
      supplement.name &&
      (supplement.dosage || supplement.timing || supplement.interactions)
    ) {
      supplements.push(supplement);
    }
  }

  // Extraer notas adicionales - buscar secciones específicas
  const notesPatterns = [
    /(?:notas?\s*adicionales?|additional\s*notes?)[\s:]*\n([\s\S]*?)(?=##|###|$)/i,
    /(?:consideraciones?\s*adicionales?|additional\s*considerations?)[\s:]*\n([\s\S]*?)(?=##|###|$)/i,
    /(?:importante|important)[\s:]*\n([\s\S]*?)(?=##|###|$)/i,
  ];

  for (const pattern of notesPatterns) {
    const match = content.match(pattern);
    if (match && match[1] && match[1].trim()) {
      additionalNotes.push(match[1].trim());
    }
  }

  return { supplements, additionalNotes };
}

// Componente para mostrar una tarjeta de suplemento
const SupplementCard: React.FC<{ supplement: SupplementInfo }> = ({
  supplement,
}) => {
  const getImageColor = (name: string) => {
    const lowerName = name.toLowerCase();

    if (
      lowerName.includes('proteína') ||
      lowerName.includes('whey') ||
      lowerName.includes('protein')
    ) {
      return 'from-blue-500 to-blue-600';
    } else if (
      lowerName.includes('creatina') ||
      lowerName.includes('creatine')
    ) {
      return 'from-orange-500 to-orange-600';
    } else if (lowerName.includes('omega')) {
      return 'from-green-500 to-green-600';
    } else if (
      lowerName.includes('bcaa') ||
      lowerName.includes('aminoácidos') ||
      lowerName.includes('amino')
    ) {
      return 'from-purple-500 to-purple-600';
    } else if (
      lowerName.includes('electrolytes') ||
      lowerName.includes('electrolitos') ||
      lowerName.includes('sodio') ||
      lowerName.includes('potasio')
    ) {
      return 'from-teal-500 to-teal-600';
    } else if (
      lowerName.includes('cafeína') ||
      lowerName.includes('caffeine') ||
      lowerName.includes('pre-workout') ||
      lowerName.includes('estimulante')
    ) {
      return 'from-red-500 to-red-600';
    } else if (
      lowerName.includes('vitamina') ||
      lowerName.includes('vitamin') ||
      lowerName.includes('multivitamínico')
    ) {
      return 'from-yellow-500 to-yellow-600';
    } else if (
      lowerName.includes('magnesio') ||
      lowerName.includes('zinc') ||
      lowerName.includes('mineral')
    ) {
      return 'from-indigo-500 to-indigo-600';
    } else if (
      lowerName.includes('glutamina') ||
      lowerName.includes('glutamine')
    ) {
      return 'from-pink-500 to-pink-600';
    } else if (
      lowerName.includes('carb') ||
      lowerName.includes('hidratos') ||
      lowerName.includes('carbohidratos')
    ) {
      return 'from-amber-500 to-amber-600';
    } else if (
      lowerName.includes('carnitina') ||
      lowerName.includes('carnitine')
    ) {
      return 'from-cyan-500 to-cyan-600';
    } else if (
      lowerName.includes('teanina') ||
      lowerName.includes('theanine') ||
      lowerName.includes('l-teanina')
    ) {
      return 'from-slate-500 to-slate-600';
    } else if (
      lowerName.includes('beta-alanina') ||
      lowerName.includes('beta alanina') ||
      lowerName.includes('alanina')
    ) {
      return 'from-rose-500 to-rose-600';
    }

    // Colores por defecto rotativos para suplementos no categorizados
    const colors = [
      'from-slate-500 to-slate-600',
      'from-emerald-500 to-emerald-600',
      'from-cyan-500 to-cyan-600',
      'from-rose-500 to-rose-600',
      'from-violet-500 to-violet-600',
    ];

    // Usar el hash del nombre para elegir un color consistente
    const hash = lowerName.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className='bg-white rounded-lg border border-gray-200 overflow-hidden mb-6'>
      {/* Header con nombre y categoría */}
      <div className='flex items-center justify-between p-4 border-b border-gray-100'>
        <div className='flex-1'>
          <h3 className='text-lg font-bold text-gray-900 mb-1'>
            {supplement.name}
          </h3>
          {supplement.category && (
            <span className='text-sm text-gray-600'>{supplement.category}</span>
          )}
        </div>
        <div
          className={`min-w-16 max-w-24 h-16 px-2 rounded-lg bg-gradient-to-br ${getImageColor(supplement.name)} flex items-center justify-center`}
        >
          <span className='text-white font-bold text-xs text-center leading-tight break-words'>
            {supplement.name.split(' ')[0].toUpperCase()}
          </span>
        </div>
      </div>

      {/* Información estructurada */}
      <div className='p-4 space-y-3'>
        {supplement.dosage && (
          <div className='flex items-center py-2 border-b border-gray-100'>
            <span className='text-gray-600 font-medium w-20 sm:w-24 mr-3 flex-shrink-0'>
              Dosis
            </span>
            <span className='text-gray-900 font-semibold flex-1'>
              {supplement.dosage}
            </span>
          </div>
        )}

        {supplement.timing && (
          <div className='flex items-start py-2 border-b border-gray-100'>
            <span className='text-gray-600 font-medium w-20 sm:w-24 mr-3 flex-shrink-0 mt-0.5'>
              Momento
            </span>
            <span className='text-gray-900 flex-1 leading-relaxed'>
              {supplement.timing}
            </span>
          </div>
        )}

        {supplement.interactions && (
          <div className='flex items-start py-3 bg-blue-50 rounded-lg px-3'>
            <span className='text-blue-600 font-medium w-20 sm:w-24 mr-3 flex-shrink-0 mt-0.5'>
              Notas
            </span>
            <span className='text-blue-900 flex-1 leading-relaxed text-sm break-words'>
              {supplement.interactions}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const StructuredReportView: React.FC<StructuredReportViewProps> = ({
  report,
}) => {
  const { supplements, additionalNotes } = parseReportContent(report.content);

  return (
    <div className='max-w-2xl mx-auto bg-gray-50 p-6 rounded-xl'>
      {/* Título principal */}
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          Recomendaciones Personalizadas
        </h1>
      </div>

      {/* Lista de suplementos */}
      <div className='space-y-6 mb-8'>
        {supplements.length > 0 ? (
          supplements.map((supplement, index) => (
            <SupplementCard key={index} supplement={supplement} />
          ))
        ) : (
          <div className='text-center text-gray-500 py-8'>
            No se encontraron suplementos estructurados en este informe.
          </div>
        )}
      </div>

      {/* Notas adicionales */}
      {additionalNotes.length > 0 && (
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <h2 className='text-lg font-bold text-gray-900 mb-4'>
            Notas Adicionales
          </h2>
          <div className='space-y-3'>
            {additionalNotes.map((note, index) => (
              <p key={index} className='text-gray-700 leading-relaxed'>
                {note}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StructuredReportView;
