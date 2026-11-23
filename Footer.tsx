import React from 'react';
import { MessageCircle, Instagram, Facebook, Heart } from 'lucide-react';
import { STORE_LINKS } from '../data/catalog';

export const Footer: React.FC = () => {
  return (
    <footer
      id="contacto"
      className="bg-[#FDF9F6] border-t border-[#E6D1BF] py-14"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-12 h-px bg-[#D7B286]" aria-hidden="true" />
          <Heart className="w-4 h-4 text-[#B86F68]" aria-hidden="true" />
          <span className="w-12 h-px bg-[#D7B286]" aria-hidden="true" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#3B2A28] mb-2">
          Kichi BAZAR
        </h2>

        <p className="font-serif italic text-xl sm:text-2xl font-medium text-[#8F4E48] mb-3">
          Hecho con cariño
        </p>

        <p className="text-sm sm:text-base text-[#6E5854] max-w-lg mx-auto leading-relaxed mb-8">
          Cada regalo, tarjeta y creación artesanal está pensada para acompañar momentos
          especiales y expresar cariño.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
          <a
            href={STORE_LINKS.whatsappBusiness}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-rose-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>WhatsApp Business</span>
          </a>

          <a
            href={STORE_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-rose-gold-outline inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-[#6E3E3A] whitespace-nowrap"
          >
            <Instagram className="w-4 h-4 shrink-0 text-[#B86F68]" aria-hidden="true" />
            <span>Instagram @kichibazar.cl</span>
          </a>

          <a
            href={STORE_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-rose-gold-outline inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-[#6E3E3A] whitespace-nowrap"
          >
            <Facebook className="w-4 h-4 shrink-0 text-[#B86F68]" aria-hidden="true" />
            <span>Facebook Kichi BAZAR</span>
          </a>
        </div>

        <div className="kintsugi-divider max-w-md mx-auto mb-6" aria-hidden="true" />

        <p className="text-xs text-[#8E736D]">
          © {new Date().getFullYear()} Kichi BAZAR · Tienda de regalos 100% online
        </p>
      </div>
    </footer>
  );
};
