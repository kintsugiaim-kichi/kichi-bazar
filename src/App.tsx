/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryShowcaseCard } from './components/CategoryShowcaseCard';
import { CategoryInternalBar } from './components/CategoryInternalBar';
import { CategoryIconSvg } from './components/CategoryIconSvg';
import { PackagingCard } from './components/PackagingCard';
import { ProductCard } from './components/ProductCard';
import { OriflameSection } from './components/OriflameSection';
import { HowToBuy } from './components/HowToBuy';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { KichiBot } from './components/KichiBot';
import {
  CATEGORIES,
  DEFAULT_PACKAGING,
  PRODUCTS,
  PackagingInfo,
  ProductItem,
  STORE_LINKS,
  ShowcaseCardItem,
} from './data/catalog';
import {
  StoreCategoryId,
  fetchGoogleSheetsCatalog,
} from './utils/googleSheetsCatalog';

const STORE_CATEGORIES = CATEGORIES.filter(
  (cat): cat is (typeof CATEGORIES)[number] & { id: StoreCategoryId } =>
    cat.id !== 'todos'
);

const DEFAULT_SHOWCASE_CARDS: ShowcaseCardItem[] = STORE_CATEGORIES.map((cat) => ({
  id: `default-portada-${cat.id}`,
  title: cat.label,
  categoryId: cat.id,
  imageUrl: null,
}));

