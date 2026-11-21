export type CategoryId =
  | 'todos'
  | 'personalizados'
  | 'papeleria'
  | 'belleza'
  | 'joyas'
  | 'manualidades';

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  shortLabel: string;
  description: string;
  macaronBg: string;
  macaronText: string;
  macaronBorder: string;
}

export type ProductMotif =
  | 'mug'
  | 'tote'
  | 'giftset'
  | 'notebook'
  | 'stickers'
  | 'deskset'
  | 'necklace'
  | 'earrings'
  | 'bracelet'
  | 'fairylights'
  | 'upcycle'
  | 'beauty';

export interface ProductItem {
  id: string;
  name: string;
  category: Exclude<CategoryId, 'todos'>;
  categoryLabel: string;
  description: string;
  priceClp: number;
  rawPriceLabel?: string;
  motif: ProductMotif;
  /** Reemplaza null por la ruta de tu foto real (ej: "/assets/productos/taza.jpg") */
  imageUrl: string | null;
  detailNote: string;
  isOriflameLink?: boolean;
}

/**
 * Enlaces editables de la tienda Kichi BAZAR.
 * Cambia cualquiera de estas URLs cuando necesites actualizarlas.
 */
export const STORE_LINKS = {
  googleSheetsCsvUrl:
    import.meta.env.VITE_GOOGLE_SHEETS_CSV_URL ||
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vS4T9NneH0_lTmSJKOGjxGtqe9Rc9kBV7JPeDpReCalCUbSgS-_nLCfZFjqeF2cWwm4A2YrbWhKodHG/pub?output=csv',
  whatsappBusiness: 'https://wa.me/message/AJCBBPZYUQXNP1',
  oriflameStore: 'https://shop.oriflame.com/CL-kichi8/cSSgjkmIV',
  oriflameSponsorText: 'fuiste invitado por Verónica Sol Cisternas/ kichi8',
  instagram: 'https://www.instagram.com/kichibazar.cl/',
  facebook: 'https://www.facebook.com/kichibazar/',
  heroBackground: '/assets/aistudio/image_e07945d0_a98f2d6a.jpg',
  heroLogo: '/assets/aistudio/logo_kichi_bazar_cd60fde7.png',
  heroPanoramic: '/assets/aistudio/portada_landing_y_pface_ccc0bb21.jpg',
  kichiBotAvatar: '/assets/aistudio/logo_kichi_bot_ff4bc4b4.png',
} as const;

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'todos',
    label: 'Todo el bazar',
    shortLabel: 'Todos',
    description: 'Explora todos los detalles hechos y seleccionados con cariño.',
    macaronBg: 'bg-[#FAF3EC]',
    macaronText: 'text-[#3B2A28]',
    macaronBorder: 'border-[#DFC6B2]',
  },
  {
    id: 'personalizados',
    label: 'Productos Personalizados',
    shortLabel: 'Personalizados',
    description: 'Artículos estampados con diseños únicos, nombres y dedicatorias.',
    macaronBg: 'bg-[#FCE8DC]',
    macaronText: 'text-[#734232]',
    macaronBorder: 'border-[#EAC6B0]',
  },
  {
    id: 'papeleria',
    label: 'Papelería Creativa',
    shortLabel: 'Papelería',
    description: 'Libretas ilustradas, tarjetas de dedicatoria, stickers y escritorio.',
    macaronBg: 'bg-[#EDE6F5]',
    macaronText: 'text-[#4F4066]',
    macaronBorder: 'border-[#D5C9E6]',
  },
  {
    id: 'belleza',
    label: 'Belleza',
    shortLabel: 'Belleza',
    description: 'Cuidado personal y cosmética europea Oriflame desde la app oficial.',
    macaronBg: 'bg-[#FAE4E2]',
    macaronText: 'text-[#7A4043]',
    macaronBorder: 'border-[#EAC4C0]',
  },
  {
    id: 'joyas',
    label: 'Joyas',
    shortLabel: 'Joyas',
    description: 'Selección de joyas de plata con diseño delicado y atemporal.',
    macaronBg: 'bg-[#FBF2D8]',
    macaronText: 'text-[#695426]',
    macaronBorder: 'border-[#E6D6A6]',
  },
  {
    id: 'manualidades',
    label: 'Manualidades',
    shortLabel: 'Manualidades',
    description: 'Luces de hada decorativas y creaciones únicas de reciclaje creativo.',
    macaronBg: 'bg-[#E3F0E8]',
    macaronText: 'text-[#335845]',
    macaronBorder: 'border-[#C1DEC9]',
  },
];

