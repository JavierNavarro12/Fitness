import React, { useState } from 'react';

const sections = [
  { key: 'conocenos', label: 'Conócenos' },
  { key: 'deportes', label: 'Deportes' },
  { key: 'salud', label: 'Salud y Bienestar' },
  { key: 'grasa', label: 'Quema de Grasa' },
  { key: 'mujer', label: 'Específico Mujer' },
  { key: 'cognitivo', label: 'Rendimiento Cognitivo' },
];

interface MegaMenuProps {
  onSectionSelect?: (key: string) => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ onSectionSelect }) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative w-full bg-white border-b border-gray-200 z-50">
      <div className="flex justify-center py-3">
        <div
          className="relative"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button
            className={`px-6 py-2 text-base font-semibold transition-colors duration-200 rounded hover:bg-gray-100 focus:outline-none text-gray-800`}
          >
            Inicio
          </button>
          {open && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-fade-in min-w-[700px] flex flex-row p-8 gap-12">
              {sections.map((section) => (
                <button
                  key={section.key}
                  className="text-lg font-semibold text-gray-800 hover:text-red-600 transition-colors mb-2 text-left"
                  onClick={() => onSectionSelect && onSectionSelect(section.key)}
                >
                  {section.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MegaMenu; 