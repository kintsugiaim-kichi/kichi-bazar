import React, { useEffect, useState } from 'react';
import { MessageCircle, ExternalLink, Camera } from 'lucide-react';
import { CATEGORIES, ProductItem, STORE_LINKS, formatClp } from '../data/catalog';
import { ProductIllustration } from './ProductIllustration';

interface ProductCardProps {
  product: ProductItem;
  onSelectProduct: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [product.imageUrl]);

  const categoryMeta = CATEGORIES.find((c) => c.id === product.category);
  const macaronClasses = categoryMeta
    ? `${categoryMeta.macaronBg} ${categoryMeta.macaronText} ${categoryMeta.macaronBorder}`
    : 'bg-[#FAF3EC] text-[#3B2A28] border-[#E5D3C4]';

  const showImage = Boolean(product.imageUrl) && !imageFailed;

  return (
    <article className="kintsugi-border rounded-xl overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5 shadow-[0_8px_24px_-16px_rgba(92,58,49,0.22)]">
      {/* Espacio cuadrado para foto real */}
      <button
        type="button"
        onClick={() => onSelectProduct(product)}
        className="group relative aspect-square w-full bg-gradient-to-br from-[#FDF8F4] via-[#FBF1EA] to-[#F7E7DF] border-b border-[#E9D4BE] overflow-hidden text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#B86F68]"
        aria-label={`Ver detalle de ${product.name}`}
      >
        {showImage ? (
          <img
            src={product.imageUrl ?? ''}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
            {/* Esquinas sutiles estilo kintsugi */}
            <span
              className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#C9A15D]/60"
              aria-hidden="true"
            />
            <span
              className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#C9A15D]/60"
              aria-hidden="true"
            />
            <span
              className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#C9A15D]/60"
              aria-hidden="true"
            />
            <span
              className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#C9A15D]/60"
              aria-hidden="true"
            />

            <div className="transform transition-transform duration-200 group-hover:scale-105">
              <ProductIllustration motif={product.motif} />
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-[#8E736D]">
              <Camera className="w-3.5 h-3.5 text-[#C9A15D]" aria-hidden="true" />
              <span>Espacio para foto real · 1:1</span>
            </div>
          </div>
        )}
      </button>

      {/* Contenido de la tarjeta */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-2.5">
          <span
            className={`inline-block px-2.5 py-0.5 text-[11px] font-medium border rounded-sm ${macaronClasses}`}
          >
            {product.categoryLabel}
          </span>
        </div>

        <h3 className="font-serif text-xl font-semibold text-[#3B2A28] leading-snug mb-1.5">
          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="text-left hover:text-[#8F4E48] transition-colors cursor-pointer"
          >
            {product.name}
          </button>
        </h3>

        <p className="text-sm text-[#6E5854] leading-relaxed mb-4 flex-1">
          {product.description}
        </p>

        <div className="kintsugi-divider mb-4" aria-hidden="true" />

        <div className="flex items-center justify-between gap-3">
          <div>
            {product.isOriflameLink ? (
              <span className="text-sm font-semibold text-[#8F4E48]">
                Catálogo online
              </span>
            ) : product.priceClp > 0 ? (
              <span className="text-lg font-semibold text-[#3B2A28] tabular-nums">
                {formatClp(product.priceClp)}
              </span>
            ) : (
              <span className="text-sm font-semibold text-[#8F4E48]">
                {product.rawPriceLabel || 'Consultar precio'}
              </span>
            )}
          </div>

          {product.isOriflameLink ? (
            <a
              href={STORE_LINKS.oriflameStore}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-rose-gold inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white whitespace-nowrap shrink-0"
            >
              <span>Ir a Oriflame</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </a>
          ) : (
            <a
              href={STORE_LINKS.whatsappBusiness}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-rose-gold inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Pedir por WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
