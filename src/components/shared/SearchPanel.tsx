import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';

interface SearchPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  results: Array<{ id: string; category: string; title: string; snippet?: string; }>;
  onResultClick: (result: { id: string; category: string; }) => void;
}

// Este es un componente de marcador de posición.
// Deberá ser implementado con la lógica de búsqueda de suplementos.
const SearchPanel: React.FC<SearchPanelProps> = ({
  searchQuery,
  onSearchChange,
  results,
  onResultClick,
}) => {
  const { t } = useTranslation();
  const searchPanelRef = useRef<HTMLFormElement>(null);
  const [isResultsVisible, setIsResultsVisible] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchPanelRef.current && !searchPanelRef.current.contains(event.target as Node)) {
        setIsResultsVisible(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <form ref={searchPanelRef} className="relative w-full max-w-xs" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder={t('search.placeholder')}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
        aria-label={t('Buscar')}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={() => setIsResultsVisible(true)}
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        {FaSearch({ className: 'text-gray-400' })}
      </div>
      
      {isResultsVisible && searchQuery && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50 max-h-80 overflow-y-auto animate-fade-in">
          <ul>
            {results.map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    onResultClick(result);
                    setIsResultsVisible(false);
                  }}
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{t(result.title)}</span>
                  <span className="block text-sm text-red-600 dark:text-red-400 capitalize">{t(result.category)}</span>
                  {result.snippet && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic truncate">
                      {result.snippet}
                    </p>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default SearchPanel; 