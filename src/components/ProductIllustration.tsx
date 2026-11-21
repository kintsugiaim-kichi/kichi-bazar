import React from 'react';
import { ProductMotif } from '../data/catalog';

interface ProductIllustrationProps {
  motif: ProductMotif;
}

export const ProductIllustration: React.FC<ProductIllustrationProps> = ({ motif }) => {
  const strokeMain = '#9D5D56';
  const strokeGold = '#C79B58';
  const fillSoft = '#FBE8E2';

  switch (motif) {
    case 'mug':
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" aria-hidden="true">
          <path
            d="M32 42h44v40c0 9.941-8.059 18-18 18H50c-9.941 0-18-8.059-18-18V42Z"
            fill={fillSoft}
            stroke={strokeMain}
            strokeWidth="1.6"
          />
          <path
            d="M76 50h9c5.523 0 10 4.477 10 10v4c0 5.523-4.477 10-10 10h-9"
            stroke={strokeMain}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M49 62c0-3.5 4.8-5.5 7-1.8 2.2-3.7 7-1.7 7 1.8 0 5-7 9.5-7 9.5s-7-4.5-7-9.5Z"
            stroke={strokeGold}
            strokeWidth="1.5"
            fill="#F6D6CF"
          />
          <path
            d="M45 31c-2-3.5 2-6.5 0-10M56 29c-2-3.5 2-6.5 0-10M67 31c-2-3.5 2-6.5 0-10"
            stroke={strokeGold}
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'tote':
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" aria-hidden="true">
          <path
            d="M44 42V32c0-8.837 7.163-16 16-16s16 7.163 16 16v10"
            stroke={strokeGold}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M28 42h64l-5 54a6 6 0 0 1-6 5H39a6 6 0 0 1-6-5l-5-54Z"
            fill={fillSoft}
            stroke={strokeMain}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M48 70c4-8 12-10 18-4-4 8-12 10-18 4Z"
            stroke={strokeGold}
            strokeWidth="1.4"
            fill="#F4D8CE"
          />
          <path d="M55 78c4-5 11-9 17-10" stroke={strokeMain} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );

    case 'giftset':
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" aria-hidden="true">
          <rect
            x="26"
            y="48"
            width="68"
            height="48"
            rx="4"
            fill={fillSoft}
            stroke={strokeMain}
            strokeWidth="1.6"
          />
          <rect
            x="22"
            y="38"
            width="76"
            height="12"
            rx="3"
            fill="#FFFDFB"
            stroke={strokeMain}
            strokeWidth="1.6"
          />
          <path d="M60 38v58" stroke={strokeGold} strokeWidth="1.8" />
          <path
            d="M60 38c-7-10-18-10-18-3s11 5 18 3Zm0 0c7-10 18-10 18-3s-11 5-18 3Z"
            stroke={strokeGold}
            strokeWidth="1.5"
            fill="#FBE5D8"
          />
        </svg>
      );

    case 'notebook':
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" aria-hidden="true">
          <rect
            x="32"
            y="22"
            width="56"
            height="76"
            rx="5"
            fill={fillSoft}
            stroke={strokeMain}
            strokeWidth="1.6"
          />
          <path d="M43 22v76" stroke={strokeGold} strokeWidth="1.4" />
          <rect x="52" y="42" width="24" height="14" rx="2" fill="#FFFDFB" stroke={strokeGold} strokeWidth="1.3" />
          <path d="M52 68h22M52 75h16" stroke={strokeMain} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );

    case 'stickers':
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" aria-hidden="true">
          <rect
            x="26"
            y="30"
            width="50"
            height="64"
            rx="4"
            transform="rotate(-5 26 30)"
            fill="#FFFDFB"
            stroke={strokeMain}
            strokeWidth="1.5"
          />
          <rect
            x="46"
            y="28"
            width="50"
            height="64"
            rx="4"
            transform="rotate(4 46 28)"
            fill={fillSoft}
            stroke={strokeGold}
            strokeWidth="1.5"
          />
          <circle cx="71" cy="54" r="10" fill="#FFFDFB" stroke={strokeGold} strokeWidth="1.4" />
          <path d="M59 74h24M63 81h16" stroke={strokeMain} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case 'deskset':
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" aria-hidden="true">
          <rect x="28" y="46" width="44" height="44" rx="3" fill={fillSoft} stroke={strokeMain} strokeWidth="1.5" />
          <path d="M36 58h28M36 66h22M36 74h18" stroke={strokeGold} strokeWidth="1.3" strokeLinecap="round" />
          <path
            d="M84 26l8 5-22 48-9 4 1-10 22-47Z"
            fill="#FFFDFB"
            stroke={strokeMain}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M80 35l8 4" stroke={strokeGold} strokeWidth="1.4" />
        </svg>
      );

    case 'necklace':
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" aria-hidden="true">
          <path
            d="M30 26c4 30 16 48 30 48s26-18 30-48"
            stroke={strokeGold}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="60" cy="84" r="10" fill={fillSoft} stroke={strokeMain} strokeWidth="1.6" />
          <circle cx="60" cy="84" r="4" stroke={strokeGold} strokeWidth="1.3" />
          <path d="M60 71v3" stroke={strokeGold} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'earrings':
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" aria-hidden="true">
          <path d="M44 30v12" stroke={strokeGold} strokeWidth="1.6" strokeLinecap="round" />
          <ellipse cx="44" cy="64" rx="11" ry="18" fill={fillSoft} stroke={strokeMain} strokeWidth="1.6" />
          <circle cx="44" cy="44" r="3" fill="#FFFDFB" stroke={strokeGold} strokeWidth="1.4" />

          <path d="M76 30v12" stroke={strokeGold} strokeWidth="1.6" strokeLinecap="round" />
          <ellipse cx="76" cy="64" rx="11" ry="18" fill={fillSoft} stroke={strokeMain} strokeWidth="1.6" />
          <circle cx="76" cy="44" r="3" fill="#FFFDFB" stroke={strokeGold} strokeWidth="1.4" />
        </svg>
      );

    case 'fairylights':
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" aria-hidden="true">
          <rect x="47" y="24" width="26" height="8" rx="2" fill="#EBD2A4" stroke={strokeMain} strokeWidth="1.4" />
          <path
            d="M44 32h32l6 14v42a8 8 0 0 1-8 8H46a8 8 0 0 1-8-8V46l6-14Z"
            fill={fillSoft}
            stroke={strokeMain}
            strokeWidth="1.6"
          />
          <path
            d="M48 48c10 8 20 14 14 26s-14 10-8 2"
            stroke={strokeGold}
            strokeWidth="1.3"
            strokeDasharray="2 3"
          />
          <circle cx="52" cy="52" r="2.8" fill="#F6D58E" stroke={strokeGold} strokeWidth="1" />
          <circle cx="67" cy="63" r="3.2" fill="#F6D58E" stroke={strokeGold} strokeWidth="1" />
          <circle cx="54" cy="76" r="2.6" fill="#F6D58E" stroke={strokeGold} strokeWidth="1" />
          <circle cx="66" cy="82" r="2.4" fill="#F6D58E" stroke={strokeGold} strokeWidth="1" />
        </svg>
      );

    case 'upcycle':
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" aria-hidden="true">
          <path
            d="M48 44h24l6 44a8 8 0 0 1-8 8H50a8 8 0 0 1-8-8l6-44Z"
            fill={fillSoft}
            stroke={strokeMain}
            strokeWidth="1.6"
          />
          <path d="M47 64l12 8 15-10" stroke={strokeGold} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M56 44c-2-10-8-18-16-22M62 44c2-12 10-20 18-22" stroke={strokeMain} strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="40" cy="22" r="3" fill="#F6D6CF" stroke={strokeGold} strokeWidth="1.2" />
          <circle cx="80" cy="22" r="3" fill="#F6D6CF" stroke={strokeGold} strokeWidth="1.2" />
        </svg>
      );

    case 'beauty':
    default:
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" aria-hidden="true">
          <rect x="43" y="40" width="34" height="54" rx="6" fill={fillSoft} stroke={strokeMain} strokeWidth="1.6" />
          <rect x="51" y="25" width="18" height="15" rx="2" fill="#FFFDFB" stroke={strokeGold} strokeWidth="1.5" />
          <path d="M50 62h20M54 70h12" stroke={strokeGold} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
  }
};
