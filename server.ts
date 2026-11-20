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
  showOriflameButton?: boolean;
}

const DEFAULT_BOT_FAQS: BotFaqItem[] = [
  {
    id: 'fandom-simpatia',
    buttonLabel: '🦙 ¿Qué es Fandom Simpatía Selectiva?',
    answer:
      'Es nuestro fandom y espacio creativo para quienes nos identificamos con una forma de ser no tan popular y muchas veces incomprendida. Porque no es obligación ser iguales a todos, y nuestra manera particular de ser también tiene un espacio en este mundo y puede aportar luz, a nuestra propia manera. 🦙✨ La línea de productos Simpatía Selectiva es nuestro lienzo de expresión para conectar con quienes tienen un sentido del humor y personalidad, que no siempre sigue el guion social.',
    whatsappText:
      '¡Hola Kichi BAZAR! Quiero conocer más sobre la colección Fandom Simpatía Selectiva 🦙✨',
  },
  {
    id: 'productos-disponibles',
    buttonLabel: '✨ ¿Qué productos tienen disponibles?',
    answer:
      'En Kichi BAZAR tenemos detalles pensados para regalar o regalarte: tazones personalizados y mágicos, totebags con diseños exclusivos, kits de regalo armados con cariño y una selección especial de belleza y cuidado personal Oriflame. ¡Revisa nuestro catálogo aquí mismo!',
    whatsappText:
      '¡Hola Kichi BAZAR! Vi el catálogo en la página y quiero consultar disponibilidad de un producto.',
  },
  {
    id: 'como-hacer-pedido',
    buttonLabel: '🛍️ ¿Cómo hago un pedido?',
    answer:
      '¡Es súper fácil y personalizado! Elige lo que te guste del catálogo, haz clic en el botón de WhatsApp aquí abajo para contarnos qué necesitas y te enviaremos un formulario breve para dejar todos los detalles de tu pedido y entrega ordenados.',
    whatsappText:
      '¡Hola Kichi BAZAR! Quiero hacer un pedido, por favor envíame el formulario para coordinar.',
  },
  {
    id: 'diseno-personalizado',
    buttonLabel: '🎨 Quiero un diseño personalizado',
    answer:
      '¡Nos encanta crear piezas únicas! Podemos estampar tu nombre, una frase especial o esa imagen que tanto te gusta en tazones o totebags. Haz clic en el botón de WhatsApp aquí abajo, cuéntanos tu idea y te enviamos nuestro formulario rápido para dejar tu pedido agendado.',
    whatsappText:
      '¡Hola Kichi BAZAR! Quiero cotizar y agendar un diseño personalizado en tazón o totebag.',
  },
  {
    id: 'catalogo-oriflame',
    buttonLabel: '💄 Catálogo Oriflame',
    answer:
      'Trabajamos con productos originales de belleza, fragancias y cuidado de la piel de Oriflame por encargo y con stock seleccionado. Escríbenos directo a WhatsApp para enviarte el catálogo digital actualizado de esta campaña y asesorarte con lo que necesites.',
    whatsappText:
      '¡Hola Kichi BAZAR! Por favor envíame el catálogo digital actualizado de Oriflame de esta campaña 💄',
    showOriflameButton: true,
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

async function loadLiveSheetCatalog(): Promise<CatalogSummaryItem[]> {
  try {
    const separator = GOOGLE_SHEETS_CSV_URL.includes('?') ? '&' : '?';
    const response = await fetch(`${GOOGLE_SHEETS_CSV_URL}${separator}_ts=${Date.now()}`, {
      cache: 'no-store',
    });
    if (!response.ok) return [];
    const csvText = await response.text();
    const rows = parseCsvRows(csvText);
    if (rows.length < 2) return [];

    return rows.slice(1).map((row) => ({
      category: (row[0] ?? '').trim(),
      name: (row[1] ?? '').trim(),
      description: (row[2] ?? '').trim(),
      price: (row[3] ?? '').trim(),
    }));
  } catch {
    return [];
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

    // Busca una pestaña llamada "Preguntas_Bot" (o "Preguntas Bot") en items.push({...})
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

  const faqsBlock = faqs
    .map((f, idx) => `${idx + 1}. Pregunta "${f.buttonLabel}" -> ${f.answer}`)
    .join('\n');

  return `Eres KichiBot, la anfitriona virtual de Kichi BAZAR (representada por el colibrí del logo).

PERSONALIDAD Y TONO:
- Hablas en español chileno cercano, cálido, empático y respetuoso, como una buena anfitriona que ayuda con gusto a encontrar un lindo detalle. Nunca presiones ni impongas una compra; acompaña con calma y calidez.
- Mantén tus respuestas claras, naturales y concisas (2 a 4 oraciones o lista breve de productos cuando corresponda), evitando sonar robótica.
- IDENTIDAD FANDOM SIMPATÍA SELECTIVA (MUY IMPORTANTE): Reconoce siempre a "Simpatía Selectiva" como nuestro fandom y espacio creativo para quienes nos identificamos con una forma de ser no tan popular y muchas veces incomprendida — porque no es obligación ser iguales a todos, y nuestra manera particular de ser también tiene un espacio en este mundo y puede aportar luz, a nuestra propia manera 🦙✨. La línea de productos Simpatía Selectiva es nuestro lienzo de expresión para conectar con quienes tienen un sentido del humor y personalidad, que no siempre sigue el guion social.
- REGLA LLAMA / FANDOM SIMPATÍA SELECTIVA: Si el cliente menciona a la llama, el fandom o "Simpatía Selectiva", responde PRIMERO con un guiño cómplice, irónico y divertido haciendo honor a la mirada despectiva pero adorable de la llama 🦙 y esa identidad creativa, ANTES de mostrarle los productos disponibles de la colección Simpatía Selectiva con sus descripciones y precios.
- REGLA COLECCIÓN KUTIÑA: Si preguntan por la "Colección Kutiña" o "Kutiña", destaca con orgullo su inspiración andina y significado cultural (el valor de nuestras raíces andinas, la identidad del norte, el sentido de encuentro y retorno con cariño), y luego muestra los productos Kutiña disponibles en el catálogo con sus precios.

PREGUNTAS FRECUENTES ACTUALIZADAS (pestaña Preguntas_Bot):
${faqsBlock}

CONOCIMIENTO DEL CATÁLOGO EN VIVO (desde Google Sheets):
${catalogBlock}

BELLEZA ORIFLAME Y BENEFICIOS:
- Kichi BAZAR también trabaja con productos originales de belleza, fragancias y cuidado de la piel de Oriflame (${ORIFLAME_STORE_URL}) por encargo y con stock seleccionado.
- Los clientes pueden pedir el catálogo digital actualizado por WhatsApp o registrarse gratis como clientes en la plataforma y descargar la app oficial de Oriflame para comprar con beneficios especiales y envíos gratis según promociones vigentes.
- Antes de registrarse, recuérdales verificar que diga: "fuiste invitado por Verónica Sol Cisternas/ kichi8".

ENTREGAS Y ENVÍOS:
- Si preguntan por entregas, despacho o envíos: explica con claridad que pueden retirar en Iquique y que hacemos entregas locales coordinadas, con valores a convenir.

CIERRE HACIA WHATSAPP (OBLIGATORIO EN TODA RESPUESTA):
- SIEMPRE pon \`showWhatsappButton: true\` al final de cada respuesta para que el cliente tenga acceso directo a WhatsApp.
- Redacta en \`whatsappSummary\` un mensaje amable, claro y prellenado para WhatsApp resumiendo el producto elegido, diseño personalizado, catálogo Oriflame o consulta del cliente (por ejemplo: "¡Hola Kichi BAZAR! Me gustaría pedir/consultar por: ...").
- Escribe en \`whatsappButtonLabel\` un texto breve y claro (ej: "Abrir WhatsApp", "Pedir por WhatsApp", "Personalizar por WhatsApp" o "Pedir catálogo Oriflame").
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
      const [liveCatalog, liveFaqs] = await Promise.all([
        loadLiveSheetCatalog(),
        loadLiveBotFaqs(),
      ]);

      const catalogForPrompt =
        liveCatalog.length > 0
          ? liveCatalog
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
          systemInstruction: buildSystemInstruction(catalogForPrompt, liveFaqs),
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
