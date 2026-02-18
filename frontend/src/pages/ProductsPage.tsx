import { useEffect, useState } from 'react';
import { api, Product } from '@/services/api';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ProductsPage() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [language, setLanguage] = useState<'en' | 'am' | 'om'>('en');

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.getAllProducts({ limit: 1000 }), // Fetch everything
                    api.getCategories()
                ]);

                if (productsRes.success) {
                    setAllProducts(productsRes.data);
                    setFilteredProducts(productsRes.data);
                }
                if (categoriesRes.success) {
                    setCategories(['All', ...categoriesRes.data]);
                }
            } catch (error) {
                console.error('Failed to fetch initial data', error);
                setCategories(['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy']);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        // Fast client-side filtering including localized fields
        const filtered = allProducts.filter(product => {
            const searchLower = search.toLowerCase();
            const matchesSearch = !search ||
                product.name.toLowerCase().includes(searchLower) ||
                product.description?.toLowerCase().includes(searchLower) ||
                product.description_am?.toLowerCase().includes(searchLower) ||
                product.description_om?.toLowerCase().includes(searchLower) ||
                product.category?.toLowerCase().includes(searchLower);

            const matchesCategory = !category || category === 'All' ||
                product.category?.toLowerCase() === category.toLowerCase();

            return matchesSearch && matchesCategory;
        });
        setFilteredProducts(filtered);
    }, [search, category, allProducts]);

    return (
        <div className="min-h-screen bg-[#FAF8F3]">
            <AnimatePresence>
                {loading && <FullScreenLoader />}
            </AnimatePresence>

            <div className="space-y-6 md:space-y-12 px-2 md:px-6 max-w-[1440px] mx-auto py-8 md:py-12">


                {/* Modern Search & Filter Dashboard */}
                <div className="w-full space-y-4 pt-2">
                    {/* Search Input Container - Screenshot Style */}
                    <div className="relative max-w-2xl mx-auto px-1">
                        <div className="relative bg-white border border-stone-200 rounded-lg overflow-hidden flex items-center shadow-sm">
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="flex-1 h-11 border-none bg-transparent text-sm focus-visible:ring-0 font-medium placeholder:text-stone-400 pl-4"
                            />
                            <button className="mr-1.5 w-8 h-8 rounded-full bg-black flex items-center justify-center text-white active:scale-95 transition-transform">
                                <Search className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Category Dashboard - Minimalist Style */}
                    <div className="space-y-4 pt-2">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            {/* Categories - Shadcn-like Tabs */}
                            <div className="flex items-center gap-1 overflow-x-auto pb-1 px-1 no-scrollbar w-full md:w-auto">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat === 'All' ? '' : cat)}
                                        className={cn(
                                            "px-4 py-1.5 text-xs font-semibold rounded-md transition-all border",
                                            (category === cat || (cat === 'All' && !category))
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-stone-500 border-stone-200 hover:border-black hover:text-black"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Language Switcher - Minimalist Pills */}
                            <div className="flex items-center gap-1 p-1 bg-white border border-stone-200 rounded-lg">
                                {['en', 'am', 'om'].map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => setLanguage(lang as any)}
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

                {/* Product Grid */}
                {filteredProducts.length === 0 && !loading ? (
                    <div className="text-center py-16 md:py-24 border-2 md:border-4 border-dashed border-stone-100 rounded-4xl md:rounded-[3rem] bg-stone-50/30">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Search className="h-8 w-8 md:h-10 md:w-10 text-stone-200" />
                        </div>
                        <p className="text-lg md:text-xl text-stone-400 font-bold">No results found for your search.</p>
                        <button onClick={() => { setSearch(''); setCategory(''); }} className="mt-4 text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:underline">Clear all filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] md:gap-4">
                        {filteredProducts.map((product: Product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
