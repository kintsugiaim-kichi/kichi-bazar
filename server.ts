import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLISHED_SHEET_BASE =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vS4T9NneH0_lTmSJKOGjxGtqe9Rc9kBV7JPeDpReCalCUbSgS-_nLCfZFjqeF2cWwm4A2YrbWhKodHG';

const GOOGLE_SHEETS_CSV_URL =
  process.env.VITE_GOOGLE_SHEETS_CSV_URL || `${PUBLISHED_SHEET_BASE}/pub?output=csv`;

const PREGUNTAS_BOT_CSV_URL = process.env.VITE_PREGUNTAS_BOT_CSV_URL || '';

const ORIFLAME_STORE_URL = 'https://shop.oriflame.com/CL-kichi8/cSSgjkmIV';
const WHATSAPP_FORM_ORDER_URL =
  'https://wa.me/569XXXXXXXX?text=Hola%20Kichi!%20Me%20gustaría%20hacer%20un%20pedido%20o%20solicitar%20el%20formulario%20de%20personalizados';

interface ChatHistoryItem {
  role: 'user' | 'assistant';
  text: string;
}

interface CatalogSummaryItem {
  category: string;
  name: string;
  description: string;
  price: string;
}

export interface BotFaqItem {
  id: string;
  buttonLabel: string;
  answer: string;
  whatsappText: string;
  whatsappButtonLabel?: string;
  customWhatsappUrl?: string;
  isGreenWhatsapp?: boolean;
  showOriflameButton?: boolean;
}

const DEFAULT_BOT_FAQS: BotFaqItem[] = [
  {
    id: 'pedido-o-personalizado',
    buttonLabel: '¿Cómo hago un pedido o pido algo personalizado?',
    answer:
      'Para productos disponibles en stock solo debes escribirnos por WhatsApp indicándonos tu elección. Si deseas crear un diseño personalizado desde cero, te enviaremos nuestro formulario especial para tomar cada detalle con cariño.',
    whatsappText:
      'Hola Kichi! Me gustaría hacer un pedido o solicitar el formulario de personalizados',
    whatsappButtonLabel: 'Pedir o solicitar formulario por WhatsApp',
    customWhatsappUrl: WHATSAPP_FORM_ORDER_URL,
    isGreenWhatsapp: true,
  },
  {
    id: 'pagos-y-entregas',
    buttonLabel: '¿Cuáles son las formas de pago y entregas?',
    answer:
      'Trabajamos con transferencia electrónica y efectivo (solo en retiros). Si retiras tu pedido en Iquique, reservas tu producto o inicias tu diseño personalizado con un 50% de abono vía transferencia, y pagas el 50% restante en efectivo o transferencia al retirar. Si prefieres envío a domicilio (coordinado con Kichi según disponibilidad de ruta o vía Uber Flash gestionado por la/el cliente), el pedido debe estar pagado al 100% vía transferencia antes de despachar. Por ahora realizamos entregas exclusivamente dentro de nuestra zona.',
    whatsappText:
      '¡Hola Kichi BAZAR! Quiero coordinar el pago y entrega de mi pedido en Iquique.',
  },
  {
    id: 'empaques-regalo',
    buttonLabel: '¿Tienen empaques para regalo?',
    answer:
      '¡Todos nuestros pedidos incluyen gratis nuestro KichiEmpaque Ecológico hecho a mano con reciclaje creativo para cuidar la Pachamama! 🌱 Además, si quieres llevarlo listo para celebrar, puedes sumar una Envoltura Tradicional (papel, cinta y tarjeta) o una Bolsa de Regalo por un pequeño valor adicional. ¡Mira las opciones y valores en la esquina superior de cada categoría! 🎁',
    whatsappText:
      '¡Hola Kichi BAZAR! Quisiera consultar por las opciones de empaque para regalo.',
  },
  {
    id: 'demora-pedido',
    buttonLabel: '¿Cuánto demora mi pedido?',
    answer:
      'Los productos que tenemos listos en stock cuentan con coordinación rápida en Iquique. En cambio, los diseños personalizados toman unos días hábiles de elaboración artesanal, plazo que confirmamos contigo apenas recibimos tu formulario y tu abono del 50%.',
    whatsappText:
      '¡Hola Kichi BAZAR! Quisiera saber el tiempo estimado de entrega para mi pedido.',
  },
  {
    id: 'cambios-devoluciones',
    buttonLabel: '¿Hacen cambios o devoluciones?',
    answer:
      'En pedidos personalizados trabajamos estrictamente según las indicaciones y textos que registras en nuestro formulario (y confirmas antes de producir), por lo que no realizamos cambios ni devoluciones por arrepentimiento o errores en los datos enviados; además, el 50% de abono no es reembolsable una vez iniciado el diseño o compra de materiales. Solo cubrimos garantía por fallas de fabricación o error de transcripción nuestro reportado dentro de las primeras 24 horas. En envíos por Uber Flash gestionados por la/el cliente, embalamos cada pieza frágil con máxima protección y te enviamos foto antes de despachar; una vez entregado al transporte externo, el traslado queda bajo responsabilidad del servicio de reparto.',
    whatsappText:
      '¡Hola Kichi BAZAR! Tengo una consulta sobre políticas de pedido o garantía.',
  },
];

function normalizeKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function parseCsvRows(csvText: string): string[][] {
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

async function loadLiveSheetData(): Promise<{
  catalog: CatalogSummaryItem[];
  packaging: CatalogSummaryItem | null;
}> {
  try {
    const separator = GOOGLE_SHEETS_CSV_URL.includes('?') ? '&' : '?';
    const response = await fetch(`${GOOGLE_SHEETS_CSV_URL}${separator}_ts=${Date.now()}`, {
      cache: 'no-store',
    });
    if (!response.ok) return { catalog: [], packaging: null };
    const csvText = await response.text();
    const rows = parseCsvRows(csvText);
    if (rows.length < 2) return { catalog: [], packaging: null };

    const catalog: CatalogSummaryItem[] = [];
    let packaging: CatalogSummaryItem | null = null;

    for (const row of rows.slice(1)) {
      const category = (row[0] ?? '').trim();
      const item: CatalogSummaryItem = {
        category,
        name: (row[1] ?? '').trim(),
        description: (row[2] ?? '').trim(),
        price: (row[3] ?? '').trim(),
      };
      const normCat = normalizeKey(category);
      if (normCat === 'portada' || normCat === 'portadas') {
        continue;
      }
      if (normCat === 'empaques' || normCat === 'empaque') {
        packaging = item;
      } else {
        catalog.push(item);
      }
    }

    return { catalog, packaging };
  } catch {
    return { catalog: [], packaging: null };
  }
}

async function findPreguntasBotCsvUrl(): Promise<string | null> {
  if (PREGUNTAS_BOT_CSV_URL) return PREGUNTAS_BOT_CSV_URL;

  try {
    const pubHtmlRes = await fetch(`${PUBLISHED_SHEET_BASE}/pubhtml?_ts=${Date.now()}`, {
      cache: 'no-store',
    });
    if (!pubHtmlRes.ok) return null;
    const html = await pubHtmlRes.text();

    const regex = /items\.push\(\{[^}]*name:\s*"([^"]+)"[^}]*gid:\s*"([0-9]+)"/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
      const sheetName = normalizeKey(match[1]).replace(/[\s_-]+/g, '');
      const gid = match[2];
      if (sheetName === 'preguntasbot') {
        return `${PUBLISHED_SHEET_BASE}/pub?gid=${gid}&single=true&output=csv`;
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function loadLiveBotFaqs(): Promise<BotFaqItem[]> {
  try {
    const csvUrl = await findPreguntasBotCsvUrl();
    if (!csvUrl) return DEFAULT_BOT_FAQS;

    const separator = csvUrl.includes('?') ? '&' : '?';
    const res = await fetch(`${csvUrl}${separator}_ts=${Date.now()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return DEFAULT_BOT_FAQS;

    const csvText = await res.text();
    const rows = parseCsvRows(csvText);
    if (rows.length < 2) return DEFAULT_BOT_FAQS;

    const headers = rows[0].map((h) => normalizeKey(h));
    const idxButton = headers.findIndex(
      (h) => h.includes('boton') || h.includes('pregunt') || h.includes('titulo')
    );
    const idxAnswer = headers.findIndex(
      (h) => h.includes('respuest') || h.includes('texto') || h.includes('mensaj')
    );
    const idxWa = headers.findIndex((h) => h.includes('whatsapp'));

    const parsedFaqs: BotFaqItem[] = [];
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const buttonLabel = (idxButton >= 0 ? row[idxButton] : row[0] ?? '').trim();
      const answer = (idxAnswer >= 0 ? row[idxAnswer] : row[1] ?? '').trim();
      const customWa = (idxWa >= 0 ? row[idxWa] : row[2] ?? '').trim();

      if (!buttonLabel || !answer) continue;

      const normalizedBtn = normalizeKey(buttonLabel);
      if (normalizedBtn.includes('simpatia') || normalizedBtn.includes('fandom')) {
        continue;
      }

      parsedFaqs.push({
        id: `faq-${r}`,
        buttonLabel,
        answer,
        whatsappText:
          customWa ||
          `¡Hola Kichi BAZAR! Te escribo por: ${buttonLabel.replace(/^[^\p{L}\p{N}]+/u, '').trim()}`,
        showOriflameButton: normalizedBtn.includes('oriflame'),
      });
    }

    return parsedFaqs.length > 0 ? parsedFaqs : DEFAULT_BOT_FAQS;
  } catch {
    return DEFAULT_BOT_FAQS;
  }
}

function buildSystemInstruction(
  catalogItems: CatalogSummaryItem[],
  packaging: CatalogSummaryItem | null,
  faqs: BotFaqItem[]
): string {
  const catalogBlock =
    catalogItems.length > 0
      ? catalogItems
          .map(
            (item, idx) =>
              `${idx + 1}. [${item.category}] ${item.name} — ${item.description} | Precio: ${item.price || 'Consultar'}`
          )
          .join('\n')
      : 'Actualmente no hay productos cargados desde la planilla en este instante; invita amablemente a consultar por WhatsApp.';

  const packagingBlock = packaging
    ? `${packaging.name}: ${packaging.description}`
    : 'Todos los pedidos incluyen gratis KichiEmpaque Ecológico hecho a mano con reciclaje creativo para cuidar la Pachamama 🌱. Adicionalmente se puede sumar Envoltura Tradicional (papel, cinta y tarjeta) o Bolsa de Regalo por un valor adicional.';

  const faqsBlock = faqs
    .map((f, idx) => `${idx + 1}. Pregunta "${f.buttonLabel}" -> ${f.answer}`)
    .join('\n');

  return `Eres KichiBot, la anfitriona virtual de Kichi BAZAR (representada por el colibrí del logo).

PERSONALIDAD Y TONO:
- Hablas en español chileno cercano, cálido, educado, estético y empático, como una buena anfitriona que ayuda con gusto a encontrar un lindo detalle. Nunca presiones ni impongas una compra; acompaña con calma y calidez.
- Mantén tus respuestas claras, naturales y concisas (2 a 4 oraciones o lista breve cuando corresponda).
- Si preguntan por la "Colección Kutiña" o "Kutiña", destaca con orgullo su inspiración andina y significado cultural, y muestra los productos Kutiña disponibles en el catálogo con sus precios.

POLÍTICAS DE KICHI BAZAR (RESPONDE CON EXACTITUD):
${faqsBlock}

EMPAQUES PARA REGALO:
${packagingBlock}

CATÁLOGO EN VIVO (desde Google Sheets):
${catalogBlock}

BELLEZA ORIFLAME:
- Kichi BAZAR ofrece la línea europea de belleza, fragancias y cuidado de la piel Oriflame (${ORIFLAME_STORE_URL}).
- Los clientes pueden registrarse gratis como clientes en la plataforma y descargar la app oficial de Oriflame para comprar con beneficios, verificando siempre que diga: "fuiste invitado por Verónica Sol Cisternas/ kichi8".

CIERRE HACIA WHATSAPP:
- SIEMPRE pon \`showWhatsappButton: true\` al final de cada respuesta para que el cliente tenga acceso directo a WhatsApp.
- Redacta en \`whatsappSummary\` un mensaje amable, claro y prellenado para WhatsApp resumiendo lo que el cliente busca, quiere personalizar o consultar.
- Escribe en \`whatsappButtonLabel\` un texto breve y claro (ej: "Pedir o solicitar formulario por WhatsApp" o "Abrir WhatsApp").
- Si preguntan por Oriflame, activa \`showOriflameButton: true\`.`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '1mb' }));

  app.get('/api/kichibot/faqs', async (_req, res) => {
    const faqs = await loadLiveBotFaqs();
    res.json({ faqs });
  });

  app.post('/api/kichibot/chat', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({
        error: 'Falta configurar GEMINI_API_KEY en el servidor para activar KichiBot.',
      });
      return;
    }

    const { message, history, clientCatalog } = req.body as {
      message?: string;
      history?: ChatHistoryItem[];
      clientCatalog?: CatalogSummaryItem[];
    };

    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Escribe un mensaje para conversar con KichiBot.' });
      return;
    }

    try {
      const [sheetData, liveFaqs] = await Promise.all([
        loadLiveSheetData(),
        loadLiveBotFaqs(),
      ]);

      const catalogForPrompt =
        sheetData.catalog.length > 0
          ? sheetData.catalog
          : Array.isArray(clientCatalog)
            ? clientCatalog
            : [];

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const conversationContents = [
        ...(Array.isArray(history) ? history.slice(-10) : []).map((item) => ({
          role: item.role === 'assistant' ? ('model' as const) : ('user' as const),
          parts: [{ text: item.text }],
        })),
        {
          role: 'user' as const,
          parts: [{ text: message.trim() }],
        },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: conversationContents,
        config: {
          systemInstruction: buildSystemInstruction(
            catalogForPrompt,
            sheetData.packaging,
            liveFaqs
          ),
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description: 'Respuesta cálida de KichiBot en español chileno.',
              },
              showWhatsappButton: {
                type: Type.BOOLEAN,
                description: 'Siempre true para mostrar el botón directo de WhatsApp.',
              },
              whatsappButtonLabel: {
                type: Type.STRING,
                description: 'Texto corto del botón de WhatsApp.',
              },
              whatsappSummary: {
                type: Type.STRING,
                description:
                  'Mensaje prellenado amable resumiendo la consulta, personalización o pedido para enviar por WhatsApp.',
              },
              showOriflameButton: {
                type: Type.BOOLEAN,
                description: 'true si corresponde mostrar acceso directo a la tienda Oriflame.',
              },
            },
            required: ['reply', 'showWhatsappButton', 'whatsappSummary'],
          },
        },
      });

      const rawText = response.text;
      if (!rawText) {
        res.status(502).json({
          error: 'KichiBot no recibió una respuesta del modelo. Intenta nuevamente.',
        });
        return;
      }

      const parsed = JSON.parse(rawText) as {
        reply: string;
        showWhatsappButton: boolean;
        whatsappButtonLabel?: string;
        whatsappSummary?: string;
        showOriflameButton?: boolean;
      };

      res.json({
        reply: parsed.reply,
        showWhatsappButton: true,
        whatsappButtonLabel: parsed.whatsappButtonLabel || 'Abrir WhatsApp',
        whatsappSummary:
          parsed.whatsappSummary?.trim() ||
          `¡Hola Kichi BAZAR! Te escribo desde la tienda por: ${message.trim()}`,
        showOriflameButton: Boolean(parsed.showOriflameButton),
      });
    } catch (error) {
      console.error('Error en KichiBot:', error);
      res.status(500).json({
        error:
          'Hubo un inconveniente momentáneo con KichiBot. También puedes escribirnos directo por WhatsApp.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kichi BAZAR server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
