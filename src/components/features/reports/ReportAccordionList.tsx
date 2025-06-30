import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Report } from '../../../types';
import {
  FaFile,
  FaRegCopy,
  FaCircleCheck,
  FaDownload,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa6';
import ReactMarkdown from 'react-markdown';
import ReportView from './ReportView';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF';

interface ReportAccordionListProps {
  reports: Report[];
  onDelete?: (reportId: string) => void;
  initialExpandedId?: string;
}

interface Supplement {
  name: string;
  link: string;
}

// Función para extraer suplementos (copiada de ReportView)
function extractAllSupplements(content: string): string[] {
  const lines = content.split('\n');
  const supplements = new Set<string>();
  const supplementTitleRegex = /^[-*]\s*\*\*(.+?)\*\*/;
  const supplementListRegex = /^\d+\.\s*(.+)/;
  const subtitleRegex = /^###?\s*(.+)/;
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
    let match = line.match(supplementTitleRegex);
    if (match && match[1].length > 2) {
      const name = match[1].replace(/:$/, '').trim();
      if (!exclude.some(e => name.toLowerCase().includes(e.toLowerCase()))) {
        supplements.add(name);
      }
      continue;
    }
    match = line.match(supplementListRegex);
    if (match && match[1].length > 2) {
      const name = match[1].replace(/:$/, '').trim();
      if (!exclude.some(e => name.toLowerCase().includes(e.toLowerCase()))) {
        supplements.add(name);
      }
      continue;
    }
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
  return supplementNames.map(name => ({
    name: name,
    link: `https://www.amazon.es/s?k=${encodeURIComponent(name)}`,
  }));
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

    if (/^perfil:$/i.test(trimmedLine)) {
      continue;
    }

    if (/^(perfil|resumen del perfil)/i.test(trimmedLine)) {
      skipBlock = true;
      continue;
    }
    if (skipBlock) {
      if (trimmedLine === '' || /Recomendaciones?:/i.test(trimmedLine)) {
        skipBlock = false;
      } else {
        continue;
      }
    }
    if (keywords.some(k => line.includes(k))) continue;
    filtered.push(line);
  }
  return filtered
    .join('\n')
    .replace(/\[([^\]]+)\]\(URL del producto\)/gi, '$1');
}

function removeRecommendedProductsSection(content: string): string {
  const regex = /###\s*(Productos Recomendados|Recommended Products)/i;
  const lines = content.split('\n');
  const idx = lines.findIndex(line => regex.test(line));
  if (idx === -1) return content;
  return lines.slice(0, idx).join('\n').trim();
}

// Función para generar extracto del contenido
function generateExcerpt(
  content: string,
  maxLines: number = 4,
  maxLength: number = 400
): string {
  const filteredContent = removeRecommendedProductsSection(
    filterPersonalizationSummary(content)
  );
  const lines = filteredContent.split('\n').filter(line => {
    const trimmed = line.trim();
    return (
      trimmed &&
      !trimmed.startsWith('#') &&
      !trimmed.startsWith('##') &&
      !trimmed.startsWith('###') &&
      !/^```/.test(trimmed) &&
      !/^```[a-zA-Z]*$/.test(trimmed)
    );
  });

  // Tomar hasta maxLines líneas relevantes
  let excerptLines = lines.slice(0, maxLines);
  let excerpt = excerptLines.join('\n');

  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength) + '...';
  }

  return excerpt;
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

// Componente acordeón profesional para suplementos (igual que en ReportView)
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
        className={`overflow-hidden transition-all duration-300 ${open ? 'opacity-100 mt-2' : 'max-h-0 opacity-0'} bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700`}
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