export const PRODUCTS: ProductItem[] = [
  // Productos Personalizados
  {
    id: 'taza-personalizada',
    name: 'Taza Cerámica Personalizada',
    category: 'personalizados',
    categoryLabel: 'Productos Personalizados',
    description:
      'Taza de cerámica de 11 oz estampada con diseños únicos, ilustraciones florales, nombres o tu frase favorita.',
    priceClp: 7990,
    motif: 'mug',
    imageUrl: null,
    detailNote: 'Apta para microondas · Incluye caja de regalo',
  },
  {
    id: 'bolsa-personalizada',
    name: 'Bolsa Tote Personalizada',
    category: 'personalizados',
    categoryLabel: 'Productos Personalizados',
    description:
      'Bolsa de tela resistente con estampado artesanal a elección, ideal para salidas, compras o un obsequio práctico.',
    priceClp: 9500,
    motif: 'tote',
    imageUrl: null,
    detailNote: 'Tela algodón natural · Estampado duradero',
  },
  {
    id: 'set-taza-bolsa',
    name: 'Dúo Regalo Taza + Bolsa',
    category: 'personalizados',
    categoryLabel: 'Productos Personalizados',
    description:
      'Combinación coordinada de taza y bolsa personalizada con tarjeta de dedicatoria Kichi lista para sorprender.',
    priceClp: 15990,
    motif: 'giftset',
    imageUrl: null,
    detailNote: 'Diseño coordinado · Empaque artesanal',
  },

  // Papelería Creativa
  {
    id: 'libreta-ilustrada',
    name: 'Libreta Ilustrada Kichi',
    category: 'papeleria',
    categoryLabel: 'Papelería Creativa',
    description:
      'Libreta de portada delicada con papel suave tono crema, pensada para anotar sueños, listas o diarios de gratitud.',
    priceClp: 6500,
    motif: 'notebook',
    imageUrl: null,
    detailNote: 'Hojas lisas o punteadas · 80 páginas',
  },
  {
    id: 'tarjetas-stickers',
    name: 'Set Tarjetas y Stickers',
    category: 'papeleria',
    categoryLabel: 'Papelería Creativa',
    description:
      'Colección de tarjetas de dedicatoria con mensajes afectuosos y planchas de stickers ilustrados para decorar tus regalos.',
    priceClp: 4200,
    motif: 'stickers',
    imageUrl: null,
    detailNote: 'Incluye 6 tarjetas + 2 láminas adhesivas',
  },
  {
    id: 'detalles-escritorio',
    name: 'Set Detalles de Escritorio',
    category: 'papeleria',
    categoryLabel: 'Papelería Creativa',
    description:
      'Notas adhesivas pastel, marcapáginas ilustrados y lápiz decorativo para llenar de calidez tu rincón de trabajo.',
    priceClp: 5900,
    motif: 'deskset',
    imageUrl: null,
    detailNote: 'Tonos pastel · Presentación en sobre kraft',
  },

  // Joyas
  {
    id: 'collar-plata-925',
    name: 'Collar Delicado de Plata 925',
    category: 'joyas',
    categoryLabel: 'Joyas',
    description:
      'Cadena fina de plata 925 con dije minimalista, pensada para brillar con sutileza en el día a día o en ocasiones especiales.',
    priceClp: 18900,
    motif: 'necklace',
    imageUrl: null,
    detailNote: 'Plata fina 925 · Cajita de presentación',
  },
  {
    id: 'aros-plata-organicos',
    name: 'Aros de Plata Diseño Delicado',
    category: 'joyas',
    categoryLabel: 'Joyas',
    description:
      'Aros livianos en plata de ley con silueta orgánica y brillo suave, cómodos para llevar desde la mañana hasta la noche.',
    priceClp: 14500,
    motif: 'earrings',
    imageUrl: null,
    detailNote: 'Plata 925 hipoalergénica',
  },

  // Manualidades
  {
    id: 'luces-de-hada',
    name: 'Frasco con Luces de Hada',
    category: 'manualidades',
    categoryLabel: 'Manualidades',
    description:
      'Pieza decorativa hecha a mano mediante reciclaje creativo de vidrio, iluminada con cálidas luces de hada y detalles dorados.',
    priceClp: 8900,
    motif: 'fairylights',
    imageUrl: null,
    detailNote: 'Reciclaje creativo · Luz cálida LED',
  },
  {
    id: 'creacion-reciclaje',
    name: 'Florero de Reciclaje Creativo',
    category: 'manualidades',
    categoryLabel: 'Manualidades',
    description:
      'Creación única hecha a mano transformando materiales recuperados con textura artesanal y delicadas vetas doradas kintsugi.',
    priceClp: 7500,
    motif: 'upcycle',
    imageUrl: null,
    detailNote: 'Pieza única hecha a mano en Iquique',
  },

  // Belleza (conexión directa con sección Oriflame)
  {
    id: 'oriflame-cuidado',
    name: 'Línea Belleza & Cuidado Oriflame',
    category: 'belleza',
    categoryLabel: 'Belleza',
    description:
      'Fragancias, cuidado facial y bienestar de origen sueco. Regístrate como cliente con beneficios comprando directo desde la app.',
    priceClp: 0,
    motif: 'beauty',
    imageUrl: null,
    detailNote: 'Compra directa en tienda y app Oriflame',
    isOriflameLink: true,
  },
];

export function formatClp(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount);
}
