import React from 'react';
import { StoreCategoryId } from '../utils/googleSheetsCatalog';

interface CategoryIconSvgProps {
  category: StoreCategoryId;
  className?: string;
}

export const CategoryIconSvg: React.FC<CategoryIconSvgProps> = ({
  category,
  className = 'w-14 h-14',
}) => {
  switch (category) {
    case 'personalizados':
      // Tazón rosa pastel con grietas finitas doradas estilo kintsugi
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="kintsugiGoldMug" x1="16" y1="22" x2="58" y2="62" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E4BE7B" />
              <stop offset="50%" stopColor="#C8934B" />
              <stop offset="100%" stopColor="#EED199" />
            </linearGradient>
          </defs>
          {/* Vapor suave */}
          <path
            d="M31 18c-1.5-2.5 1.5-4.5 0-7M40 16c-1.5-2.5 1.5-4.5 0-7M49 18c-1.5-2.5 1.5-4.5 0-7"
            stroke="#D6A96C"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {/* Asa del tazón */}
          <path
            d="M54 31h6.5a6.5 6.5 0 0 1 6.5 6.5v3a6.5 6.5 0 0 1-6.5 6.5H54"
            stroke="#B67670"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          {/* Cuerpo tazón rosa pastel */}
          <path
            d="M19 25h36v26c0 7.18-5.82 13-13 13H32c-7.18 0-13-5.82-13-13V25Z"
            fill="#FADCE0"
            stroke="#B67670"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          {/* Borde superior del tazón */}
          <ellipse cx="37" cy="25" rx="18" ry="2.6" fill="#FCEBEF" stroke="#B67670" strokeWidth="1.4" />
          {/* Grietas finitas doradas kintsugi */}
          <path
            d="M21 34l8.5 5.5 6.5-4 8.5 6.5 9.5-3.5"
            stroke="url(#kintsugiGoldMug)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M29.5 39.5l-2 9.5 6 6.5M44.5 42l2.5 10.5-4.5 6"
            stroke="url(#kintsugiGoldMug)"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pequeño corazón */}
          <path
            d="M37 46.5c0-2 2.7-3 3.8-1 1.1-2 3.8-1 3.8 1 0 2.7-3.8 5-3.8 5s-3.8-2.3-3.8-5Z"
            fill="#F4B7C2"
            stroke="#C8934B"
            strokeWidth="1"
          />
        </svg>
      );

    case 'papeleria':
      // Agenda bonita con detalles delicados
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
          {/* Cinta marcapáginas */}
          <path
            d="M46 58v12l-3.5-2.6L39 70V58"
            fill="#F4C7C9"
            stroke="#9C6B7C"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          {/* Portada de la agenda */}
          <rect
            x="21"
            y="14"
            width="40"
            height="48"
            rx="5"
            fill="#EDE3F6"
            stroke="#8E6C8A"
            strokeWidth="1.6"
          />
          {/* Lomo con anillos delicados */}
          <path d="M29 14v48" stroke="#D1A66B" strokeWidth="1.2" />
          <path
            d="M18 22h6M18 30h6M18 38h6M18 46h6M18 54h6"
            stroke="#C99A5B"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Etiqueta central */}
          <rect
            x="35"
            y="24"
            width="19"
            height="14"
            rx="2.5"
            fill="#FFFDFB"
            stroke="#D1A66B"
            strokeWidth="1.2"
          />
          <path
            d="M39 29.5h11M41 33.5h7"
            stroke="#9C6B7C"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Florecita / brillo delicado */}
          <circle cx="44.5" cy="48" r="3.2" fill="#FBE5D8" stroke="#C99A5B" strokeWidth="1.1" />
          <circle cx="44.5" cy="48" r="1" fill="#C99A5B" />
        </svg>
      );

    case 'belleza':
      // Labial y frasco de perfume
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
          {/* Frasco de perfume */}
          <rect
            x="16"
            y="30"
            width="28"
            height="33"
            rx="6"
            fill="#FCE2E4"
            stroke="#A86464"
            strokeWidth="1.6"
          />
          {/* Líquido interior suave */}
          <rect
            x="20"
            y="38"
            width="20"
            height="21"
            rx="3.5"
            fill="#F8C8CE"
            opacity="0.7"
          />
          {/* Cuello y tapa dorada del perfume */}
          <rect x="25" y="24" width="10" height="6" rx="1.5" fill="#EAD0A0" stroke="#A86464" strokeWidth="1.3" />
          <rect x="23" y="15" width="14" height="9" rx="2.5" fill="#FFFDFB" stroke="#C89656" strokeWidth="1.5" />
          <circle cx="30" cy="47" r="4" fill="#FFFDFB" stroke="#C89656" strokeWidth="1.2" />

          {/* Labial */}
          <rect
            x="49"
            y="43"
            width="14"
            height="20"
            rx="2.5"
            fill="#EBD2A8"
            stroke="#A86464"
            strokeWidth="1.5"
          />
          <rect
            x="51"
            y="36"
            width="10"
            height="7"
            rx="1"
            fill="#FFFDFB"
            stroke="#C89656"
            strokeWidth="1.3"
          />
          <path
            d="M52 36v-8.5c0-2 4-5.5 6-5.5s2 3.5 2 5.5V36h-8Z"
            fill="#E37C88"
            stroke="#A86464"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'joyas':
      // Cadenita delicada con un colgante
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
          {/* Cadenita curva */}
          <path
            d="M15 17c3 22 14 35 25 35s22-13 25-35"
            stroke="#C89656"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeDasharray="1.8 2.2"
          />
          {/* Argolla conectora */}
          <circle cx="40" cy="53.5" r="2.2" fill="#FFFDFB" stroke="#C89656" strokeWidth="1.3" />
          {/* Colgante */}
          <path
            d="M40 56l7 7.5-7 7.5-7-7.5L40 56Z"
            fill="#FADDE1"
            stroke="#B1716D"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M40 59.5l3.5 4-3.5 4-3.5-4 3.5-4Z"
            fill="#FFFDFB"
            stroke="#C89656"
            strokeWidth="1"
          />
          {/* Destellos suaves */}
          <path
            d="M24 27v4M22 29h4M56 27v4M54 29h4"
            stroke="#D9AB6B"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'manualidades':
      // Frasco de vidrio con luces de hada brillantes adentro
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
          {/* Corcho / tapa */}
          <rect
            x="31"
            y="14"
            width="18"
            height="7"
            rx="2"
            fill="#E3C093"
            stroke="#9B665D"
            strokeWidth="1.4"
          />
          {/* Moñito delicado */}
          <path
            d="M40 23c-4.5-4-10-3.5-10 0s5.5 2.5 10 0Zm0 0c4.5-4 10-3.5 10 0s-5.5 2.5-10 0Z"
            fill="#F6C5CB"
            stroke="#A86464"
            strokeWidth="1.2"
          />
          {/* Frasco de vidrio */}
          <path
            d="M28 21h24l5 9v28a7 7 0 0 1-7 7H30a7 7 0 0 1-7-7V30l5-9Z"
            fill="#E8F3EC"
            fillOpacity="0.65"
            stroke="#7B9B86"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Hilo de cobre con luces de hada */}
          <path
            d="M31 34c9 5 18 10 12 18s-12 6-6 0"
            stroke="#C89656"
            strokeWidth="1.1"
            strokeDasharray="2 2.5"
          />
          {/* Luces brillantes */}
          <circle cx="34" cy="36" r="3.5" fill="#FDE6A6" opacity="0.65" />
          <circle cx="34" cy="36" r="2" fill="#FFF7D6" stroke="#D49A3E" strokeWidth="1" />

          <circle cx="47" cy="44" r="4" fill="#FDE6A6" opacity="0.7" />
          <circle cx="47" cy="44" r="2.2" fill="#FFF7D6" stroke="#D49A3E" strokeWidth="1" />

          <circle cx="35" cy="53" r="3.5" fill="#FDE6A6" opacity="0.65" />
          <circle cx="35" cy="53" r="2" fill="#FFF7D6" stroke="#D49A3E" strokeWidth="1" />

          <circle cx="45" cy="57" r="3" fill="#FDE6A6" opacity="0.65" />
          <circle cx="45" cy="57" r="1.7" fill="#FFF7D6" stroke="#D49A3E" strokeWidth="1" />
        </svg>
      );
  }
};
