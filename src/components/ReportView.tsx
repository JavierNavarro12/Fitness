import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Report } from '../types';
import { FaFile, FaRegCopy, FaCircleCheck, FaDownload } from 'react-icons/fa6';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF';
import ReactMarkdown from 'react-markdown';

interface ReportViewProps {
  report: Report;
}

interface Supplement {
  name: string;
  link: string;
}

// Extraer solo los suplementos recomendados por la IA de la sección correspondiente
function extractSupplementsFromRecommendedSectionOnly(content: string): string[] {
  const lines = content.split('\n');
  // Buscar posibles títulos de sección
  const sectionTitles = [
    'suplementación recomendada',
    'productos recomendados',
    'recomendaciones',
    'suplementos recomendados',
    'suplementos sugeridos',
  ];
  let startIdx = -1;
  for (const title of sectionTitles) {
    startIdx = lines.findIndex(line => line.toLowerCase().includes(title));
    if (startIdx !== -1) break;
  }
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
    'Alimentación', 'Entrenamiento', 'Descanso', 'Suplementos Actuales', 'Objetivo', 'Deporte principal', 'Nivel de experiencia', 'Frecuencia de entrenamiento', 'Peso', 'Altura', 'Edad', 'Género', 'Condiciones médicas', 'Alergias', 'Informe', 'Introducción', 'Recomendaciones', 'Productos recomendados'
  ];
  // 1. Buscar nombres en negrita
  for (let i = startIdx + 1; i < endIdx; i++) {
    let match;
    while ((match = supplementPattern.exec(lines[i])) !== null) {
      const name = match[1].replace(/:$/, '').trim();
      if (name && !supplementNames.includes(name) && name.length > 2 && !exclude.includes(name)) {
        supplementNames.push(name);
      }
    }
  }
  // 2. Si no hay nombres en negrita, buscar líneas de lista
  if (supplementNames.length === 0) {
    for (let i = startIdx + 1; i < endIdx; i++) {
      const line = lines[i].trim();
      // Línea de lista tipo '- Suplemento' o '1. Suplemento'
      if ((line.startsWith('-') || /^\d+\./.test(line)) && line.length > 2) {
        // Quitar el guion o número y espacios
        let name = line.replace(/^(-|\d+\.)\s*/, '').replace(/:$/, '').trim();
        // Quitar posibles URLs
        name = name.replace(/\(https?:[^)]+\)/, '').trim();
        if (name && !supplementNames.includes(name) && name.length > 2 && !exclude.includes(name)) {
          supplementNames.push(name);
        }
      }
    }
  }
  return supplementNames;
}

function cleanSupplementName(name: string): string {
  return name
    .replace(/\[|\]/g, '') // quitar corchetes
    .replace(/\(URL\)/gi, '') // quitar (URL) o (url)
    .replace(/\(https?:[^)]+\)/gi, '') // quitar paréntesis con http...
    .replace(/\s+/g, ' ') // espacios extra
    .trim();
}

function extractSupplementsWithLinks(content: string): Supplement[] {
  const recommendedSupplements = extractSupplementsFromRecommendedSectionOnly(content);
  return recommendedSupplements.map(name => {
    const cleanName = cleanSupplementName(name);
    return {
      name: cleanName,
      link: `https://www.amazon.es/s?k=${encodeURIComponent(cleanName)}`
    };
  });
}

// Filtrar líneas del resumen del formulario de personalización
function filterPersonalizationSummary(content: string): string {
  const keywords = [
    'Objetivo:',
    'Deporte Principal:',
    'Deporte principal:',
    'Nivel de Experiencia:',
    'Nivel de experiencia:',
    'Frecuencia de Entrenamiento:',
    'Frecuencia de entrenamiento:',
    'Peso:',
    'Altura:',
    'Edad:',
    'Género:',
    'Condiciones Médicas:',
    'Condiciones médicas:',
    'Alergias:',
    'Suplementos Actuales:',
    'Suplementos actuales:'
  ];
  const lines = content.split('\n');
  let filtered: string[] = [];
  let skipBlock = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Eliminar bloque de 'Perfil Físico:'
    if (line.trim().startsWith('Perfil Físico:')) {
      skipBlock = true;
      continue;
    }
    if (skipBlock) {
      // Termina el bloque al encontrar una línea vacía o una sección de recomendaciones
      if (line.trim() === '' || /Recomendaciones?:/i.test(line)) {
        skipBlock = false;
      } else {
        continue;
      }
    }
    // Eliminar cualquier línea que contenga una palabra clave
    if (keywords.some(k => line.includes(k))) continue;
    filtered.push(line);
  }
  return filtered.join('\n');
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
  const filteredContent = filterPersonalizationSummary(report.content);

  const supplementsWithLinks = extractSupplementsWithLinks(report.content);

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
      <div className="px-6 py-4">
        <div className="text-xs text-gray-500 mb-2">{new Date(report.createdAt).toLocaleString()}</div>
        <div className="prose dark:prose-invert max-w-none text-base">
          <ReactMarkdown>{filteredContent}</ReactMarkdown>
        </div>
        {supplementsWithLinks.length > 0 && (
          <div className="mt-8 p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-red-200 dark:border-red-700">
            <div className="font-bold text-red-700 dark:text-red-400 mb-4 text-lg">Enlaces a productos recomendados:</div>
            <ol className="list-decimal pl-6 space-y-2">
              {supplementsWithLinks.map((supp, idx) => (
                <li key={idx}>
                  <a
                    href={supp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-blue-700 underline hover:text-blue-900 transition"
                  >
                    {supp.name}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportView; 