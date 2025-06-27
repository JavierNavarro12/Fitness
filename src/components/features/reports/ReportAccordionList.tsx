import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Report } from '../../../types';
import { FaFile, FaRegCopy, FaCircleCheck, FaDownload, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa6';
// Lazy load PDFDownloadLink y ReportPDF
const PDFDownloadLink = React.lazy(() => import('@react-pdf/renderer').then(mod => ({ default: mod.PDFDownloadLink })));
const ReportPDF = React.lazy(() => import('./ReportPDF'));
import ReactMarkdown from 'react-markdown';
import ReportView from './ReportView';

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
    'Productos Recomendados', 'Enlaces a Productos Recomendados', 'Recomendaciones', 'Consideraciones', 'Resumen',
    'Siguientes Pasos', 'Plan Personalizado de Suplementación Deportiva', 'Introducción Personalizada',
    'Suplementos Base (Fundamentales)', 'Suplementos para tu Objetivo', 'Suplementos para tu Deporte',
    'Objetivo', 'Deporte', 'Base', 'Fundamentales', 'Adicionales', 'Pasos', 'Productos', 'Enlaces',
    'Recomendados', 'Recomendado', 'Adicional', 'Personalizado', 'Informe', 'Plan', 'Siguiente',
    'Siguientes', 'Consideración', 'Consideraciones', 'Resumen', 'Paso', 'Pasos', 'Entrenamiento',
    'Nutrición', 'Consejos', 'Ejercicios', 'Hidratación', 'Descanso', 'Fuerza', 'Cardio', 'Flexibilidad',
    'Recuperación', 'Rutina', 'Programa', 'Horario', 'Calendario', 'Semana', 'Día', 'Días',
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'Agua', 'Litros',
    'Horas', 'Noche', 'Pecho', 'Tríceps', 'Espalda', 'Bíceps', 'Piernas', 'Hombros', 'Abdominales',
    'Glúteos', 'Pantorrillas', 'Antebrazos', 'Trapecio', 'Deltoides', 'Pectorales', 'Dorsales',
    'Cuádriceps', 'Isquiotibiales', 'Gemelos',
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
  return supplementNames.map(name => ({
    name: name,
    link: `https://www.amazon.es/s?k=${encodeURIComponent(name)}`
  }));
}

// Filtrar líneas del resumen del formulario de personalización
function filterPersonalizationSummary(content: string): string {
  const keywords = [
    'Objetivo:', 'Deporte Principal:', 'Deporte principal:', 'Nivel de Experiencia:', 'Nivel de experiencia:',
    'Frecuencia de Entrenamiento:', 'Frecuencia de entrenamiento:', 'Peso:', 'Altura:', 'Edad:', 'Género:',
    'Condiciones Médicas:', 'Condiciones médicas:', 'Alergias:', 'Suplementos Actuales:', 'Suplementos actuales:'
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
  return filtered.join('\n').replace(/\[([^\]]+)\]\(URL del producto\)/gi, '$1');
}

function removeRecommendedProductsSection(content: string): string {
  const regex = /###\s*(Productos Recomendados|Recommended Products)/i;
  const lines = content.split('\n');
  const idx = lines.findIndex(line => regex.test(line));
  if (idx === -1) return content;
  return lines.slice(0, idx).join('\n').trim();
}

// Función para generar extracto del contenido
function generateExcerpt(content: string, maxLength: number = 200): string {
  const filteredContent = removeRecommendedProductsSection(filterPersonalizationSummary(content));
  const lines = filteredContent.split('\n').filter(line => line.trim());
  
  // Buscar el primer encabezado o párrafo significativo
  let excerpt = '';
  for (const line of lines) {
    if (line.startsWith('#') || line.startsWith('##') || line.startsWith('###')) {
      continue; // Saltar encabezados
    }
    if (line.trim() && line.length > 10) {
      excerpt = line.trim();
      break;
    }
  }
  
  if (!excerpt) {
    excerpt = filteredContent.substring(0, maxLength);
  }
  
  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength) + '...';
  }
  
  return excerpt;
}

