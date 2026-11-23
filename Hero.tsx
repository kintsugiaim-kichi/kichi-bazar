import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle, ArrowDown } from 'lucide-react';
import { CategoryId, STORE_LINKS } from '../data/catalog';

interface HeroProps {
  onExploreClick: () => void;
  onCategoryIconClick: (category: Exclude<CategoryId, 'todos'>) => void;
}

interface IconHotspot {
  category: Exclude<CategoryId, 'todos'>;
  label: string;
  style: React.CSSProperties;
}

const HERO_ICON_HOTSPOTS: IconHotspot[] = [
  {
    category: 'papeleria',
    label: 'Ir a Papelería Creativa',
    style: { left: '27.2%', top: '66.5%', width: '9.2%', height: '30.5%' },
  },
  {
    category: 'belleza',
    label: 'Ir a Belleza',
    style: { left: '36.8%', top: '66.5%', width: '8.4%', height: '30.5%' },
  },
  {
    category: 'personalizados',
    label: 'Ir a Productos Personalizados',
    style: { left: '45.5%', top: '66.5%', width: '10.6%', height: '30.5%' },
  },
  {
    category: 'joyas',
    label: 'Ir a Joyas',
    style: { left: '56.4%', top: '66.5%', width: '7.8%', height: '30.5%' },
  },
  {
    category: 'manualidades',
    label: 'Ir a Manualidades',
    style: { left: '64.4%', top: '66.5%', width: '9.2%', height: '30.5%' },
  },
];

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onCategoryIconClick,
}) => {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b border-[#E9D7C8] bg-[#FDF6F2]"
    >
      {/* Portada panorámica en proporción completa sin recortes */}
      <div className="w-full bg-[#FDF6F2]">
        <div className="relative max-w-[1600px] mx-auto">
          <img
            src={STORE_LINKS.heroPanoramic}
            alt="Portada de Kichi BAZAR con logo circular central, detalles artesanales y las 5 categorías: Papelería Creativa, Belleza, Productos Personalizados, Joyas y Manualidades"
            referrerPolicy="no-referrer"
            className="w-full h-auto block select-none"
          />

          {/* 5 áreas clicables invisibles alineadas sobre los íconos inferiores */}
          {HERO_ICON_HOTSPOTS.map((hotspot) => (
            <button
              key={hotspot.category}
              type="button"
              onClick={() => onCategoryIconClick(hotspot.category)}
              aria-label={hotspot.label}
              title={hotspot.label}
              style={hotspot.style}
              className="absolute z-10 bg-transparent cursor-pointer rounded-xl transition-transform duration-150 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B86F68]/80"
            />
          ))}
        </div>
      </div>

      {/* Franja luminosa inferior con el mensaje principal y botones de acción */}
      <div className="bg-gradient-to-b from-[#FDF6F2] via-[#FDF9F6] to-[#FDF9F6] border-t border-[#EEDFD2]/70">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto px-6 sm:px-10 py-9 sm:py-12 flex flex-col items-center text-center"
        >
          <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.65rem] font-semibold leading-[1.2] text-[#3B2A28] [text-wrap:balance] mb-3.5">
            Lindos detalles para expresar tu cariño.
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-[#57413D] max-w-xl mx-auto mb-7">
            Tienda de regalos online: productos personalizados, papelería creativa,
            belleza, joyas y manualidades.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={onExploreClick}
              className="btn-rose-gold w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg text-sm font-semibold text-white whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8F4E48]"
            >
              <span>Explorar el bazar</span>
              <ArrowDown className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>

            <a
              href={STORE_LINKS.whatsappBusiness}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-rose-gold-outline w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg text-sm font-semibold text-[#7A3F3A] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8F4E48]"
            >
              <MessageCircle className="w-4 h-4 shrink-0 text-[#B56560]" aria-hidden="true" />
              <span>Pedir por WhatsApp</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
