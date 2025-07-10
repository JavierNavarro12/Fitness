import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Report } from '../../../types';
import {
  FaFile,
  FaRegCopy,
  FaCircleCheck,
  FaDownload,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
} from 'react-icons/fa6';
import ReactMarkdown from 'react-markdown';
import StructuredReportView from './StructuredReportView';
import html2pdf from 'html2pdf.js';
import type { ComponentPropsWithoutRef } from 'react';

interface ReportViewProps {
  report: Report;
  onDelete?: (reportId: string) => void;
}

interface Supplement {
  name: string;
  link: string;
}

// Diccionario de equivalencias de búsqueda para suplementos (todas las claves en minúsculas)
const supplementSearchTerms: Record<string, string> = {
  'proteína en polvo': 'whey',
  'proteína whey': 'whey',
  'proteína de suero': 'whey',
  'proteína vegetal': 'proteína vegetal',
  'creatina monohidrato': 'creatina',
  creatina: 'creatina',
  bcaas: 'BCAA',
  'aminoácidos ramificados': 'BCAA',
  glutamina: 'glutamina',
  'beta-alanina': 'beta alanina',
  cafeína: 'cafeína',
  'omega-3': 'omega 3',
  multivitamínico: 'multivitaminas',
  colágeno: 'colágeno',
  ashwagandha: 'ashwagandha',
  hmb: 'HMB',
  caseína: 'caseína',
  'l-carnitina': 'carnitina',
  cla: 'CLA',
  'vitamina d': 'vitamina D',
  magnesio: 'magnesio',
  zma: 'ZMA',
  hierro: 'hierro',
  zinc: 'zinc',
  'vitamina b12': 'vitamina B12',
  'ginkgo biloba': 'ginkgo biloba',
  'bacopa monnieri': 'bacopa monnieri',
  fosfatidilserina: 'fosfatidilserina',
  // ... puedes añadir más equivalencias aquí ...
};

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
    if (
      match &&
      match[1].length > 2 &&
      !/^suplementos|consideraciones|resumen|introducción|plan|objetivo|deporte|base|fundamentales|adicionales|pasos/i.test(
        match[1]
      )
    ) {
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
    // Elimina los asteriscos del nombre para los enlaces
    const cleanName = name.replace(/\*+/g, '').trim();
    return {
      name: cleanName,
      link: `https://www.amazon.es/s?k=${encodeURIComponent(cleanName)}`,
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
    'Suplementos actuales:',
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
  return filtered
    .join('\n')
    .replace(/\[([^\]]+)\]\(URL del producto\)/gi, '$1');
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

const markdownComponents = {
  h1: ({ children, ...props }: ComponentPropsWithoutRef<'h1'>) => (
    <h1 className='text-3xl font-bold mt-6 mb-4' {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className='text-2xl font-bold mt-4 mb-3' {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className='text-xl font-semibold mt-3 mb-2' {...props}>
      {children}
    </h3>
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul className='list-disc pl-6 mb-2' {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol className='list-decimal pl-6 mb-2' {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li className='mb-1' {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className='font-semibold' {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p className='mb-2' {...props} />
  ),
};

const ReportView: React.FC<ReportViewProps> = ({ report, onDelete }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [useStructuredView, setUseStructuredView] = useState(false); // Iniciar con vista clásica
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

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
  const filteredContent = removeRecommendedProductsSection(
    filterPersonalizationSummary(report.content)
  );

  // Asegura que filteredContent y supplements siempre tengan un valor válido
  const safeFilteredContent = filteredContent || '';
  const safeSupplements = Array.isArray(supplements) ? supplements : [];

  // Limpia el contenido para evitar que ReactMarkdown lo interprete como bloque de código
  let cleanMarkdown = safeFilteredContent
    .replace(/^```[a-z]*\n?/i, '') // elimina ``` al inicio
    .replace(/```$/i, '') // elimina ``` al final
    .split('\n')
    .map(line => line.replace(/^\s+/, ''))
    .join('\n');

  if (
    !safeFilteredContent ||
    safeSupplements.length === 0 ||
    typeof safeFilteredContent !== 'string'
  ) {
    return (
      <div className='text-red-600 text-center font-bold'>
        Error: Datos insuficientes o inválidos para generar el PDF.
      </div>
    );
  }

  const supplementsWithLinks = extractSupplementsWithLinks(report.content);

  const handleDownloadPDF = async () => {
    setIsExportingPDF(true);
    await new Promise(resolve => setTimeout(resolve, 50)); // Espera a que el DOM actualice
    if (reportRef.current) {
      await html2pdf()
        .set({
          margin: 0,
          filename: `informe-${report && report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'sin-fecha'}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(reportRef.current)
        .save();
    }
    setIsExportingPDF(false);
  };

  return (
    <div
      ref={reportRef}
      id='informe-html'
      className='bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-0 md:p-0 border border-gray-100 dark:border-gray-700 overflow-hidden'
    >
      {/* Encabezado profesional */}
      {!isExportingPDF && (
        <div className='flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-400 dark:from-red-800 dark:to-red-600'>
          <div className='flex items-center gap-2 sm:gap-3'>
            {FaFile({ className: 'text-white text-xl sm:text-2xl' })}
            <span className='text-white font-bold text-base sm:text-lg md:text-xl'>
              {t('report.title')}
            </span>
          </div>
          <div className='flex flex-row items-center gap-1 sm:gap-2'>
            <button
              onClick={() => setUseStructuredView(!useStructuredView)}
              className='flex items-center justify-center w-10 h-8 sm:w-auto sm:h-auto gap-0 sm:gap-2 p-1 sm:px-3 sm:py-1.5 rounded-lg border-2 border-purple-300 dark:border-purple-400 bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-800 font-semibold text-xs sm:text-sm shadow-md transition'
              title={
                useStructuredView
                  ? 'Cambiar a vista clásica'
                  : 'Cambiar a vista estructurada'
              }
            >
              {useStructuredView
                ? FaToggleOn({
                    className: 'text-purple-500 text-lg sm:text-base',
                  })
                : FaToggleOff({
                    className: 'text-purple-600 text-lg sm:text-base',
                  })}
              <span className='hidden sm:inline ml-2'>
                {useStructuredView ? 'Estructurada' : 'Clásica'}
              </span>
            </button>
            <button
              onClick={handleCopy}
              className='flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto gap-0 sm:gap-2 p-0 sm:px-3 sm:py-1.5 rounded-lg border border-red-200 dark:border-red-400 bg-white dark:bg-gray-900 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-800 font-semibold text-xs sm:text-sm shadow-sm transition'
              title={t('report.copy')}
            >
              {copied
                ? FaCircleCheck({ className: 'text-green-500' })
                : FaRegCopy({})}
              <span className='hidden sm:inline ml-2'>
                {copied ? t('report.copied') : t('report.copy')}
              </span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className='flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto gap-0 sm:gap-2 p-0 sm:px-3 sm:py-1.5 rounded-lg border border-blue-200 dark:border-blue-400 bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800 font-semibold text-xs sm:text-sm shadow-sm transition'
              title='Descargar PDF'
            >
              {FaDownload({ className: 'text-lg' })}
              <span className='hidden sm:inline ml-2'>PDF</span>
            </button>
            {onDelete && report.id && (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      '¿Seguro que quieres eliminar este informe?'
                    ) &&
                    report.id
                  ) {
                    onDelete(report.id);
                  }
                }}
                className='flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto gap-0 sm:gap-2 p-0 sm:px-3 sm:py-1.5 rounded-lg border border-red-200 dark:border-red-400 bg-white dark:bg-gray-900 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-800 font-semibold text-xs sm:text-sm shadow-sm transition ml-1'
                title={t('report.delete')}
              >
                {FaTrash({ className: 'text-lg' })}
                <span className='hidden sm:inline ml-2'>Eliminar</span>
              </button>
            )}
          </div>
        </div>
      )}
      {/* Contenido del informe */}
      <div className='px-6 py-4'>
        <div className='text-xs text-gray-500 dark:text-gray-400 mb-2'>
          {new Date(report.createdAt).toLocaleString()}
        </div>
        {useStructuredView ? (
          <StructuredReportView report={report} />
        ) : (
          <div className='prose prose-invert max-w-3xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-xl'>
            <ReactMarkdown components={markdownComponents}>
              {cleanMarkdown}
            </ReactMarkdown>
          </div>
        )}

        {/* Sección de Enlaces a Productos Recomendados - Solo en vista clásica */}
        {!isExportingPDF &&
          !useStructuredView &&
          supplementsWithLinks.length > 0 && (
            <div className='px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60'>
              <h3 className='text-base sm:text-lg font-bold text-red-600 dark:text-red-400 mb-3'>
                Productos Recomendados
              </h3>
              <ul className='space-y-3'>
                {supplementsWithLinks.map((supplement, index) => (
                  <AccordionSupplement
                    key={index}
                    supplement={supplement.name}
                  />
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
};

// Componente acordeón profesional para suplementos
function AccordionSupplement({ supplement }: { supplement: string }) {
  const [open, setOpen] = React.useState(false);
  // Normalizar el nombre para buscar en el diccionario
  const normalized = supplement.trim().toLowerCase();
  const searchTerm = supplementSearchTerms[normalized] || supplement;
  const shops = [
    {
      name: 'HSN',
      url: `https://www.hsnstore.com/buscar?q=${encodeURIComponent(searchTerm)}`,
      logo: 'https://www.hsnstore.com/favicon.ico',
      color: 'bg-orange-100',
    },
    {
      name: 'Nutritienda',
      url: `https://www.nutritienda.com/es/buscar?q=${encodeURIComponent(searchTerm)}`,
      logo: 'https://www.nutritienda.com/favicon.ico',
      color: 'bg-blue-100',
    },
    {
      name: 'MásMúsculo',
      url: `https://www.masmusculo.com/es/buscar?controller=search&orderby=position&orderway=desc&search_query=${encodeURIComponent(searchTerm)}`,
      logo: 'https://www.masmusculo.com/favicon.ico',
      color: 'bg-yellow-100',
    },
  ];
  return (
    <li className=''>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 mb-1`}
        aria-expanded={open}
      >
        <span className='flex items-center gap-2'>
          <span className='text-base sm:text-lg font-bold'>{supplement}</span>
        </span>
        <svg
          className={`w-5 h-5 ml-2 transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'} bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700`}
        style={{ pointerEvents: open ? 'auto' : 'none' }}
      >
        <div className='flex flex-col gap-3 sm:flex-row sm:gap-4 items-stretch sm:items-center justify-center p-4'>
          {shops.map(shop => (
            <a
              key={shop.name}
              href={shop.url}
              target='_blank'
              rel='noopener noreferrer'
              className={`flex items-center sm:justify-center gap-2 px-4 py-3 rounded-lg font-semibold shadow hover:shadow-md transition bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 ${shop.color} w-full sm:w-auto`}
            >
              <img
                src={shop.logo}
                alt={shop.name}
                className='w-6 h-6 rounded-full'
              />
              <span>{shop.name}</span>
              <span className='ml-2 text-xs text-blue-600 dark:text-blue-300 font-bold'>
                Ir a tienda
              </span>
            </a>
          ))}
        </div>
      </div>
    </li>
  );
}

export default ReportView;
