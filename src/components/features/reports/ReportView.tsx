import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Report } from '../../../types';
import { FaFile, FaRegCopy, FaCircleCheck, FaDownload, FaTrash } from 'react-icons/fa6';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF';
import ReactMarkdown from 'react-markdown';

interface ReportViewProps {
  report: Report;
  onDelete?: (reportId: string) => void;
}

interface Supplement {
  name: string;
  link: string;
}

// Nueva función para extraer suplementos de todo el informe
function extractAllSupplements(content: string): string[] {
  const lines = content.split('\n');
  const supplements = new Set<string>();
  const supplementTitleRegex = /^[-*]\s*\*\*(.+?)\*\*/; // - **Nombre**
  const supplementListRegex = /^\d+\.\s*(.+)/; // 1. Nombre
  const subtitleRegex = /^###?\s*(.+)/; // ## Nombre o ### Nombre
  const exclude = [
    'Productos Recomendados',
    'Enlaces a Productos Recomendados',
    'Recomendaciones',
    'Consideraciones',
    'Resumen',
    'Siguientes Pasos',
    'Plan Personalizado de Suplementación Deportiva',
    'Introducción Personalizada',
    'Suplementos Base (Fundamentales)',
    'Suplementos para tu Objetivo',
    'Suplementos para tu Deporte',
    'Objetivo',
    'Deporte',
    'Base',
    'Fundamentales',
    'Adicionales',
    'Pasos',
    'Productos',
    'Enlaces',
    'Recomendados',
    'Recomendado',
    'Adicional',
    'Personalizado',
    'Informe',
    'Plan',
    'Siguiente',
    'Siguientes',
    'Consideración',
    'Consideraciones',
    'Resumen',
    'Paso',
    'Pasos',
    'Entrenamiento',
    'Nutrición',
    'Consejos',
    'Ejercicios',
    'Hidratación',
    'Descanso',
    'Fuerza',
    'Cardio',
    'Flexibilidad',
    'Recuperación',
    'Rutina',
    'Programa',
    'Horario',
    'Calendario',
    'Semana',
    'Día',
    'Días',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
    'Agua',
    'Litros',
    'Horas',
    'Noche',
    'Pecho',
    'Tríceps',
    'Espalda',
    'Bíceps',
    'Piernas',
    'Hombros',
    'Abdominales',
    'Glúteos',
    'Pantorrillas',
    'Antebrazos',
    'Trapecio',
    'Deltoides',
    'Pectorales',
    'Dorsales',
    'Cuádriceps',
    'Isquiotibiales',
    'Gemelos',
  ];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    // - **Nombre**
    let match = line.match(supplementTitleRegex);
    if (match && match[1].length > 2) {
      const name = match[1].replace(/:$/, '').trim();
      if (!exclude.some(e => name.toLowerCase().includes(e.toLowerCase()))) {
        supplements.add(name);
      }
      continue;
    }
    // 1. Nombre
    match = line.match(supplementListRegex);
    if (match && match[1].length > 2) {
      const name = match[1].replace(/:$/, '').trim();
      if (!exclude.some(e => name.toLowerCase().includes(e.toLowerCase()))) {
        supplements.add(name);
      }
      continue;
    }
    // ## Nombre
    match = line.match(subtitleRegex);
    if (match && match[1].length > 2 && !/^suplementos|consideraciones|resumen|introducción|plan|objetivo|deporte|base|fundamentales|adicionales|pasos/i.test(match[1])) {
      const name = match[1].replace(/:$/, '').trim();
      if (!exclude.some(e => name.toLowerCase().includes(e.toLowerCase()))) {
        supplements.add(name);
      }
      continue;
    }
  }
  return Array.from(supplements);
}

