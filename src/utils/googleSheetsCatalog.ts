import { CategoryId, ProductItem, ProductMotif } from '../data/catalog';

export type StoreCategoryId = Exclude<CategoryId, 'todos'>;

/**
 * Extrae el ID de archivo de una URL de Google Drive (después de "/d/" o "id=")
 * y retorna el formato directo: https://lh3.googleusercontent.com/d/ID_DEL_ARCHIVO
 */
export function buildGoogleDriveImageUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  // Si ya viene en formato lh3.googleusercontent.com/d/ID
  const lh3Match = trimmed.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match?.[1]) {
    return `https://lh3.googleusercontent.com/d/${lh3Match[1]}`;
  }

  // Formato estándar: https://drive.google.com/file/d/ID/view...
  const pathIdMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (pathIdMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${pathIdMatch[1]}`;
  }

  // Formato query: https://drive.google.com/open?id=ID o uc?id=ID
  const queryIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryIdMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${queryIdMatch[1]}`;
  }

  // Si es otro enlace de imagen http(s) directo, lo conservamos
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return null;
}

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function mapSheetCategory(rawCategory: string): {
  id: StoreCategoryId;
  label: string;
} | null {
  const normalized = normalizeText(rawCategory);
  if (!normalized) return null;

  if (normalized.includes('personaliz')) {
    return { id: 'personalizados', label: 'Productos Personalizados' };
  }
  if (normalized.includes('papeler')) {
    return { id: 'papeleria', label: 'Papelería Creativa' };
  }
  if (normalized.includes('bellez') || normalized.includes('oriflame')) {
    return { id: 'belleza', label: 'Belleza' };
  }
  if (normalized.includes('joya') || normalized.includes('plata')) {
    return { id: 'joyas', label: 'Joyas' };
  }
  if (normalized.includes('manualid') || normalized.includes('reciclaj') || normalized.includes('hada')) {
    return { id: 'manualidades', label: 'Manualidades' };
  }

  return null;
}

function pickMotif(category: StoreCategoryId, name: string): ProductMotif {
  const n = normalizeText(name);
  if (category === 'personalizados') {
    if (n.includes('taza') || n.includes('mug')) return 'mug';
    if (n.includes('bolsa') || n.includes('tote')) return 'tote';
    return 'giftset';
  }
  if (category === 'papeleria') {
    if (n.includes('sticker') || n.includes('tarjeta')) return 'stickers';
    if (n.includes('escritorio') || n.includes('nota')) return 'deskset';
    return 'notebook';
  }
  if (category === 'joyas') {
    if (n.includes('aro') || n.includes('pendiente')) return 'earrings';
    return 'necklace';
  }
  if (category === 'manualidades') {
    if (n.includes('luz') || n.includes('luces') || n.includes('hada')) return 'fairylights';
    return 'upcycle';
  }
  return 'beauty';
}

export function parseClpPrice(rawPrice: string): number {
  const digitsOnly = rawPrice.replace(/[^\d]/g, '');
  if (!digitsOnly) return 0;
  const parsed = Number.parseInt(digitsOnly, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Parser RFC-4180 para CSV (soporta comillas, comas internas, saltos de línea y BOM).
 */
export function parseCsvRows(csvText: string): string[][] {
  const cleanText = csvText.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\r' && nextChar === '\n') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
        i++;
      } else if (char === '\n' || char === '\r') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows.filter((row) => row.some((cell) => cell.trim() !== ''));
}

export function parseCatalogFromCsv(csvText: string): ProductItem[] {
  const rows = parseCsvRows(csvText);
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => normalizeText(h));
  const idxCategoria = headers.findIndex((h) => h.includes('categor'));
  const idxNombre = headers.findIndex((h) => h.includes('nombr'));
  const idxDescripcion = headers.findIndex((h) => h.includes('descrip'));
  const idxPrecio = headers.findIndex((h) => h.includes('preci'));
  const idxFoto = headers.findIndex((h) => h.includes('foto') || h.includes('imag'));

  const products: ProductItem[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const rawCat = idxCategoria >= 0 ? (row[idxCategoria] ?? '') : (row[0] ?? '');
    const rawName = idxNombre >= 0 ? (row[idxNombre] ?? '') : (row[1] ?? '');
    const rawDesc = idxDescripcion >= 0 ? (row[idxDescripcion] ?? '') : (row[2] ?? '');
    const rawPrice = idxPrecio >= 0 ? (row[idxPrecio] ?? '') : (row[3] ?? '');
    const rawPhoto = idxFoto >= 0 ? (row[idxFoto] ?? '') : (row[4] ?? '');

    const name = rawName.trim();
    const mappedCategory = mapSheetCategory(rawCat);
    if (!name || !mappedCategory) continue;

    const priceClp = parseClpPrice(rawPrice);
    const imageUrl = buildGoogleDriveImageUrl(rawPhoto);

    products.push({
      id: `${mappedCategory.id}-${r}-${normalizeText(name).replace(/[^a-z0-9]+/g, '-')}`,
      name,
      category: mappedCategory.id,
      categoryLabel: mappedCategory.label,
      description: rawDesc.trim() || 'Detalle artesanal disponible en Kichi BAZAR.',
      priceClp,
      rawPriceLabel: rawPrice.trim() || undefined,
      motif: pickMotif(mappedCategory.id, name),
      imageUrl,
      detailNote: 'Disponible en Kichi BAZAR · Iquique',
    });
  }

  return products;
}

export async function fetchGoogleSheetsCatalog(csvUrl: string): Promise<ProductItem[]> {
  const separator = csvUrl.includes('?') ? '&' : '?';
  const freshUrl = `${csvUrl}${separator}_ts=${Date.now()}`;

  const response = await fetch(freshUrl, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`No se pudo leer el catálogo (${response.status})`);
  }

  const csvText = await response.text();
  return parseCatalogFromCsv(csvText);
}