const ReportAccordionList: React.FC<ReportAccordionListProps> = ({
  reports,
  onDelete,
  initialExpandedId,
}) => {
  const { t } = useTranslation();
  const [expandedReports, setExpandedReports] = useState<Set<string>>(
    new Set()
  );
  const [copiedStates, setCopiedStates] = useState<Set<string>>(new Set());
  const reportRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});

  // Expandir automáticamente el informe inicial y hacer scroll si corresponde
  useEffect(() => {
    if (initialExpandedId) {
      setExpandedReports(new Set([initialExpandedId]));
    }
  }, [initialExpandedId]);

  // Además, cuando cambia initialExpandedId, forzar la expansión aunque el usuario haya minimizado antes
  useEffect(() => {
    if (initialExpandedId) {
      setExpandedReports(new Set([initialExpandedId]));
    }
  }, [initialExpandedId, reports.length]);

  const toggleReport = (reportId: string) => {
    const newExpanded = new Set(expandedReports);
    if (newExpanded.has(reportId)) {
      newExpanded.delete(reportId);
    } else {
      newExpanded.add(reportId);
    }
    setExpandedReports(newExpanded);
  };

  const handleCopy = async (report: Report) => {
    try {
      await navigator.clipboard.writeText(report.content);
      const newCopied = new Set(copiedStates);
      newCopied.add(report.id || '');
      setCopiedStates(newCopied);
      setTimeout(() => {
        const newCopied = new Set(copiedStates);
        newCopied.delete(report.id || '');
        setCopiedStates(newCopied);
      }, 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Filtrar informes válidos
  const validReports = reports.filter(report => {
    const filteredContent = removeRecommendedProductsSection(
      filterPersonalizationSummary(report.content)
    );
    const supplements = extractSupplementsWithLinks(report.content);
    return (
      filteredContent &&
      typeof filteredContent === 'string' &&
      Array.isArray(supplements) &&
      supplements.length > 0
    );
  });

  // Vista móvil: Tarjetas-resumen compactas y expansión sin corte
  const MobileView = () => (
    <div className='space-y-3 sm:hidden'>
      {validReports.length === 0 ? (
        <div className='text-red-600 text-center font-bold'>
          No hay informes válidos para mostrar.
        </div>
      ) : (
        validReports.map((report, index) => {
          const isExpanded = expandedReports.has(report.id || '');
          const isCopied = copiedStates.has(report.id || '');
          const excerpt = generateExcerpt(report.content);
          const supplements = extractSupplementsWithLinks(report.content);
          const filteredContent = removeRecommendedProductsSection(
            filterPersonalizationSummary(report.content)
          );
          const reportId = report.id || String(index);

          return (
            <div
              key={report.id || index}
              ref={el => (reportRefs.current[reportId] = el)}
              className={`transition-shadow duration-200 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden ${isExpanded ? 'shadow-2xl' : ''}`}
            >
              {/* Header de la tarjeta */}
              <div
                className='flex items-center justify-between px-4 py-2 bg-gradient-to-r from-red-600 to-red-400 dark:from-red-800 dark:to-red-600 cursor-pointer min-h-[56px]'
                onClick={() => toggleReport(report.id || '')}
              >
                <div className='flex items-center gap-3 min-w-0'>
                  {FaFile({ className: 'text-white text-lg flex-shrink-0' })}
                  <div className='min-w-0'>
                    <h3 className='text-white font-bold text-sm truncate max-w-[180px]'>
                      {t('report.title')}
                    </h3>
                    <p className='text-red-100 text-xs truncate'>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  {isExpanded
                    ? FaChevronUp({ className: 'text-white text-lg' })
                    : FaChevronDown({ className: 'text-white text-lg' })}
                </div>
              </div>

              {/* Extracto cuando está colapsado */}
              {!isExpanded && (
                <div className='px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800'>
                  <p
                    className='text-gray-600 dark:text-gray-300 text-xs leading-snug line-clamp-4'
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {excerpt}
                  </p>
                </div>
              )}

              {/* Contenido completo cuando está expandido */}
              <div
                className={`transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100 py-2' : 'opacity-0 p-0 pointer-events-none'}`}
              >
                {isExpanded && (
                  <div className='px-3 pt-1 pb-2'>
                    {/* Botones de acción */}
                    <div className='flex items-center justify-between mb-2'>
                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                        {new Date(report.createdAt).toLocaleString()}
                      </div>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleCopy(report);
                          }}
                          className='flex items-center justify-center w-7 h-7 rounded-lg border border-red-200 dark:border-red-400 bg-white dark:bg-gray-900 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-800 transition'
                          title={t('report.copy')}
                        >
                          {isCopied
                            ? FaCircleCheck({ className: 'text-green-500' })
                            : FaRegCopy({})}
                        </button>
                        {filteredContent &&
                        Array.isArray(supplements) &&
                        supplements.length > 0 ? (
                          <Suspense
                            fallback={
                              <span className='text-xs'>Cargando PDF...</span>
                            }
                          >
                            <PDFDownloadLink
                              document={
                                <ReportPDF
                                  title={
                                    filteredContent
                                      ? 'Informe personalizado'
                                      : ''
                                  }
                                  content={filteredContent || ''}
                                  supplements={supplements || []}
                                  date={
                                    report && report.createdAt
                                      ? new Date(
                                          report.createdAt
                                        ).toLocaleDateString()
                                      : ''
                                  }
                                />
                              }
                              fileName={`informe-${report && report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'sin-fecha'}.pdf`}
                              className='flex items-center justify-center w-7 h-7 rounded-lg border border-blue-200 dark:border-blue-400 bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800 transition'
                              style={{ textDecoration: 'none' }}
                            >
                              {({ loading }) => (
                                <>
                                  {loading ? (
                                    <span className='text-xs'>...</span>
                                  ) : (
                                    FaDownload({ className: 'text-lg' })
                                  )}
                                </>
                              )}
                            </PDFDownloadLink>
                          </Suspense>
                        ) : (
                          <div className='text-red-600 text-center font-bold'>
                            No hay datos suficientes para generar el PDF.
                          </div>
                        )}
                        {onDelete && report.id && (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              if (
                                window.confirm(
                                  '¿Seguro que quieres eliminar este informe?'
                                ) &&
                                report.id
                              ) {
                                onDelete(report.id);
                              }
                            }}
                            className='flex items-center justify-center w-7 h-7 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition'
                            title={t('report.delete')}
                          >
                            {FaTrash({ className: 'text-lg' })}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Contenido del informe */}
                    <div className='prose max-w-none bg-white p-2 rounded-xl mb-2 text-xs'>
                      {(() => {
                        let cleanMarkdown = filteredContent
                          .replace(/^```[a-z]*\n?/i, '') // elimina ``` al inicio
                          .replace(/```$/i, '') // elimina ``` al final
                          .split('\n')
                          .map(line => line.replace(/^\s+/, ''))
                          .join('\n');
                        return <ReactMarkdown>{cleanMarkdown}</ReactMarkdown>;
                      })()}
                    </div>

                    {/* Sección de Productos Recomendados */}
                    {supplements.length > 0 && (
                      <div className='px-2 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60'>
                        <h3 className='text-xs font-bold text-red-600 dark:text-red-400 mb-2'>
                          Productos Recomendados
                        </h3>
                        <ul className='space-y-2'>
                          {supplements.map((supplement, idx) => (
                            <AccordionSupplement
                              key={supplement.name + '-' + idx}
                              supplement={supplement.name}
                            />
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  // Vista escritorio: Lista completa (delegar a ReportView)
  const DesktopView = () => (
    <div className='hidden sm:block space-y-6'>
      {validReports.length === 0 ? (
        <div className='text-red-600 text-center font-bold'>
          No hay informes válidos para mostrar.
        </div>
      ) : (
        validReports.map((report, index) => (
          <ReportView
            key={report.id || index}
            report={report}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );

  return (
    <div>
      <MobileView />
      <DesktopView />
    </div>
  );
};

export default ReportAccordionList;
