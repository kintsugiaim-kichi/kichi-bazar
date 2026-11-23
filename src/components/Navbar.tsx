import React from 'react';
import { MessageCircle } from 'lucide-react';
import { STORE_LINKS } from '../data/catalog';

interface NavbarProps {
  onNavigateHome: (sectionId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateHome }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FDF9F6]/90 backdrop-blur-md border-b border-[#E9D7C8]/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome('inicio');
          }}
          className="font-serif text-2xl font-semibold tracking-tight text-[#3B2A28] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B86F68]"
        >
          Kichi BAZAR
        </a>

        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6E5854]"
        >
          <a
            href="#categorias"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome('categorias');
            }}
            className="hover:text-[#3B2A28] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#C99A6B]"
          >
            Catálogo
          </a>
          <a
            href="#belleza-oriflame"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome('belleza-oriflame');
            }}
            className="hover:text-[#3B2A28] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#C99A6B]"
          >
            Belleza Oriflame
          </a>
          <a
            href="#como-comprar"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome('como-comprar');
            }}
            className="hover:text-[#3B2A28] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#C99A6B]"
          >
            Cómo comprar
          </a>
          <a
            href="#contacto"
            onClick={(e) => {
              e.preventDefault();
              const footerEl = document.getElementById('contacto');
              footerEl?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#3B2A28] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#C99A6B]"
          >
            Contacto
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <a
            href={STORE_LINKS.whatsappBusiness}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-rose-gold inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8F4E48]"
          >
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Pedir por WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
};
