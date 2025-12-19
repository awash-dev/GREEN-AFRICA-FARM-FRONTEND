import { useEffect, useState } from 'react';
import { api, Product } from '@/services/api';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Leaf } from 'lucide-react';

export function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [language, setLanguage] = useState<'en' | 'am' | 'om'>('en');

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    // Debounce search effect or use button to trigger
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 500); // Debounce search by 500ms
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
            // Fallback default categories
            setCategories(['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy']);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
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
        <div className="space-y-12 pb-20">
            {/* Hero Section - Premium Agricultural Experience */}
            <section className="relative h-[500px] md:h-[600px] rounded-[2rem] overflow-hidden group shadow-2xl border border-white/10">
                <img
                    src="/og-image.png"
                    alt="Green Africa Farm Landscape"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a3c18]/90 via-[#1a3c18]/60 to-transparent flex flex-col justify-center px-8 md:px-16 space-y-6">
                    <div className="space-y-2 animate-in slide-in-from-left duration-700">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[#eec90d]/20 text-[#eec90d] text-xs font-black uppercase tracking-[0.2em] backdrop-blur-md border border-[#eec90d]/30">
                            Est. 2024 • Organic Excellence
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9] text-glow">
                            NATURALLY <br />
                            <span className="text-[#eec90d]">GROWN</span> <br />
                            FRESHNESS
                        </h1>
                    </div>
                    <p className="text-white/80 text-lg md:text-xl max-w-xl leading-relaxed font-medium animate-in slide-in-from-left delay-150 duration-700">
                        Experience the gold standard of organic farming. Sustainable, locally sourced, and delivered with integrity.
                    </p>
                    <div className="flex gap-4 pt-4 animate-in slide-in-from-left delay-300 duration-700">
                        <Button className="h-14 px-8 bg-[#eec90d] hover:bg-[#d4b30c] text-[#1a3c18] font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 shadow-xl">
                            Explore Harvest
                        </Button>
                        <Button variant="outline" className="h-14 px-8 border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 font-black uppercase tracking-widest rounded-2xl transition-all">
                            Our Story
                        </Button>
                    </div>
                </div>

                {/* Floating Stats - Glass Look */}
                <div className="absolute bottom-8 right-8 hidden xl:grid grid-cols-2 gap-4">
                    <div className="glass p-4 rounded-2xl flex items-center gap-4 text-[#1a3c18]">
                        <div className="h-10 w-10 rounded-xl bg-[#2d5a27] flex items-center justify-center text-white">
                            <Leaf className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xl font-black leading-none">100%</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Organic</p>
                        </div>
                    </div>
                    <div className="glass p-4 rounded-2xl flex items-center gap-4 text-[#1a3c18]">
                        <div className="h-10 w-10 rounded-xl bg-[#eec90d] flex items-center justify-center text-[#1a3c18]">
                            <Search className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xl font-black leading-none">Trace</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Source</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters Bar - Fixed Glassmorphism */}
            <div className="sticky top-4 z-50 glass rounded-3xl p-4 flex flex-col md:flex-row gap-6 items-center justify-between shadow-2xl border border-white/40">
                <div className="relative w-full md:w-[400px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#2d5a27]/60" />
                    <Input
                        placeholder="Search our fresh harvest..."
                        className="pl-12 h-14 bg-white/50 border-0 focus-visible:ring-2 focus-visible:ring-[#2d5a27] rounded-2xl font-bold text-[#1a3c18] placeholder:text-[#2d5a27]/40 shadow-inner"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    {/* Language Switcher */}
                    <div className="flex items-center gap-2 bg-[#2d5a27]/5 p-1 rounded-2xl border border-[#2d5a27]/10">
                        <select
                            className="h-12 rounded-xl border-0 bg-transparent px-4 py-1 text-xs font-black uppercase tracking-widest focus:ring-0 cursor-pointer text-[#1a3c18]"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                        >
                            <option value="en">EN</option>
                            <option value="am">አማ</option>
                            <option value="om">OM</option>
                        </select>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar flex-1 md:flex-none">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant={category === (cat === 'All' ? '' : cat) ? 'default' : 'outline'}
                                onClick={() => setCategory(cat === 'All' ? '' : cat)}
                                className={`h-12 px-6 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] transition-all ${category === (cat === 'All' ? '' : cat)
                                    ? 'bg-[#2d5a27] text-white shadow-xl shadow-[#2d5a27]/20 scale-105'
                                    : 'bg-white/50 hover:bg-white border-[#2d5a27]/20 text-[#2d5a27]'
                                    }`}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Title */}
            <div className="space-y-2 border-l-4 border-[#eec90d] pl-6">
                <h2 className="text-3xl font-black tracking-tight text-[#1a3c18] uppercase">Current Harvest</h2>
                <p className="text-muted-foreground font-bold text-sm tracking-wide">Hand-picked organic produce available today</p>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="min-h-[400px] flex items-center justify-center flex-col gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading fresh produce...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    No products found. Try adjusting your filters.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} language={language} />
                    ))}
                </div>
            )}
        </div>
    );
}
