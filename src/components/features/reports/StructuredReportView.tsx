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

    // Buscar información específica en las líneas siguientes
    for (const line of lines) {
      const trimmedLine = line.toLowerCase();

      // Buscar dosis/dosificación - formato nuevo y antiguo
      if (
        trimmedLine.startsWith('dosis recomendada:') ||
        trimmedLine.startsWith('recommended dose:') ||
        trimmedLine.startsWith('dosificación:') ||
        trimmedLine.includes('- dosis') ||
        trimmedLine.includes('- recommended dose')
      ) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          supplement.dosage = line.substring(colonIndex + 1).trim();
        } else {
          // Formato de lista con guión
          const dashMatch = line.match(
            /[-•]\s*(?:dosis|recommended dose|dosificación)[:\s]+(.+)/i
          );
          if (dashMatch) {
            supplement.dosage = dashMatch[1].trim();
          }
        }
      }

      // Buscar momento de toma - formato nuevo y antiguo
      if (
        trimmedLine.startsWith('momento de toma:') ||
        trimmedLine.startsWith('timing:') ||
        trimmedLine.startsWith('momento:') ||
        trimmedLine.includes('- timing') ||
        trimmedLine.includes('- momento')
      ) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          supplement.timing = line.substring(colonIndex + 1).trim();
        } else {
          // Formato de lista con guión
          const dashMatch = line.match(/[-•]\s*(?:timing|momento)[:\s]+(.+)/i);
          if (dashMatch) {
            supplement.timing = dashMatch[1].trim();
          }
        }
      }

      // Buscar observaciones/interacciones - formato nuevo y antiguo
      if (
        trimmedLine.startsWith('observaciones:') ||
        trimmedLine.startsWith('notes:') ||
        trimmedLine.startsWith('interacciones:') ||
        trimmedLine.startsWith('precauciones:') ||
        trimmedLine.includes('- notes') ||
        trimmedLine.includes('- observaciones')
      ) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          supplement.interactions = line.substring(colonIndex + 1).trim();
        } else {
          // Formato de lista con guión
          const dashMatch = line.match(
            /[-•]\s*(?:notes|observaciones|interacciones)[:\s]+(.+)/i
          );
          if (dashMatch) {
            supplement.interactions = dashMatch[1].trim();
          }
        }
      }
    }

    // Detectar categoría por el nombre del suplemento
    const name = supplement.name.toLowerCase();
    if (
      name.includes('proteína') ||
      name.includes('whey') ||
      name.includes('protein')
    ) {
      supplement.category = 'Post-entrenamiento';
    } else if (name.includes('creatina') || name.includes('creatine')) {
      supplement.category = 'Diario';
    } else if (name.includes('omega')) {
      supplement.category = 'Diario';
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
          <div className='flex items-start py-2'>
            <span className='text-gray-600 font-medium w-20 sm:w-24 mr-3 flex-shrink-0 mt-0.5'>
              Notas
            </span>
            <span className='text-gray-900 flex-1 leading-relaxed'>
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
