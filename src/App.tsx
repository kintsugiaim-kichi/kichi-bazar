/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { OriflameSection } from './components/OriflameSection';
import { HowToBuy } from './components/HowToBuy';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { KichiBot } from './components/KichiBot';
import {
  CATEGORIES,
  CategoryId,
  PRODUCTS,
  ProductItem,
  STORE_LINKS,
} from './data/catalog';
import { fetchGoogleSheetsCatalog } from './utils/googleSheetsCatalog';

const STORE_CATEGORIES = CATEGORIES.filter((cat) => cat.id !== 'todos');

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('todos');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [catalogProducts, setCatalogProducts] = useState<ProductItem[]>(() =>
    STORE_LINKS.googleSheetsCsvUrl ? [] : PRODUCTS
  );
  const [isLoadingCatalog, setIsLoadingCatalog] = useState<boolean>(
    Boolean(STORE_LINKS.googleSheetsCsvUrl)
  );
  const [catalogError, setCatalogError] = useState<string | null>(null);

  useEffect(() => {
    const csvUrl = STORE_LINKS.googleSheetsCsvUrl.trim();
    if (!csvUrl) {
      setCatalogProducts(PRODUCTS);
      setIsLoadingCatalog(false);
      setCatalogError(null);
      return;
    }

    let cancelled = false;
    setIsLoadingCatalog(true);
    setCatalogError(null);

    fetchGoogleSheetsCatalog(csvUrl)
      .then((items) => {
        if (!cancelled) {
          setCatalogProducts(items);
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

  const visibleSections = useMemo(() => {
    if (activeCategory === 'todos') {
      return STORE_CATEGORIES;
    }
    return STORE_CATEGORIES.filter((cat) => cat.id === activeCategory);
  }, [activeCategory]);

  const productsByCategory = useMemo(() => {
    const grouped: Record<string, ProductItem[]> = {};
    for (const cat of STORE_CATEGORIES) {
      grouped[cat.id] = [];
    }
    for (const item of catalogProducts) {
      if (grouped[item.category]) {
        grouped[item.category].push(item);
      }
    }
    return grouped;
  }, [catalogProducts]);

  const handleExploreClick = () => {
    const target = document.getElementById('categorias');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (category: CategoryId) => {
    setActiveCategory(category);
  };

  const handleHeroIconNavigate = (category: Exclude<CategoryId, 'todos'>) => {
    setActiveCategory('todos');
    requestAnimationFrame(() => {
      setTimeout(() => {
        const sectionEl = document.getElementById(`categoria-${category}`);
        if (sectionEl) {
          sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 40);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF9F6] text-[#3B2A28]">
      <Navbar />

      <main className="flex-1">
        <Hero
          onExploreClick={handleExploreClick}
          onCategoryIconClick={handleHeroIconNavigate}
        />

        <CategoryBar
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Catálogo agrupado por las 5 categorías */}
        <section id="catalogo" className="max-w-6xl mx-auto px-4 sm:px-8 pt-4 pb-12">
          <div className="kintsugi-divider mb-10" aria-hidden="true" />

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
          ) : (
            <div className="space-y-14">
              {visibleSections.map((category) => {
                const items = productsByCategory[category.id] ?? [];
                return (
                  <div
                    key={category.id}
                    id={`categoria-${category.id}`}
                    className="scroll-mt-20"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-3 border-b border-[#EAD9CA]">
                      <div>
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[11px] font-medium border rounded-sm mb-2 ${category.macaronBg} ${category.macaronText} ${category.macaronBorder}`}
                        >
                          {category.shortLabel}
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#3B2A28]">
                          {category.label}
                        </h3>
                      </div>
                      <p className="text-sm text-[#6E5854] max-w-md">
                        {category.description}
                      </p>
                    </div>

                    {items.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {items.map((product) => (
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
                                        {category.id === 'oriflame' && (
                      <div className="mt-10">
                        <OriflameSection />
                      </div>
                    )}

                  </div>
                );
              })}
  

            </div>
          )}
        </section>

      
        <HowToBuy />
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
