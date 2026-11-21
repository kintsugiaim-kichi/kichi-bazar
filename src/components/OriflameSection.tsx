import React from 'react';
import { ExternalLink, Smartphone, ShieldCheck, Sparkles } from 'lucide-react';
import { STORE_LINKS } from '../data/catalog';

export const OriflameSection: React.FC = () => {
  return (
    <section
      id="belleza-oriflame"
      className="max-w-5xl mx-auto px-4 sm:px-8 py-14"
    >
      <div className="kintsugi-border-rose rounded-2xl p-6 sm:p-10 md:p-12 shadow-[0_18px_44px_-22px_rgba(181,101,96,0.32)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7">
            <p className="font-serif italic text-xl sm:text-2xl font-medium text-[#9D5D56] mb-1.5">
              Belleza &amp; Cuidado Personal
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2A28] [text-wrap:balance] mb-4">
              Descubre la línea Oriflame con beneficios exclusivos
            </h2>
            <p className="text-base text-[#57413D] leading-relaxed mb-6">
              Explora fragancias, skincare y cuidado personal de inspiración sueca. Puedes
              registrarte gratis como cliente en la plataforma y descargar la app oficial de
              Oriflame para realizar tus pedidos con beneficios especiales directo desde tu celular.
            </p>

            {/* Aviso de verificación de invitación */}
            <div className="rounded-xl bg-[#FBF2D8]/65 border border-[#DFC68B] p-4 sm:p-5 mb-7">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  className="w-5 h-5 text-[#8F6827] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="text-sm leading-relaxed text-[#4F3C23]">
                  <span className="font-semibold block mb-1">
                    Verificación importante antes de registrarte:
                  </span>
                  <span>
                    Al crear tu cuenta, asegúrate de verificar que aparezca el mensaje:{' '}
                    <strong className="font-semibold text-[#3B2A28]">
                      «{STORE_LINKS.oriflameSponsorText}»
                    </strong>
                    .
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={STORE_LINKS.oriflameStore}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-rose-gold inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg text-sm font-semibold text-white whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8F4E48]"
              >
                <span>Ir a mi tienda Oriflame</span>
                <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Tarjeta lateral informativa con pasos rápidos de la app */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-[#FFFDFB] border border-[#E7C9BA] p-6 space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#FAE4E2] border border-[#EAC4C0] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#8F4E48]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#3B2A28]">
                    Registro como cliente
                  </h3>
                  <p className="text-sm text-[#6E5854] leading-relaxed mt-0.5">
                    Ingresa al enlace de tienda y crea tu perfil de cliente en pocos minutos.
                  </p>
                </div>
              </div>

              <div className="kintsugi-divider" aria-hidden="true" />

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#EDE6F5] border border-[#D5C9E6] flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-[#584574]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#3B2A28]">
                    App oficial Oriflame
                  </h3>
                  <p className="text-sm text-[#6E5854] leading-relaxed mt-0.5">
                    Descarga la aplicación oficial para explorar catálogos vigentes, promos y
                    despacho directo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
