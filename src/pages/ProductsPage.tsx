import { useEffect, useRef, useState, useCallback } from 'react';
import { api, Product } from '@/services/api';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function ProductCardSkeleton() {
    return (
        <div className="h-full bg-white rounded-xl overflow-hidden shadow-sm flex flex-col animate-pulse">
            <div className="h-64 sm:h-72 w-full bg-stone-200" />
            <div className="flex flex-col p-3 space-y-3">
                <div className="space-y-1.5">
                    <div className="h-3.5 bg-stone-200 rounded-sm w-3/4" />
                    <div className="h-3 bg-stone-100 rounded-sm w-1/3" />
                </div>
                <div className="flex items-center justify-between pt-1">
                    <div className="h-4 bg-stone-200 rounded-sm w-1/4" />
                    <div className="h-7 bg-stone-200 rounded-lg w-14" />
                </div>
            </div>
        </div>
    );
}

// ─── Inline progress bar (top of page) ───────────────────────────────────────
function TopProgressBar({ active }: { active: boolean }) {
    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    key="progress-bar"
                    initial={{ scaleX: 0, opacity: 1 }}
                    animate={{ scaleX: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    style={{ transformOrigin: 'left' }}
                    className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 z-[9999] shadow-md"
                />
            )}
        </AnimatePresence>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function ProductsPage() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState<string[]>(['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy']);
    const [language, setLanguage] = useState<'en' | 'am' | 'om'>('en');
    const [hasLoaded, setHasLoaded] = useState(false);  // tracks if we ever had data

    // Use a ref so fast re-renders / HMR don't re-create the abort controller
    const abortRef = useRef<AbortController | null>(null);

    const loadData = useCallback(async (silent = false) => {
        // Cancel any in-flight request (logical cancellation only for now, unless API accepts signal)
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        if (!silent) setLoading(true);
        setError(null);

        try {
            const [productsRes, categoriesRes] = await Promise.all([
                api.getAllProducts({ limit: 100 }),
                api.getCategories(),
            ]);

            // Guard: If a new request started while we were awaiting, discard these results
            if (abortRef.current !== controller) return;

            // Validate response shapes
            if (productsRes?.success && Array.isArray(productsRes.data)) {
                setAllProducts(productsRes.data);
                setHasLoaded(true);
            } else if (Array.isArray(productsRes)) {
                // Some backends return array directly
                setAllProducts(productsRes);
                setHasLoaded(true);
            }

            if (categoriesRes?.success && Array.isArray(categoriesRes.data)) {
                const cats = categoriesRes.data.filter(Boolean);
                setCategories(['All', ...cats]);
            } else if (Array.isArray(categoriesRes)) {
                const cats = categoriesRes.filter(Boolean);
                setCategories(['All', ...cats]);
            }
        } catch (err: any) {
            if (abortRef.current !== controller) return; // Ignore errors from stale requests

            if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;
            console.error('Failed to fetch products:', err);
            setError('Could not load products. Please check your connection.');
        } finally {
            // Only turn off loading if this is still the active request
            if (abortRef.current === controller) {
                setLoading(false);
            }
        }
    }, []);

    // Initial load
    useEffect(() => {
        loadData();
        return () => abortRef.current?.abort();
    }, [loadData]);

    // Client-side filtering — instant, no extra API call
    useEffect(() => {
        const searchLower = search.toLowerCase().trim();
        const filtered = allProducts.filter(product => {
            const matchesSearch =
                !searchLower ||
                product.name?.toLowerCase().includes(searchLower) ||
                product.description?.toLowerCase().includes(searchLower) ||
                product.description_am?.toLowerCase().includes(searchLower) ||
                product.description_om?.toLowerCase().includes(searchLower) ||
                product.category?.toLowerCase().includes(searchLower);

            const matchesCategory =
                !category || category === 'All'
                    ? true
                    : product.category?.toLowerCase() === category.toLowerCase();

            return matchesSearch && matchesCategory;
        });
        setFilteredProducts(filtered);
    }, [search, category, allProducts]);

    const skeletonCount = 8;

    return (
        <div className="min-h-screen bg-[#FAF8F3]">
            {/* Slim top progress bar instead of full-screen overlay */}
            <TopProgressBar active={loading} />

            <div className="space-y-6 md:space-y-10 px-2 md:px-6 max-w-[1440px] mx-auto py-8 md:py-12">

                {/* ── Search & Filter Bar ── */}
                <div className="w-full space-y-4 pt-2">
                    {/* Search Input */}
                    <div className="relative max-w-2xl mx-auto px-1">
                        <div className="relative bg-white border border-stone-200 rounded-lg overflow-hidden flex items-center shadow-sm">
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products…"
                                className="flex-1 h-11 border-none bg-transparent text-sm focus-visible:ring-0 font-medium placeholder:text-stone-400 pl-4"
                            />
                            <button
                                onClick={() => loadData(true)}
                                title="Refresh products"
                                className={cn(
                                    "mr-1 w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-black transition-all",
                                    loading && "animate-spin text-emerald-500"
                                )}
                            >
                                <RefreshCw className="h-4 w-4" />
                            </button>
                            <button className="mr-1.5 w-8 h-8 rounded-full bg-black flex items-center justify-center text-white active:scale-95 transition-transform">
                                <Search className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Category Tabs + Language Switcher */}
                    <div className="space-y-4 pt-2">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            {/* Category Buttons */}
                            <div className="flex items-center gap-1 overflow-x-auto pb-1 px-1 no-scrollbar w-full md:w-auto">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat === 'All' ? '' : cat)}
                                        className={cn(
                                            "px-4 py-1.5 text-xs font-semibold rounded-md transition-all border whitespace-nowrap",
                                            (category === cat || (cat === 'All' && !category))
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-stone-500 border-stone-200 hover:border-black hover:text-black"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Language Switcher */}
                            <div className="flex items-center gap-1 p-1 bg-white border border-stone-200 rounded-lg shrink-0">
                                {(['en', 'am', 'om'] as const).map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => setLanguage(lang)}
                                        className={cn(
                                            "px-3 py-1 rounded-md text-[10px] font-bold transition-all uppercase",
                                            language === lang
                                                ? "bg-stone-100 text-black"
                                                : "text-stone-400 hover:text-stone-600"
                                        )}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Error Banner ── */}
                <AnimatePresence>
                    {error && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700"
                        >
                            <span>{error}</span>
                            <button
                                onClick={() => loadData()}
                                className="ml-4 px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
                            >
                                Retry
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Product Grid ── */}
                {loading && !hasLoaded ? (
                    /* First-load skeleton grid */
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] md:gap-4">
                        {Array.from({ length: skeletonCount }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredProducts.length === 0 && !loading ? (
                    /* Empty / no results state */
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 md:py-24 border-2 md:border-4 border-dashed border-stone-100 rounded-[2rem] md:rounded-[3rem] bg-stone-50/30"
                    >
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Search className="h-8 w-8 md:h-10 md:w-10 text-stone-200" />
                        </div>
                        <p className="text-lg md:text-xl text-stone-400 font-bold">
                            {search || category
                                ? 'No results found for your search.'
                                : 'No products available yet.'}
                        </p>
                        {(search || category) && (
                            <button
                                onClick={() => { setSearch(''); setCategory(''); }}
                                className="mt-4 text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:underline"
                            >
                                Clear all filters
                            </button>
                        )}
                        {!search && !category && (
                            <button
                                onClick={() => loadData()}
                                className="mt-4 text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:underline"
                            >
                                Reload
                            </button>
                        )}
                    </motion.div>
                ) : (
                    /* Products grid — always visible, skeleton overlay on silent refresh */
                    <div className="relative">
                        {/* Silent-refresh dimming overlay (doesn't hide products) */}
                        <AnimatePresence>
                            {loading && hasLoaded && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[1px] rounded-xl pointer-events-none"
                                />
                            )}
                        </AnimatePresence>

                        <motion.div
                            layout
                            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] md:gap-4"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.map((product: Product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                )}

                {/* Product count chip */}
                {!loading && filteredProducts.length > 0 && (
                    <p className="text-center text-[11px] text-stone-400 font-medium pb-4">
                        Showing <span className="font-bold text-stone-600">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
                        {(search || category) && ` matching your filter`}
                    </p>
                )}
            </div>
        </div>
    );
}
