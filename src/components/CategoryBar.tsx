import React from 'react';
import { CATEGORIES, CategoryId } from '../data/catalog';

interface CategoryBarProps {
  activeCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <section id="categorias" className="max-w-6xl mx-auto px-4 sm:px-8 pt-12 pb-6">
      <div className="flex flex-col items-center text-center mb-7">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#3B2A28] [text-wrap:balance] max-w-2xl">
          Mira nuestras ideas para regalar, crear o elegir algo para ti.
        </h2>
      </div>

      <div
        role="tablist"
        aria-label="Categorías de Kichi BAZAR"
        className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
      >
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(category.id)}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium border transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B86F68] ${
                isActive
                  ? `${category.macaronBg} ${category.macaronText} ${category.macaronBorder} shadow-[0_6px_16px_-8px_rgba(184,111,104,0.38)] ring-1 ring-[#C9A15D]/50`
                  : 'bg-[#FFFDFB] text-[#6E5854] border-[#EAD9CA] hover:border-[#C9A15D] hover:text-[#3B2A28]'
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};
