import { useEffect, useState } from 'react';
import { api, Product } from '@/services/api';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

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
        <div className="space-y-8">
            {/* Hero Section */}
            <section className="bg-primary/10 rounded-xl p-8 md:p-12 text-center space-y-4 border border-primary/20">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
                    Fresh from Green Africa Farm
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Organic, sustainable, and locally sourced agricultural products delivered straight to your table.
                </p>
            </section>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-40 bg-background/80 backdrop-blur pb-4 pt-2">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search produce..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* Language Switcher */}
                    <div className="flex items-center gap-2 bg-white/50 p-1 rounded-lg border border-input">
                        <select
                            className="h-8 rounded-md border-0 bg-transparent px-3 py-1 text-sm font-medium focus:ring-0 cursor-pointer text-[#1a3c18]"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                        >
                            <option value="en">English</option>
                            <option value="am">Amharic (አማርኛ)</option>
                            <option value="om">Afan Oromo</option>
                        </select>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant={category === (cat === 'All' ? '' : cat) ? 'default' : 'outline'}
                                onClick={() => setCategory(cat === 'All' ? '' : cat)}
                                className={`rounded-full capitalize whitespace-nowrap ${category === (cat === 'All' ? '' : cat) ? 'bg-[#2d5a27] hover:bg-[#1a3c18]' : 'text-[#2d5a27] border-[#2d5a27]/30'}`}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
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
