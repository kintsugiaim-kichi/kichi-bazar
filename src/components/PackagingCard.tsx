import React, { useEffect, useState } from 'react';
import { Gift, Maximize2, X } from 'lucide-react';
import { PackagingInfo } from '../data/catalog';

interface PackagingCardProps {
  packaging: PackagingInfo;
}

export const PackagingCard: React.FC<PackagingCardProps> = ({ packaging }) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [packaging.imageUrl]);

  useEffect(() => {
    if (!isZoomOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsZoomOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isZoomOpen]);

  const showRealImage = Boolean(packaging.imageUrl) && !imgFailed;

  return (
    <>
      <div className="kintsugi-border rounded-xl p-3.5 bg-[#FFFDFB] shadow-[0_6px_18px_-14px_rgba(92,58,49,0.28)] max-w-md w-full">
        <div className="flex items-start gap-3.5">
          {/* Miniatura cuadrada aprox 85x85 px */}
          <button
            type="button"
            onClick={() => setIsZoomOpen(true)}
            aria-label={`Ampliar imagen de ${packaging.name}`}
            className="group relative w-[85px] h-[85px] shrink-0 rounded-lg overflow-hidden border border-[#E5C9B3] bg-gradient-to-br from-[#FDF6F2] to-[#F9E6DE] flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B86F68]"
          >
            {showRealImage ? (
              <img
                src={packaging.imageUrl ?? ''}
                alt={packaging.name}
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <Gift className="w-8 h-8 text-[#B86F68]" aria-hidden="true" />
            )}
            <span
              className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#FFFDFB]/90 border border-[#E5C9B3] flex items-center justify-center opacity-85 group-hover:opacity-100"
              aria-hidden="true"
            >
              <Maximize2 className="w-2.5 h-2.5 text-[#8F4E48]" />
            </span>
          </button>

          {/* Texto compacto a la derecha */}
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-base font-semibold text-[#3B2A28] leading-snug mb-1">
              {packaging.name}
            </h3>
            <p className="text-xs text-[#6E5854] leading-relaxed whitespace-pre-line mb-1.5">
              {packaging.description}
            </p>
            <p className="text-[11px] font-medium text-[#8F4E48]">
              Se solicita al confirmar tu pedido por WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* Modal para ampliar la foto del empaque */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B2A28]/55 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="packaging-modal-title"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="kintsugi-border rounded-2xl max-w-md w-full overflow-hidden bg-[#FFFDFB] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#EFE0D2]">
              <h4
                id="packaging-modal-title"
                className="font-serif text-lg font-semibold text-[#3B2A28]"
              >
                {packaging.name}
              </h4>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                aria-label="Cerrar imagen de empaques"
                className="p-1.5 rounded-lg text-[#7B5F5A] hover:text-[#3B2A28] hover:bg-[#FAF3EC] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-square bg-gradient-to-br from-[#FDF6F2] to-[#F9E6DE] flex items-center justify-center p-4">
              {showRealImage ? (
                <img
                  src={packaging.imageUrl ?? ''}
                  alt={packaging.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center p-6">
                  <Gift className="w-16 h-16 text-[#B86F68] mx-auto mb-3" aria-hidden="true" />
                  <p className="text-sm text-[#6E5854]">
                    Espacio listo para la foto de tus empaques desde Google Sheets.
                  </p>
                </div>
              )}
            </div>

            <div className="p-5 bg-[#FFFDFB] border-t border-[#EFE0D2]">
              <p className="text-sm text-[#57413D] leading-relaxed whitespace-pre-line mb-2">
                {packaging.description}
              </p>
              <p className="text-xs font-medium text-[#8F4E48]">
                Solicita tu empaque favorito al confirmar tu pedido por WhatsApp.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
