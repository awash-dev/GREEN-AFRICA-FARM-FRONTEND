import { useEffect, useState } from 'react';
import { api, Product } from '@/services/api';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Filter, Globe } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [language, setLanguage] = useState<'en' | 'am' | 'om'>('en');
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        // Initial load should be fast, subsequent searches debounced
        if (isFirstLoad) {
            fetchProducts(true);
            setIsFirstLoad(false);
            return;
        }

        const timer = setTimeout(() => {
            fetchProducts(false);
        }, 400);
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
            const params: any = {};
            if (search) params.search = search;
            if (category && category !== 'All') params.category = category;

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
        <div className="space-y-12">
            {/* Unified Search Section */}
            <div className="sticky top-[5rem] z-40">
                <div className="flex flex-col md:flex-row items-center gap-2 p-1.5 bg-white border border-emerald-500/10 rounded-2xl shadow-sm">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600/40" />
                        <Input
                            placeholder="Search fresh produce..."
                            className="h-12 pl-10 border-none bg-transparent focus-visible:ring-0 text-base"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="hidden md:block w-px h-8 bg-emerald-500/10" />

                    <div className="flex items-center gap-2 w-full md:w-auto px-2">
                        <div className="flex items-center gap-2 bg-emerald-50/30 rounded-xl px-2">
                            <Filter className="h-4 w-4 text-emerald-600/50" />
                            <Select value={category || 'All'} onValueChange={(val) => setCategory(val === 'All' ? '' : val)}>
                                <SelectTrigger className="w-[140px] h-10 border-none bg-transparent focus:ring-0 capitalize font-medium text-emerald-900">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-emerald-500/10 bg-white">
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat} className="capitalize">
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 bg-secondary/20 rounded-xl px-2">
                            <Globe className="h-4 w-4 text-emerald-600/50" />
                            <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
                                <SelectTrigger className="w-[120px] h-10 border-none bg-transparent focus:ring-0 font-medium text-emerald-900">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-emerald-500/10 bg-white">
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="am">አማርኛ</SelectItem>
                                    <SelectItem value="om">Oromo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="min-h-[400px] flex items-center justify-center flex-col gap-4 text-emerald-600">
                    <div className="relative">
                        <Loader2 className="h-10 w-10 animate-spin" />
                        <div className="absolute inset-0 blur-xl bg-emerald-500/10 animate-pulse" />
                    </div>
                    <p className="font-bold text-xs uppercase tracking-widest opacity-50">Fetching harvest...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-24 border-2 border-dashed border-emerald-500/5 rounded-[2rem]">
                    <Search className="h-12 w-12 text-emerald-100 mx-auto mb-4" />
                    <p className="text-emerald-900/40 font-medium">No results found for your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product: Product) => (
                        <ProductCard key={product.id} product={product} language={language} />
                    ))}
                </div>
            )}
        </div>
    );
}