function extractSupplementsWithLinks(content: string): Supplement[] {
  const supplementNames = extractAllSupplements(content);
  return supplementNames.map(name => {
    const cleanName = name;
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
    const trimmedLine = line.trim();

    // Skip specific unwanted headers like "Perfil:"
    if (/^perfil:$/i.test(trimmedLine)) {
      continue;
    }
    
    // Eliminar bloque de 'Perfil Físico:' o 'Resumen del perfil:'
    if (/^(perfil|resumen del perfil)/i.test(trimmedLine)) {
      skipBlock = true;
      continue;
    }
    if (skipBlock) {
      // Termina el bloque al encontrar una línea vacía o una sección de recomendaciones
      if (trimmedLine === '' || /Recomendaciones?:/i.test(trimmedLine)) {
        skipBlock = false;
      } else {
        continue;
      }
    }
    // Eliminar cualquier línea que contenga una palabra clave
    if (keywords.some(k => line.includes(k))) continue;
    filtered.push(line);
  }
  return filtered.join('\n').replace(/\[([^\]]+)\]\(URL del producto\)/gi, '$1');
}

function removeRecommendedProductsSection(content: string): string {
  // Busca el índice donde empieza la sección de productos recomendados
  const regex = /###\s*(Productos Recomendados|Recommended Products)/i;
  const lines = content.split('\n');
  const idx = lines.findIndex(line => regex.test(line));
  if (idx === -1) return content;
  // Devuelve solo el contenido antes de esa sección
  return lines.slice(0, idx).join('\n').trim();
}

const ReportView: React.FC<ReportViewProps> = ({ report, onDelete }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(report.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Opcional: puedes mostrar un toast o mensaje de error si lo deseas
      console.error(e);
      setCopied(false);
    }
  };

  // Extraer suplementos recomendados
  const supplements = extractSupplementsWithLinks(report.content);

  // Filtrar el contenido para eliminar el resumen del formulario y la sección de productos
  const filteredContent = removeRecommendedProductsSection(filterPersonalizationSummary(report.content));

  const supplementsWithLinks = extractSupplementsWithLinks(report.content);

  return (
    <div ref={reportRef} className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-0 md:p-0 border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Encabezado profesional */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-400 dark:from-red-800 dark:to-red-600">
        <div className="flex items-center gap-2 sm:gap-3">
          {FaFile({ className: "text-white text-xl sm:text-2xl" })}
          <span className="text-white font-bold text-base sm:text-lg md:text-xl">{t('report.title')}</span>
        </div>
        <div className="flex flex-row items-center gap-1 sm:gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto gap-0 sm:gap-2 p-0 sm:px-3 sm:py-1.5 rounded-lg border border-red-200 dark:border-red-400 bg-white dark:bg-gray-900 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-800 font-semibold text-xs sm:text-sm shadow-sm transition"
            title={t('report.copy')}
          >
            {copied ? FaCircleCheck({ className: "text-green-500" }) : FaRegCopy({})}
            <span className="hidden sm:inline ml-2">{copied ? t('report.copied') : t('report.copy')}</span>
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
            className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto gap-0 sm:gap-2 p-0 sm:px-3 sm:py-1.5 rounded-lg border border-blue-200 dark:border-blue-400 bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800 font-semibold text-xs sm:text-sm shadow-sm transition"
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => loading ? <span className="hidden sm:inline">{t('report.generatingPDF')}</span> : <>
              {FaDownload({ className: "text-lg" })}
              <span className="hidden sm:inline ml-2">{t('report.downloadPDF')}</span>
            </>}
          </PDFDownloadLink>
          {onDelete && report.id && (
            <button
              onClick={() => {
                if (window.confirm('¿Seguro que quieres eliminar este informe?') && report.id) {
                  onDelete(report.id);
                }
              }}
              className="flex items-center justify-center w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition ml-1"
              title={t('report.delete')}
            >
              {FaTrash({ className: "text-lg" })}
            </button>
          )}
        </div>
      </div>
      {/* Contenido del informe */}
      <div className="px-6 py-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{new Date(report.createdAt).toLocaleString()}</div>
        <div className="prose max-w-3xl mx-auto bg-white p-6 rounded-xl">
          <ReactMarkdown>{filteredContent}</ReactMarkdown>
        </div>

        {/* Sección de Enlaces a Productos Recomendados */}
        {supplementsWithLinks.length > 0 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60">
            <h3 className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 mb-3">Productos Recomendados</h3>
            <ul className="space-y-2">
              {supplementsWithLinks.map((supplement, index) => (
                <li key={index} className="flex items-center">
                  <a
                    href={supplement.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition"
                  >
                    {supplement.name}
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