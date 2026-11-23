import React from 'react';
import { Gift, MessageCircle, Home } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    title: 'Elige tu detalle favorito',
    description:
      'Explora el bazar y escoge entre productos personalizados, papelería creativa, joyas de plata, manualidades o cuidado personal.',
    icon: Gift,
    accentBg: 'bg-[#FCE8DC]',
    accentBorder: 'border-[#EAC6B0]',
    accentColor: 'text-[#8F4E48]',
  },
  {
    number: '02',
    title: 'Coordina y paga por transferencia vía WhatsApp',
    description:
      'Escríbenos para confirmar stock o personalización y realiza tu pago por transferencia (o compra directo en la app oficial de Oriflame).',
    icon: MessageCircle,
    accentBg: 'bg-[#EDE6F5]',
    accentBorder: 'border-[#D5C9E6]',
    accentColor: 'text-[#554270]',
  },
  {
    number: '03',
    title: 'Recibe con despacho a domicilio en Iquique',
    description:
      'Retiro o envío en Iquique a convenir.',
    icon: Home,
    accentBg: 'bg-[#E3F0E8]',
    accentBorder: 'border-[#C1DEC9]',
    accentColor: 'text-[#335845]',
  },
];

export const HowToBuy: React.FC = () => {
  return (
    <section
      id="como-comprar"
      className="bg-[#FAF3EC]/70 border-y border-[#E9D7C8] py-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2A28] [text-wrap:balance] mb-3">
            100% online · Sin salir de casa
          </h2>
          <p className="text-sm sm:text-base text-[#6E5854]">
            Un proceso simple, cercano y pensado en tu comodidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="kintsugi-border rounded-xl p-6 sm:p-7 flex flex-col items-start shadow-[0_8px_24px_-18px_rgba(92,58,49,0.2)]"
              >
                <div className="w-full flex items-center justify-between mb-5">
                  <div
                    className={`w-11 h-11 rounded-lg border flex items-center justify-center ${step.accentBg} ${step.accentBorder}`}
                  >
                    <Icon className={`w-5 h-5 ${step.accentColor}`} aria-hidden="true" />
                  </div>
                  <span className="font-serif text-2xl font-semibold text-[#C9A15D] tabular-nums">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-semibold text-[#3B2A28] leading-snug mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#6E5854] leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
