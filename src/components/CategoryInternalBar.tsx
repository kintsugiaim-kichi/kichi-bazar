import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CATEGORIES } from '../data/catalog';
import { StoreCategoryId } from '../utils/googleSheetsCatalog';
import { CategoryIconSvg } from './CategoryIconSvg';

interface CategoryInternalBarProps {
  activeCategory: StoreCategoryId;
  onSelectCategory: (category: StoreCategoryId) => void;
  onBackHome: () => void;
}

const MENU_CATEGORIES = CATEGORIES.filter(
  (c): c is (typeof CATEGORIES)[number] & { id: StoreCategoryId } => c.id !== 'todos'
);

export const CategoryInternalBar: React.FC<CategoryInternalBarProps> = ({
  activeCategory,
  onSelectCategory,
  onBackHome,
}) => {
  return (
    <div className="bg-[#FAF3EC]/90 border-b border-[#EAD5C3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackHome}
          className="btn-rose-gold-outline inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-[#7A3F3A] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B86F68]"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-[#B86F68]" aria-hidden="true" />
          <span>Volver al inicio</span>
        </button>

        <nav
          aria-label="Cambiar de categoría"
          className="flex items-center gap-2 overflow-x-auto pb-0.5 max-w-full"
        >
          {MENU_CATEGORIES.map((category) => {
            const isActive = category.id === activeCategory;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategory(category.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B86F68] ${
                  isActive
                    ? `${category.macaronBg} ${category.macaronText} ${category.macaronBorder} ring-1 ring-[#C9A15D]/55 shadow-xs`
                    : 'bg-[#FFFDFB] text-[#6E5854] border-[#EAD9CA] hover:border-[#C9A15D] hover:text-[#3B2A28]'
                }`}
              >
                <CategoryIconSvg category={category.id} className="w-5 h-5 shrink-0" />
                <span>{category.shortLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
