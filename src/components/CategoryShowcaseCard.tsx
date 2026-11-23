import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ShowcaseCardItem } from '../data/catalog';
import { CategoryIconSvg } from './CategoryIconSvg';

interface CategoryShowcaseCardProps {
  card: ShowcaseCardItem;
  onSelect: (categoryId: ShowcaseCardItem['categoryId']) => void;
}

export const CategoryShowcaseCard: React.FC<CategoryShowcaseCardProps> = ({
  card,
  onSelect,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [card.imageUrl]);

  const showImage = Boolean(card.imageUrl) && !imageFailed;

  return (
    <article
      onClick={() => onSelect(card.categoryId)}
      className="kintsugi-border group rounded-xl overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-1 shadow-[0_10px_28px_-16px_rgba(92,58,49,0.25)] cursor-pointer bg-[#FFFDFB]"
    >
      {/* Arriba: Fotografía real de la columna "foto" */}
      <div className="relative aspect-square w-full bg-gradient-to-br from-[#FDF8F4] via-[#FBF1EA] to-[#F7E7DF] border-b border-[#E9D4BE] overflow-hidden">
        {showImage ? (
          <img
            src={card.imageUrl ?? ''}
            alt={card.title}
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-8">
            <CategoryIconSvg category={card.categoryId} className="w-24 h-24" />
          </div>
        )}
      </div>

      {/* Centro y Abajo: Título grande + botón Conoce nuestro catálogo */}
      <div className="p-6 flex-1 flex flex-col items-center justify-between text-center gap-5">
        <h3 className="font-serif text-2xl font-semibold text-[#3B2A28] leading-snug [text-wrap:balance] group-hover:text-[#8F4E48] transition-colors">
          {card.title}
        </h3>

        <div className="w-full space-y-4">
          <div className="kintsugi-divider" aria-hidden="true" />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(card.categoryId);
            }}
            className="btn-rose-gold w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8F4E48]"
          >
            <span>Conoce nuestro catálogo</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
};