export default function App() {
  const [selectedCategory, setSelectedCategory] =
    useState<StoreCategoryId | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [catalogProducts, setCatalogProducts] = useState<ProductItem[]>(() =>
    STORE_LINKS.googleSheetsCsvUrl ? [] : PRODUCTS
  );
  const [showcaseCards, setShowcaseCards] = useState<ShowcaseCardItem[]>(
    DEFAULT_SHOWCASE_CARDS
  );
  const [packagingInfo, setPackagingInfo] =
    useState<PackagingInfo>(DEFAULT_PACKAGING);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState<boolean>(
    Boolean(STORE_LINKS.googleSheetsCsvUrl)
  );
  const [catalogError, setCatalogError] = useState<string | null>(null);

  useEffect(() => {
    const csvUrl = STORE_LINKS.googleSheetsCsvUrl.trim();
    if (!csvUrl) {
      setCatalogProducts(PRODUCTS);
      setShowcaseCards(DEFAULT_SHOWCASE_CARDS);
      setPackagingInfo(DEFAULT_PACKAGING);
      setIsLoadingCatalog(false);
      setCatalogError(null);
      return;
    }

    let cancelled = false;
    setIsLoadingCatalog(true);
    setCatalogError(null);

    fetchGoogleSheetsCatalog(csvUrl)
      .then(({ products, packaging, showcaseCards: sheetCards }) => {
        if (!cancelled) {
          setCatalogProducts(products);
          setShowcaseCards(
            sheetCards.length > 0 ? sheetCards : DEFAULT_SHOWCASE_CARDS
          );
          setPackagingInfo(packaging ?? DEFAULT_PACKAGING);
          setIsLoadingCatalog(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCatalogError(
            'No pudimos actualizar el catálogo en este momento. Puedes consultarnos directamente por WhatsApp.'
          );
          setIsLoadingCatalog(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeCategoryMeta = useMemo(
    () => STORE_CATEGORIES.find((cat) => cat.id === selectedCategory) ?? null,
    [selectedCategory]
  );

  const categoryProducts = useMemo(() => {
    if (!selectedCategory) return [];
    return catalogProducts.filter((item) => item.category === selectedCategory);
  }, [catalogProducts, selectedCategory]);

  const handleSelectCategory = (category: StoreCategoryId) => {
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackHome = () => {
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHomeSection = (sectionId?: string) => {
    setSelectedCategory(null);
    if (!sectionId || sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    });
  };

  const handleExploreClick = () => {
    const target = document.getElementById('categorias');
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF9F6] text-[#3B2A28]">
      <Navbar onNavigateHome={handleNavigateHomeSection} />

      <main className="flex-1">
        {selectedCategory === null ? (
          /* ================= VISTA DE INICIO ================= */
          <>
            <Hero
              onExploreClick={handleExploreClick}
              onCategoryIconClick={handleSelectCategory}
            />

            {/* Sección única de 5 Tarjetas Vitrina de Categoría (desde "Portada" en Google Sheets) */}
            <section
              id="categorias"
              className="max-w-6xl mx-auto px-4 sm:px-8 pt-12 pb-16"
            >
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#3B2A28] [text-wrap:balance]">
                  Mira nuestras ideas para regalar, crear o elegir algo para ti.
                </h2>
              </div>

              {isLoadingCatalog ? (
                <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                  {[0, 1, 2, 3, 4].map((skeleton) => (
                    <div
                      key={skeleton}
                      className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.35rem)] kintsugi-border rounded-xl overflow-hidden animate-pulse"
                    >
                      <div className="aspect-square bg-[#F7EBE3]" />
                      <div className="p-6 space-y-4">
                        <div className="h-7 w-2/3 mx-auto bg-[#ECD7C9] rounded" />
                        <div className="h-10 w-full bg-[#ECD7C9] rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : catalogError ? (
                <div className="kintsugi-border rounded-2xl p-8 text-center max-w-xl mx-auto">
                  <p className="text-base text-[#57413D] mb-5">{catalogError}</p>
                  <a
                    href={STORE_LINKS.whatsappBusiness}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-rose-gold inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Consultar por WhatsApp</span>
                  </a>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                  {showcaseCards.map((card) => (
                    <div
                      key={card.id}
                      className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.35rem)] flex"
                    >
                      <div className="w-full flex flex-col">
                        <CategoryShowcaseCard
                          card={card}
                          onSelect={handleSelectCategory}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <OriflameSection />

            <HowToBuy />
          </>
        ) : (
          /* ================= VISTA DINÁMICA DE CATEGORÍA ================= */
          <>
            <CategoryInternalBar
              activeCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              onBackHome={handleBackHome}
            />

            <section className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
              {activeCategoryMeta && (
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-8 mb-8 border-b border-[#EAD9CA]">
                  {/* Título de categoría alineado a la izquierda */}
                  <div className="flex items-start gap-4 max-w-xl">
                    <div
                      className={`w-16 h-16 rounded-2xl border flex items-center justify-center shrink-0 ${activeCategoryMeta.macaronBg} ${activeCategoryMeta.macaronBorder}`}
                    >
                      <CategoryIconSvg
                        category={activeCategoryMeta.id}
                        className="w-12 h-12"
                      />
                    </div>
                    <div>
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[11px] font-medium border rounded-sm mb-2 ${activeCategoryMeta.macaronBg} ${activeCategoryMeta.macaronText} ${activeCategoryMeta.macaronBorder}`}
                      >
                        {activeCategoryMeta.shortLabel}
                      </span>
                      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#3B2A28] leading-tight mb-2">
                        {activeCategoryMeta.label}
                      </h1>
                      <p className="text-sm sm:text-base text-[#6E5854] leading-relaxed">
                        {activeCategoryMeta.description}
                      </p>
                    </div>
                  </div>

                  {/* Cuadrito compacto de Empaques de Regalo en la esquina superior derecha (oculto en Belleza) */}
                  {activeCategoryMeta.id !== 'belleza' && (
                    <div className="lg:shrink-0 lg:w-[400px]">
                      <PackagingCard packaging={packagingInfo} />
                    </div>
                  )}
                </div>
              )}

              {isLoadingCatalog ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {[0, 1, 2].map((skeleton) => (
                    <div
                      key={skeleton}
                      className="kintsugi-border rounded-xl overflow-hidden animate-pulse"
                    >
                      <div className="aspect-square bg-[#F7EBE3]" />
                      <div className="p-5 space-y-3">
                        <div className="h-4 w-28 bg-[#F2E1D5] rounded" />
                        <div className="h-6 w-3/4 bg-[#ECD7C9] rounded" />
                        <div className="h-4 w-full bg-[#F5E9E0] rounded" />
                        <div className="h-9 w-full bg-[#ECD7C9] rounded-lg mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : catalogError ? (
                <div className="kintsugi-border rounded-2xl p-8 text-center max-w-xl mx-auto">
                  <p className="text-base text-[#57413D] mb-5">{catalogError}</p>
                  <a
                    href={STORE_LINKS.whatsappBusiness}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-rose-gold inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Consultar por WhatsApp</span>
                  </a>
                </div>
              ) : categoryProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {categoryProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={setSelectedProduct}
                    />
                  ))}
                </div>
              ) : (
                <div className="kintsugi-border rounded-2xl p-8 sm:p-10 text-center bg-[#FFFDFB]">
                  <p className="font-serif text-xl sm:text-2xl text-[#3B2A28] max-w-xl mx-auto mb-5 leading-relaxed">
                    ✨ Nuevos tesoros artesanales llegando pronto a esta sección. ¡Consúltanos
                    por WhatsApp!
                  </p>
                  <a
                    href={STORE_LINKS.whatsappBusiness}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-rose-gold inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Consultar por WhatsApp</span>
                  </a>
                </div>
              )}
            </section>

            {selectedCategory === 'belleza' && <OriflameSection />}
          </>
        )}
      </main>

      <Footer />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <KichiBot products={catalogProducts} />
    </div>
  );
}
