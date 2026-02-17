import { useEffect, useState } from 'react';
import { api, Product } from '@/services/api';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Globe } from 'lucide-react';
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
            <div className="space-y-6 md:space-y-12 px-4 md:px-6 max-w-7xl mx-auto py-8 md:py-12">
                {/* Header & Search Section */}
                <div className="flex flex-col items-center text-center space-y-5 max-w-3xl mx-auto">
                    <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-emerald-600">
                            <span className="h-px w-4 bg-emerald-600/30"></span>
                            <span className="text-[9px] font-black uppercase tracking-[0.25em]">Premium Harvest</span>
                            <span className="h-px w-4 bg-emerald-600/30"></span>
                        </div>
                        <h1 className="font-serif text-3xl md:text-5xl text-[#0F2E1C] leading-[0.9]">
                            Pure African <span className="italic text-[#2E7D32]">Harvest</span>
                        </h1>
                        <p className="text-[#6D4C41]/60 text-[10px] font-black uppercase tracking-[0.3em] pt-1">
                            Organic • Quality • Sustainable
                        </p>
                    </div>

                    {/* Floating Search Bar */}
                    <div className="w-full bg-white p-1.5 rounded-full shadow-lg shadow-[#0F2E1C]/5 border border-stone-100 flex flex-col sm:flex-row items-center gap-1.5 transition-all hover:shadow-xl hover:shadow-[#0F2E1C]/10 hover:-translate-y-0.5 duration-500 max-w-xl mx-auto">
                        <div className="relative flex-1 w-full text-center sm:text-left">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-stone-50 flex items-center justify-center text-stone-400">
                                <Search className="h-3.5 w-3.5" />
                            </div>
                            <Input
                                placeholder="Search..."
                                className="h-10 pl-14 border-none bg-transparent text-sm placeholder:text-stone-400 font-bold focus-visible:ring-0"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="hidden sm:block w-px h-6 bg-stone-100"></div>

                        <div className="flex w-full sm:w-auto gap-1.5 overflow-x-auto pb-1 sm:pb-0 px-1 sm:px-0 scrollbar-hide justify-center sm:justify-start">
                            <Select value={category || 'All'} onValueChange={(val) => setCategory(val === 'All' ? '' : val)}>
                                <SelectTrigger className="h-10 w-full sm:w-[120px] border-none bg-stone-50 rounded-full px-4 font-bold text-[#0F2E1C] hover:bg-[#E8F0E6] transition-colors focus:ring-0 text-[10px] uppercase tracking-wider">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-stone-100 shadow-xl p-1 bg-white">
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat} className="rounded-lg font-medium cursor-pointer focus:bg-[#E8F0E6] focus:text-[#0F2E1C]">
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
                                <SelectTrigger className="h-10 w-[70px] shrink-0 border-none bg-stone-50 rounded-full font-black text-[#0F2E1C] hover:bg-[#E8F0E6] transition-colors focus:ring-0 text-[10px] pl-3 pr-2 flex items-center justify-center gap-1">
                                    <Globe className="h-3 w-3 opacity-50" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="min-w-[80px] rounded-xl border-stone-100 shadow-xl p-1 bg-white" align="end">
                                    <SelectItem value="en" className="rounded-lg font-bold text-xs justify-center">EN</SelectItem>
                                    <SelectItem value="am" className="rounded-lg font-bold text-xs justify-center">አማ</SelectItem>
                                    <SelectItem value="om" className="rounded-lg font-bold text-xs justify-center">ORM</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="min-h-[400px] flex items-center justify-center flex-col gap-6 text-emerald-600">
                        <div className="relative">
                            <Loader2 className="h-12 w-12 animate-spin" />
                            <div className="absolute inset-0 blur-2xl bg-emerald-500/20 animate-pulse" />
                        </div>
                        <p className="font-black text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-60">Gathering the Harvest...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-16 md:py-24 border-2 md:border-4 border-dashed border-stone-100 rounded-4xl md:rounded-[3rem] bg-stone-50/30">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Search className="h-8 w-8 md:h-10 md:w-10 text-stone-200" />
                        </div>
                        <p className="text-lg md:text-xl text-stone-400 font-bold">No results found for your search.</p>
                        <button onClick={() => { setSearch(''); setCategory(''); }} className="mt-4 text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:underline">Clear all filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
                        {products.map((product: Product) => (
                            <ProductCard key={product.id} product={product} language={language} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
