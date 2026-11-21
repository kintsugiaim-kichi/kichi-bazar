import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Send,
  MessageCircle,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ProductItem, STORE_LINKS, formatClp } from '../data/catalog';
import { KichiHummingbirdAvatar } from './KichiHummingbirdAvatar';

interface KichiBotProps {
  products: ProductItem[];
}

interface BotFaqItem {
  id: string;
  buttonLabel: string;
  answer: string;
  whatsappText: string;
  showOriflameButton?: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  showWhatsappButton?: boolean;
  whatsappButtonLabel?: string;
  whatsappSummary?: string;
  showOriflameButton?: boolean;
  isError?: boolean;
}

const DEFAULT_QUICK_FAQS: BotFaqItem[] = [
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

export const KichiBot: React.FC<KichiBotProps> = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickFaqs, setShowQuickFaqs] = useState(true);
  const [faqs, setFaqs] = useState<BotFaqItem[]>(DEFAULT_QUICK_FAQS);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: '¡Hola! Soy KichiBot, tu anfitriona en Kichi BAZAR. Qué gusto saludarte por acá. Elige una pregunta rápida o escríbeme lo que buscas.',
      showWhatsappButton: true,
      whatsappButtonLabel: 'Escribir por WhatsApp',
      whatsappSummary:
        '¡Hola Kichi BAZAR! Te escribo desde la página para consultar por sus productos.',
    },
  ]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch('/api/kichibot/faqs', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { faqs?: BotFaqItem[] } | null) => {
        if (data?.faqs && data.faqs.length > 0) {
          setFaqs(data.faqs);
        }
      })
      .catch(() => {
        // Conserva DEFAULT_QUICK_FAQS si falla la red
      });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen, messages, isSending]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const handleFaqClick = (faq: BotFaqItem) => {
    if (isSending) return;
    const timestamp = Date.now();
    const userMsg: ChatMessage = {
      id: `user-faq-${timestamp}`,
      role: 'user',
      text: faq.buttonLabel,
    };
    const botMsg: ChatMessage = {
      id: `bot-faq-${timestamp + 1}`,
      role: 'assistant',
      text: faq.answer,
      showWhatsappButton: true,
      whatsappButtonLabel: 'Abrir WhatsApp',
      whatsappSummary: faq.whatsappText,
      showOriflameButton: faq.showOriflameButton,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setShowQuickFaqs(false);
  };

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputValue('');
    setShowQuickFaqs(false);
    setIsSending(true);

    try {
      const clientCatalog = products.map((item) => ({
        category: item.categoryLabel,
        name: item.name,
        description: item.description,
        price:
          item.priceClp > 0
            ? formatClp(item.priceClp)
            : item.rawPriceLabel || 'Consultar',
      }));

      const response = await fetch('/api/kichibot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextMessages
            .filter((m) => !m.isError)
            .slice(-10)
            .map((m) => ({ role: m.role, text: m.text })),
          clientCatalog,
        }),
      });

      const data = (await response.json()) as {
        reply?: string;
        showWhatsappButton?: boolean;
        whatsappButtonLabel?: string;
        whatsappSummary?: string;
        showOriflameButton?: boolean;
        error?: string;
      };

      if (!response.ok || !data.reply) {
        throw new Error(
          data.error ||
            'No pude responder en este momento. Puedes escribirnos directo por WhatsApp.'
        );
      }

      const assistantMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        showWhatsappButton: true,
        whatsappButtonLabel: data.whatsappButtonLabel || 'Abrir WhatsApp',
        whatsappSummary:
          data.whatsappSummary ||
          `¡Hola Kichi BAZAR! Te escribo por: ${trimmed}`,
        showOriflameButton: Boolean(data.showOriflameButton),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorText =
        err instanceof Error
          ? err.message
          : 'Tuvimos un problemita de conexión. Puedes escribirnos directo por WhatsApp.';

      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: errorText,
          isError: true,
          showWhatsappButton: true,
          whatsappButtonLabel: 'Abrir WhatsApp',
          whatsappSummary: '¡Hola Kichi BAZAR! Quiero hacer una consulta sobre sus productos.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopySummary = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Silencio si el navegador bloquea el portapapeles
    }
  };

  const buildWhatsappHref = (summary: string) => {
    const separator = STORE_LINKS.whatsappBusiness.includes('?') ? '&' : '?';
    return `${STORE_LINKS.whatsappBusiness}${separator}text=${encodeURIComponent(summary)}`;
  };

  return (
    <>
      {/* Ventana de chat de KichiBot */}
      {isOpen && (
        <aside
          aria-label="Chat con KichiBot"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[405px] h-[min(590px,78vh)] kintsugi-border rounded-2xl shadow-[0_24px_56px_-18px_rgba(92,58,49,0.42)] flex flex-col overflow-hidden bg-[#FDF9F6]"
        >
          {/* Cabecera */}
          <div className="flex items-center justify-between gap-3 px-4 py-3.5 bg-gradient-to-r from-[#FDF2EF] via-[#FDF9F6] to-[#FBEBE2] border-b border-[#EAD5C3]">
            <div className="flex items-center gap-3 min-w-0">
              <KichiHummingbirdAvatar
                sizeClass="w-11 h-11"
                alt="Foto de perfil de KichiBot"
              />
              <div className="min-w-0">
                <h2 className="font-serif text-lg font-semibold text-[#3B2A28] leading-tight truncate">
                  KichiBot
                </h2>
                <p className="text-xs text-[#7B5F5A] truncate">
                  Anfitriona de Kichi BAZAR
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar KichiBot"
              className="p-2 rounded-lg text-[#7B5F5A] hover:text-[#3B2A28] hover:bg-[#F5E5DB] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Historial de mensajes */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-[#FDF9F6]"
          >
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-[#F8E2DC] text-[#3B2A28] border border-[#E7C2B8] rounded-br-sm'
                        : 'bg-[#FFFDFB] text-[#3B2A28] border border-[#EAD9CA] rounded-bl-sm shadow-[0_4px_14px_-10px_rgba(92,58,49,0.2)]'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {msg.showWhatsappButton && msg.whatsappSummary && (
                      <div className="mt-3 pt-3 border-t border-[#F0E2D5] space-y-2">
                        <div className="rounded-lg bg-[#FAF3EC] border border-[#EAD9CA] p-2.5 text-xs text-[#6E5854]">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-semibold text-[#57413D]">
                              Mensaje para WhatsApp:
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopySummary(msg.id, msg.whatsappSummary ?? '')
                              }
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8F4E48] hover:underline cursor-pointer"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3" aria-hidden="true" />
                                  <span>Copiado</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" aria-hidden="true" />
                                  <span>Copiar</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="italic text-[#57413D]">{msg.whatsappSummary}</p>
                        </div>

                        <a
                          href={buildWhatsappHref(msg.whatsappSummary)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-rose-gold w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white whitespace-nowrap"
                        >
                          <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{msg.whatsappButtonLabel || 'Abrir WhatsApp'}</span>
                        </a>
                      </div>
                    )}

                    {msg.showOriflameButton && (
                      <div className="mt-2.5">
                        <a
                          href={STORE_LINKS.oriflameStore}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-rose-gold-outline w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-[#7A3F3A] whitespace-nowrap"
                        >
                          <span>Ir a mi tienda Oriflame</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-start">
                <div className="rounded-2xl rounded-bl-sm px-4 py-2.5 bg-[#FFFDFB] border border-[#EAD9CA] text-xs text-[#8E736D]">
                  KichiBot está escribiendo...
                </div>
              </div>
            )}
          </div>

          {/* 5 botones de preguntas rápidas */}
          <div className="bg-[#FAF3EC] border-t border-[#EAD9CA] px-3 py-2">
            <button
              type="button"
              onClick={() => setShowQuickFaqs((prev) => !prev)}
              className="w-full flex items-center justify-between text-xs font-medium text-[#7A4E48] py-1 cursor-pointer"
            >
              <span>Preguntas rápidas</span>
              {showQuickFaqs ? (
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>

            {showQuickFaqs && (
              <div className="pt-1.5 pb-1 flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                {faqs.map((faq) => (
                  <button
                    key={faq.id}
                    type="button"
                    onClick={() => handleFaqClick(faq)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium bg-[#FFFDFB] text-[#4C3835] border border-[#E6D2C2] hover:border-[#C9A15D] hover:bg-[#FDF6F2] transition-colors cursor-pointer"
                  >
                    {faq.buttonLabel}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Barra de entrada */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputValue);
            }}
            className="p-3 bg-[#FFFDFB] border-t border-[#EAD9CA] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escríbele a KichiBot..."
              disabled={isSending}
              className="flex-1 min-w-0 px-3.5 py-2.5 rounded-lg bg-[#FDF9F6] border border-[#E5D2C3] text-sm text-[#3B2A28] placeholder:text-[#9D837D] focus:outline-none focus:border-[#B86F68]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isSending}
              aria-label="Enviar mensaje"
              className="btn-rose-gold p-2.5 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </aside>
      )}

      {/* Botón circular flotante en esquina inferior derecha */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Cerrar KichiBot' : 'Abrir KichiBot'}
        title="KichiBot · ¿Te ayudo a elegir un detalle?"
        className="fixed bottom-5 right-5 z-50 rounded-full transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B86F68]"
      >
        <KichiHummingbirdAvatar
          sizeClass="w-15 h-15"
          alt="Abrir asistente KichiBot"
        />
      </button>
    </>
  );
};
