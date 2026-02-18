import { useEffect, useState } from 'react';
import { api, Product } from '@/services/api';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Search, Globe } from 'lucide-react';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [language, setLanguage] = useState<'en' | 'am' | 'om'>('en');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts(products.length === 0);
        }, search || category ? 400 : 0);
        return () => clearTimeout(timer);
    }, [search, category]);

    const fetchCategories = async () => {
        try {
            const response = await api.getCategories();
            if (response.success) {
                setCategories(['All', ...response.data]);
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
            setCategories(['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy']);
        }
    };

    const fetchProducts = async (showFullLoading: boolean) => {
        if (showFullLoading) setLoading(true);
        try {
            const params: any = { limit: 100 };
            if (search) params.search = search;
            if (category && category !== 'All') params.category = category.trim();

            const response = await api.getAllProducts(params);
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F3]">
            <AnimatePresence>
                {loading && <FullScreenLoader />}
            </AnimatePresence>

            <div className="space-y-6 md:space-y-12 px-4 md:px-6 max-w-7xl mx-auto py-8 md:py-12">
                {/* Header & Search Section */}
                {/* Header Section */}
                <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
                    <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-emerald-600">
                            <span className="h-px w-4 bg-emerald-600/30"></span>
                            <span className="text-[9px] font-black uppercase tracking-[0.25em]">Premium Harvest</span>
                            <span className="h-px w-4 bg-emerald-600/30"></span>
                        </div>
                        <h1 className="font-serif text-3xl md:text-5xl text-[#0F2E1C] leading-none">
                            Ethiopian Highland <span className="italic text-[#2E7D32]">Harvest</span>
                        </h1>
                    </div>

                    {/* Modern Search Section */}
                    <div className="w-full space-y-6">
                        {/* Search Input Container */}
                        <div className="relative group max-w-2xl mx-auto">
                            <div className="absolute inset-0 bg-emerald-500/5 blur-2xl rounded-full group-hover:bg-emerald-500/10 transition-colors duration-500" />
                            <div className="relative bg-white border border-stone-100 rounded-2xl shadow-xl shadow-stone-200/40 p-1 flex items-center gap-2">
                                <div className="pl-4 pr-1 text-stone-400">
                                    <Search className="h-5 w-5" />
                                </div>
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search fresh produce..."
                                    className="flex-1 h-12 md:h-14 border-none bg-transparent text-base focus-visible:ring-0 font-medium placeholder:text-stone-300"
                                />
                                <div className="hidden md:flex pr-2 items-center gap-2">
                                    <div className="h-8 w-px bg-stone-100 mx-2" />
                                    <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
                                        <SelectTrigger className="w-[80px] h-10 border-none bg-stone-50 rounded-xl font-bold text-xs uppercase tracking-wider text-[#0F2E1C] focus:ring-0">
                                            <Globe className="h-3 w-3 mr-1 opacity-50" />
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="min-w-[80px] rounded-xl border-stone-100 shadow-xl bg-white" align="end">
                                            <SelectItem value="en" className="font-bold text-xs">EN</SelectItem>
                                            <SelectItem value="am" className="font-bold text-xs">አማ</SelectItem>
                                            <SelectItem value="om" className="font-bold text-xs">ORM</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Language Selection for Mobile */}
                        <div className="flex md:hidden justify-center items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Preferred Language</span>
                            <div className="flex bg-stone-100 p-1 rounded-xl">
                                {['en', 'am', 'om'].map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => setLanguage(lang as any)}
                                        className={cn(
                                            "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase",
                                            language === lang ? "bg-white text-[#2E7D32] shadow-sm" : "text-stone-400"
                                        )}
                                    >
                                        {lang === 'en' ? 'EN' : lang === 'am' ? 'አማ' : 'ORM'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category Chips - Scrollable for Mobile */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 text-center">Filter by Category</p>
                            <div className="flex items-center gap-2 overflow-x-auto pb-4 px-2 no-scrollbar justify-start md:justify-center">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat === 'All' ? '' : cat)}
                                        className={cn(
                                            "whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border",
                                            (category === cat || (cat === 'All' && !category))
                                                ? "bg-[#0F2E1C] text-white border-[#0F2E1C] shadow-lg shadow-[#0F2E1C]/20 scale-105"
                                                : "bg-white text-stone-500 border-stone-100 hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50/50"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {products.length === 0 && !loading ? (
                    <div className="text-center py-16 md:py-24 border-2 md:border-4 border-dashed border-stone-100 rounded-4xl md:rounded-[3rem] bg-stone-50/30">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Search className="h-8 w-8 md:h-10 md:w-10 text-stone-200" />
                        </div>
                        <p className="text-lg md:text-xl text-stone-400 font-bold">No results found for your search.</p>
                        <button onClick={() => { setSearch(''); setCategory(''); }} className="mt-4 text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:underline">Clear all filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
                        {products.map((product: Product) => (
                            <ProductCard key={product.id} product={product} language={language} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
