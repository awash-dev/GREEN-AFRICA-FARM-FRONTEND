import { useEffect, useState } from 'react';
import { api, Product } from '@/services/api';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
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
        <div className="space-y-12 px-4 max-w-7xl mx-auto py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <h2 className="text-sm uppercase tracking-[0.3em] text-primary font-black">Our Products</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-stone-900">Explore Our <br />Harvested Freshness</h3>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row items-center gap-3 p-1.5 bg-white border border-stone-200 rounded-3xl shadow-xl shadow-stone-100 flex-1 max-w-2xl">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                        <Input
                            placeholder="Search fresh produce..."
                            className="h-12 pl-12 border-none bg-transparent focus-visible:ring-0 text-base font-medium text-stone-900"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="hidden sm:block w-px h-8 bg-stone-100" />

                    <div className="flex items-center gap-2 w-full sm:w-auto pr-2">
                        <Select value={category || 'All'} onValueChange={(val) => setCategory(val === 'All' ? '' : val)}>
                            <SelectTrigger className="w-[140px] h-10 border-none bg-stone-50 rounded-2xl focus:ring-0 capitalize font-bold text-stone-900">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-stone-100 bg-white">
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat} className="capitalize font-medium">
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
                            <SelectTrigger className="w-[100px] h-10 border-none bg-stone-50 rounded-2xl focus:ring-0 font-bold text-stone-900 text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-stone-100 bg-white">
                                <SelectItem value="en">EN</SelectItem>
                                <SelectItem value="am">አማ</SelectItem>
                                <SelectItem value="om">ORM</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="min-h-[400px] flex items-center justify-center flex-col gap-6 text-primary">
                    <div className="relative">
                        <Loader2 className="h-12 w-12 animate-spin" />
                        <div className="absolute inset-0 blur-2xl bg-primary/20 animate-pulse" />
                    </div>
                    <p className="font-black text-sm uppercase tracking-[0.2em] opacity-60">Gathering the Harvest...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-24 border-4 border-dashed border-stone-100 rounded-[3rem]">
                    <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="h-10 w-10 text-stone-200" />
                    </div>
                    <p className="text-xl text-stone-400 font-bold">No results found for your search.</p>
                    <button onClick={() => { setSearch(''); setCategory(''); }} className="mt-4 text-primary font-black uppercase tracking-widest text-xs hover:underline">Clear all filters</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {products.map((product: Product) => (
                        <ProductCard key={product.id} product={product} language={language} />
                    ))}
                </div>
            )}
        </div>
    );
}
