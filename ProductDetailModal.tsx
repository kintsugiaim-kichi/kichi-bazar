import React, { useEffect, useState } from 'react';
import { X, MessageCircle, ExternalLink, Upload } from 'lucide-react';
import { ProductItem, STORE_LINKS, formatClp } from '../data/catalog';
import { ProductIllustration } from './ProductIllustration';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setPreviewUrl(null);
    setImageFailed(false);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const activeImage = previewUrl || (!imageFailed ? product.imageUrl : null);

  const handleFilePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setImageFailed(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B2A28]/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
    >
      <div
        className="kintsugi-border rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Cuadro de fotografía 1:1 */}
          <div className="aspect-square bg-gradient-to-br from-[#FDF8F4] via-[#FBF1EA] to-[#F7E7DF] border-b sm:border-b-0 sm:border-r border-[#E9D4BE] flex flex-col items-center justify-center relative p-6">
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={() => setImageFailed(true)}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <>
                <ProductIllustration motif={product.motif} />
                <p className="mt-3 text-xs text-[#8E736D] text-center">
                  Espacio cuadrado listo para tu foto real
                </p>
              </>
            )}

            <label className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFDFB] border border-[#DEC4AE] text-[11px] font-medium text-[#6E5854] hover:text-[#3B2A28] hover:border-[#C9A15D] cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-[#B86F68]" aria-hidden="true" />
              <span>Probar foto local</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFilePreview}
                className="sr-only"
              />
            </label>
          </div>

          {/* Información y pedido */}
          <div className="p-6 flex flex-col justify-between bg-[#FFFDFB]">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-medium text-[#8F4E48]">
                  {product.categoryLabel}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar detalle"
                  className="p-1 rounded-md text-[#8E736D] hover:text-[#3B2A28] hover:bg-[#FAF3EC] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3
                id="product-modal-title"
                className="font-serif text-2xl font-semibold text-[#3B2A28] leading-snug mb-2"
              >
                {product.name}
              </h3>

              <p className="text-sm text-[#6E5854] leading-relaxed mb-4">
                {product.description}
              </p>

              <p className="text-xs text-[#8E736D] border-t border-[#F0E2D5] pt-3">
                {product.detailNote}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F0E2D5]">
              {!product.isOriflameLink && (
                <div className="text-xl font-semibold text-[#3B2A28] tabular-nums mb-3">
                  {product.priceClp > 0
                    ? formatClp(product.priceClp)
                    : product.rawPriceLabel || 'Consultar precio'}
                </div>
              )}

              {product.isOriflameLink ? (
                <a
                  href={STORE_LINKS.oriflameStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-rose-gold w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-white"
                >
                  <span>Ir a mi tienda Oriflame</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              ) : (
                <a
                  href={STORE_LINKS.whatsappBusiness}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-rose-gold w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-white"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Pedir por WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
