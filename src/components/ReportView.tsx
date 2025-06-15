import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Report } from '../types';
import { FaFile, FaRegCopy, FaCircleCheck, FaDownload } from 'react-icons/fa6';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF';

interface ReportViewProps {
  report: Report;
}

interface Supplement {
  name: string;
  link: string;
}

// Función para extraer suplementos recomendados SOLO de la sección "Suplementación Recomendada"
function extractSupplementsFromRecommendedSection(content: string): string[] {
  const lines = content.split('\n');
  const startIdx = lines.findIndex(line => line.toLowerCase().includes('suplementación recomendada'));
  if (startIdx === -1) return [];
  // Buscar el final de la sección (siguiente encabezado o fin)
  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (lines[i].startsWith('###') || lines[i].startsWith('####')) {
      endIdx = i;
      break;
    }
  }
  // Extraer nombres de suplementos de la sección
  const supplementNames: string[] = [];
  const supplementPattern = /\*\*([^*]+)\*\*/g;
  const exclude = [
    'Alimentación', 'Entrenamiento', 'Descanso', 'Suplementos Actuales',
    'Deporte Principal', 'Nivel de Experiencia', 'Frecuencia de Entrenamiento',
    'Condiciones Médicas', 'Objetivo', 'Edad', 'Género', 'Peso', 'Altura', 'Ninguno', 'Ninguna'
  ];
  for (let i = startIdx + 1; i < endIdx; i++) {
    let match;
    while ((match = supplementPattern.exec(lines[i])) !== null) {
      const name = match[1].replace(/:$/, '').trim();
      // Evitar duplicados y nombres genéricos o de resumen
      if (name && !supplementNames.includes(name) && name.length > 2 && !exclude.includes(name)) {
        supplementNames.push(name);
      }
    }
  }
  return supplementNames;
}

// Función para extraer suplementos con enlaces SOLO de la lista de recomendados
function extractSupplementsWithLinks(content: string): Supplement[] {
  const recommendedSupplements = extractSupplementsFromRecommendedSection(content);
  return recommendedSupplements.map(name => ({
    name,
    link: `https://www.amazon.es/s?k=${encodeURIComponent(name)}`
  }));
}

const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

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
      // Elimina líneas que contienen el resumen del formulario o campos no deseados
      if (
        line.includes('Objetivo:') ||
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
        line.includes('Suplementos Actuales:') ||
        line.includes('(URL del producto)') ||
        line.includes('Productos Recomendados:') ||
        line.includes('Enlaces a productos recomendados:')
      ) {
        return false;
      }
      return true;
    })
    .join('\n');

  return (
    <div ref={reportRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-0 md:p-0 border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Encabezado profesional */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-400 dark:from-red-700 dark:to-red-500">
        <div className="flex items-center gap-2 sm:gap-3">
          {FaFile({ className: "text-white text-xl sm:text-2xl" })}
          <span className="text-white font-bold text-base sm:text-lg md:text-xl">Informe personalizado</span>
        </div>
        <div className="flex flex-row items-center gap-1 sm:gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto gap-0 sm:gap-2 p-0 sm:px-3 sm:py-1.5 rounded-lg border border-red-200 dark:border-red-400 bg-white dark:bg-gray-900 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-800 font-semibold text-xs sm:text-sm shadow-sm transition"
            title={t('Copiar')}
          >
            {copied ? FaCircleCheck({ className: "text-green-500" }) : FaRegCopy({})}
            <span className="hidden sm:inline ml-2">{copied ? t('¡Copiado!') : t('Copiar')}</span>
          </button>
          <PDFDownloadLink
            document={
              <ReportPDF
                title="Informe personalizado"
                content={filteredContent}
                supplements={supplements}
                date={new Date(report.createdAt).toLocaleDateString()}
              />
            }
            fileName={`informe-${new Date(report.createdAt).toLocaleDateString()}.pdf`}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto px-0 py-0 sm:px-4 sm:py-2 font-semibold text-xs sm:text-sm transition shadow-sm border-0"
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => loading
              ? <span className="hidden sm:inline">Generando PDF...</span>
              : <>
                  {FaDownload({ className: "text-lg" })}
                  <span className="hidden sm:inline ml-2">Descargar PDF</span>
                </>
            }
          </PDFDownloadLink>
        </div>
      </div>
      {/* Contenido del informe */}
      <div className="px-6 py-6 md:py-8">
        <div className="prose max-w-none text-gray-900 dark:text-gray-100 prose-p:mb-4 prose-p:leading-relaxed prose-p:text-base prose-p:font-medium">
          {filteredContent.split('\n').map((paragraph: string, i: number) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        {supplements.length > 0 && (
          <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-red-100 dark:border-red-700 rounded-xl shadow-inner">
            <h4 className="font-bold text-red-700 dark:text-red-300 mb-4 text-lg flex items-center gap-2">
              {FaFile({ className: "text-red-400 dark:text-red-300" })}
              {t('Enlaces a productos recomendados:')}
            </h4>
            <ul className="space-y-2">
              {supplements.map((supp, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-red-400 dark:text-red-300">•</span>
                  <a 
                    href={supp.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-semibold"
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