const ReportAccordionList: React.FC<ReportAccordionListProps> = ({ reports, onDelete, initialExpandedId }) => {
  const { t } = useTranslation();
  const [expandedReports, setExpandedReports] = useState<Set<string>>(new Set());
  const [copiedStates, setCopiedStates] = useState<Set<string>>(new Set());
  const reportRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});

  // Expandir automáticamente el informe inicial y hacer scroll si corresponde
  useEffect(() => {
    if (initialExpandedId) {
      setExpandedReports(new Set([initialExpandedId]));
    }
  }, [initialExpandedId]);

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

  // Vista móvil: Tarjetas-resumen compactas y expansión sin corte
  const MobileView = () => (
    <div className="space-y-3 sm:hidden">
      {reports.map((report, index) => {
        const isExpanded = expandedReports.has(report.id || '');
        const isCopied = copiedStates.has(report.id || '');
        const excerpt = generateExcerpt(report.content);
        const supplements = extractSupplementsWithLinks(report.content);
        const filteredContent = removeRecommendedProductsSection(filterPersonalizationSummary(report.content));
        const reportId = report.id || String(index);

        return (
          <div
            key={index}
            ref={el => (reportRefs.current[reportId] = el)}
            className={`transition-shadow duration-200 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden ${isExpanded ? 'shadow-2xl' : ''}`}
          >
            {/* Header de la tarjeta */}
            <div
              className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-red-600 to-red-400 dark:from-red-800 dark:to-red-600 cursor-pointer min-h-[56px]"
              onClick={() => toggleReport(report.id || '')}
            >
              <div className="flex items-center gap-3 min-w-0">
                {FaFile({ className: "text-white text-lg flex-shrink-0" })}
                <div className="min-w-0">
                  <h3 className="text-white font-bold text-sm truncate max-w-[180px]">{t('report.title')}</h3>
                  <p className="text-red-100 text-xs truncate">{new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isExpanded ? FaChevronUp({ className: "text-white text-lg" }) : FaChevronDown({ className: "text-white text-lg" })}
              </div>
            </div>

            {/* Extracto cuando está colapsado */}
            {!isExpanded && (
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800">
                <p className="text-gray-600 dark:text-gray-300 text-xs leading-snug line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 8, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>{excerpt}</p>
              </div>
            )}

            {/* Contenido completo cuando está expandido */}
            <div
              className={`transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100 py-2' : 'opacity-0 max-h-0 p-0 pointer-events-none'}`}
              style={isExpanded ? { maxHeight: '2000px' } : { maxHeight: 0 }}
            >
              {isExpanded && (
                <div className="px-3 pt-1 pb-2">
                  {/* Botones de acción */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(report.createdAt).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopy(report); }}
                        className="flex items-center justify-center w-7 h-7 rounded-lg border border-red-200 dark:border-red-400 bg-white dark:bg-gray-900 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-800 transition"
                        title={t('report.copy')}
                      >
                        {isCopied ? FaCircleCheck({ className: "text-green-500" }) : FaRegCopy({})}
                      </button>
                      <Suspense fallback={<span className="text-xs">Cargando PDF...</span>}>
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
                          className="flex items-center justify-center w-7 h-7 rounded-lg border border-blue-200 dark:border-blue-400 bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800 transition"
                          style={{ textDecoration: 'none' }}
                        >
                          {({ loading }) => (
                            <>{loading ? <span className="text-xs">...</span> : FaDownload({ className: "text-lg" })}</>
                          )}
                        </PDFDownloadLink>
                      </Suspense>
                      {onDelete && report.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('¿Seguro que quieres eliminar este informe?') && report.id) {
                              onDelete(report.id);
                            }
                          }}
                          className="flex items-center justify-center w-7 h-7 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition"
                          title={t('report.delete')}
                        >
                          {FaTrash({ className: "text-lg" })}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Contenido del informe */}
                  <div className="prose max-w-none bg-white p-2 rounded-xl mb-2 text-xs">
                    <ReactMarkdown>{filteredContent}</ReactMarkdown>
                  </div>

                  {/* Sección de Productos Recomendados */}
                  {supplements.length > 0 && (
                    <div className="px-2 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60">
                      <h3 className="text-xs font-bold text-red-600 dark:text-red-400 mb-2">Productos Recomendados</h3>
                      <ul className="space-y-1">
                        {supplements.map((supplement, idx) => (
                          <li key={idx} className="flex items-center">
                            <a
                              href={supplement.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition"
                            >
                              {supplement.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Vista escritorio: Lista completa (delegar a ReportView)
  const DesktopView = () => (
    <div className="hidden sm:block space-y-6">
      {reports.map((report, index) => (
        <ReportView key={index} report={report} onDelete={onDelete} />
      ))}
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