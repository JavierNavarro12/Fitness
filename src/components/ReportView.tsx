import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Report } from '../types';

interface ReportViewProps {
  report: Report;
}

interface Supplement {
  name: string;
  link: string;
}

// Función para extraer suplementos recomendados y generar enlaces de búsqueda
function extractSupplementsWithLinks(content: string): Supplement[] {
  // Busca líneas que contengan los suplementos recomendados
  const lines = content.split('\n');
  const supplements: Supplement[] = [];
  
  // Patrón para detectar suplementos en diferentes formatos
  const supplementPatterns = [
    // Formato: 1. **Suplemento:**
    /\d+\.\s*\*\*([^*:]+):?\*\*/,
    // Formato: - **Suplemento**
    /^[-*]\s*\*\*([^*]+)\*\*/,
    // Formato: **Suplemento:**
    /\*\*([^*:]+):?\*\*/
  ];

  // Palabras clave que no son suplementos
  const nonSupplementKeywords = [
    'Informe',
    'Objetivo',
    'Deporte',
    'Nivel',
    'Frecuencia',
    'Peso',
    'Altura',
    'Edad',
    'Género',
    'Condiciones',
    'Alergias',
    'Suplementos actuales',
    'Productos Recomendados',
    'Enlaces a productos recomendados'
  ];

  for (const line of lines) {
    // Ignora líneas con URLs vacías
    if (line.includes('(URL del producto)')) continue;

    for (const pattern of supplementPatterns) {
      const match = line.match(pattern);
      if (match) {
        const name = match[1].trim();
        // Evita duplicados y líneas que no son suplementos
        if (name && 
            !supplements.some(s => s.name.toLowerCase() === name.toLowerCase()) &&
            !nonSupplementKeywords.some(keyword => name.includes(keyword))) {
          supplements.push({
            name,
            link: `https://www.amazon.es/s?k=${encodeURIComponent(name)}`
          });
        }
      }
    }
  }

  return supplements;
}

const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(report.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Extraer suplementos recomendados
  const supplements = extractSupplementsWithLinks(report.content);

  // Filtrar el contenido para eliminar el resumen del formulario y la sección de productos
  const filteredContent = report.content
    .split('\n')
    .filter(line => {
      // Elimina líneas que contienen el resumen del formulario
      if (line.includes('Objetivo:') || 
          line.includes('Deporte principal:') ||
          line.includes('Nivel de experiencia:') ||
          line.includes('Frecuencia de entrenamiento:') ||
          line.includes('Peso:') ||
          line.includes('Altura:') ||
          line.includes('Edad:') ||
          line.includes('Género:') ||
          line.includes('Condiciones médicas:') ||
          line.includes('Alergias:') ||
          line.includes('Suplementos actuales:') ||
          line.includes('(URL del producto)') ||
          line.includes('Productos Recomendados:') ||
          line.includes('Enlaces a productos recomendados:')) {
        return false;
      }
      return true;
    })
    .join('\n');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-300">{new Date(report.createdAt).toLocaleString()}</span>
        <button
          onClick={handleCopy}
          className="text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-400"
        >
          {copied ? t('¡Copiado!') : t('Copiar')}
        </button>
      </div>
      <div className="prose max-w-none text-gray-900 dark:text-gray-100">
        {filteredContent.split('\n').map((paragraph: string, i: number) => (
          <p key={i} className="mb-4">{paragraph}</p>
        ))}
        {supplements.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 className="font-bold text-red-700 dark:text-red-300 mb-3">{t('Enlaces a productos recomendados:')}</h4>
            <ul className="space-y-2">
              {supplements.map((supp, idx) => (
                <li key={idx} className="flex items-center">
                  <span className="mr-2">•</span>
                  <a 
                    href={supp.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                  >
                    {supp.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportView; 