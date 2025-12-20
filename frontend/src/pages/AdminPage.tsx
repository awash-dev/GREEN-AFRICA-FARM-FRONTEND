import { useState, useEffect } from 'react';
import { api, Product, ProductInput } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Loader2,
    ImagePlus,
    Pencil,
    Trash2,
    Package,
    Search,
    CheckCircle2,
    AlertCircle,
    LayoutGrid,
    PlusCircle,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type AdminView = 'inventory' | 'manage';

export function AdminPage() {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState<AdminView>('inventory');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [preview, setPreview] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const [formData, setFormData] = useState<ProductInput>({
        name: '',
        category: '',
        description: '',
        description_am: '',
        description_om: '',
        price: 0,
        image_base64: '',
    });

    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.getCategories();
            if (response.success) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const fetchProducts = async () => {
        setFetching(true);
        try {
            const params: any = { limit: 100 };
            if (searchQuery) params.search = searchQuery;

            const response = await api.getAllProducts(params);
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error: any) {
            console.error('Failed to fetch products', error);
            const message = error.response?.data?.error || 'Failed to fetch products';
            setNotification({ type: 'error', message });
        } finally {
            setFetching(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setPreview(base64);
                setFormData(prev => ({ ...prev, image_base64: base64 }));
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: categories[0] || '',
            description: '',
            description_am: '',
            description_om: '',
            price: 0,
            image_base64: '',
        });
        setPreview(null);
        setEditingId(null);
        setActiveView('inventory');
    };

    const handleEdit = (product: Product) => {
        setEditingId(product.id!);
        setFormData({
            name: product.name,
            category: product.category || '',
            description: product.description || '',
            description_am: product.description_am || '',
            description_om: product.description_om || '',
            price: product.price,
            image_base64: product.image_base64 || '',
        });
        setPreview(product.image_base64 || null);
        setActiveView('manage');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string | number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await api.deleteProduct(id);
            await fetchProducts();
            setNotification({ type: 'success', message: 'Product deleted successfully!' });
        } catch (error: any) {
            console.error('Failed to delete product', error);
            const message = error.response?.data?.error || 'Failed to delete product';
            setNotification({ type: 'error', message });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
            };

            if (editingId) {
                await api.updateProduct(editingId, payload);
                setNotification({ type: 'success', message: 'Product updated successfully!' });
            } else {
                await api.createProduct(payload);
                setNotification({ type: 'success', message: 'Product added successfully!' });
            }

            await fetchProducts();
            resetForm();
        } catch (error: any) {
            console.error('Failed to save product', error);
            const message = error.response?.data?.error || 'Failed to save product';
            setNotification({ type: 'error', message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-40">
                <div className="container mx-auto px-4">
                    <div className="h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">Home</span>
                            </Button>

                            <div className="h-6 w-px bg-gray-200" />

                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                <h1 className="font-semibold text-lg">Admin Dashboard</h1>
                            </div>
                        </div>

                        {/* View Switcher */}
                        <div className="flex gap-2">
                            <Button
                                variant={activeView === 'inventory' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => { setActiveView('inventory'); setEditingId(null); }}
                            >
                                <LayoutGrid className="h-4 w-4 mr-2" />
                                Inventory
                            </Button>
                            <Button
                                variant={activeView === 'manage' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setActiveView('manage')}
                            >
                                {editingId ? <Pencil className="h-4 w-4 mr-2" /> : <PlusCircle className="h-4 w-4 mr-2" />}
                                {editingId ? 'Edit' : 'Add New'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 overflow-hidden flex flex-col">
                <div className="container mx-auto px-4 py-4 max-w-6xl h-full flex flex-col">
                    {notification && (
                        <div className={`mb-4 p-4 rounded-lg border flex items-center gap-3 flex-shrink-0 ${notification.type === 'success'
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                            }`}>
                            {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                            <p className="text-sm font-medium">{notification.message}</p>
                        </div>
                    )}

                    {activeView === 'manage' ? (
                        <Card className="flex-1 flex flex-col overflow-hidden">
                            <CardHeader className="flex-shrink-0">
                                <CardTitle>{editingId ? 'Edit Product' : 'Add New Product'}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto">
                                <form onSubmit={handleSubmit} className="space-y-2 pb-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Image Upload */}
                                        <div className="space-y-2">
                                            <Label>Product Image</Label>
                                            <div className="border-2 border-dashed rounded-lg p-4 min-h-[200px] flex items-center justify-center relative">
                                                {preview ? (
                                                    <img src={preview} alt="Preview" className="max-h-[150px] object-contain" />
                                                ) : (
                                                    <div className="text-center text-gray-400">
                                                        <ImagePlus className="h-12 w-12 mx-auto mb-2" />
                                                        <p className="text-sm">No image selected</p>
                                                    </div>
                                                )}
                                                <label className="absolute inset-0 cursor-pointer">
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required={!preview} />
                                                </label>
                                            </div>
                                        </div>

                                        {/* Basic Info */}
                                        <div className="space-y-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Product Name</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                    placeholder="e.g. Red Onions"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="category">Category</Label>
                                                <Input
                                                    id="category"
                                                    list="categories"
                                                    value={formData.category}
                                                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                                    placeholder="e.g. Vegetables"
                                                    required
                                                />
                                                <datalist id="categories">
                                                    {categories.map(c => <option key={c} value={c} />)}
                                                </datalist>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="price">Price (ETB)</Label>
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={e => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                                                    placeholder="0.00"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Descriptions */}
                                    <div className="space-y-2">
                                        <Label>Descriptions</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                            <div className="space-y-2">
                                                <Label className="text-xs text-gray-500">English</Label>
                                                <Textarea
                                                    placeholder="Description in English..."
                                                    value={formData.description}
                                                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                    className="min-h-[100px]"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs text-gray-500">Amharic (አማርኛ)</Label>
                                                <Textarea
                                                    placeholder="በአማርኛ..."
                                                    value={formData.description_am}
                                                    onChange={e => setFormData(prev => ({ ...prev, description_am: e.target.value }))}
                                                    className="min-h-[100px]"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs text-gray-500">Oromo (Afaan Oromoo)</Label>
                                                <Textarea
                                                    placeholder="Afaan Oromootiin..."
                                                    value={formData.description_om}
                                                    onChange={e => setFormData(prev => ({ ...prev, description_om: e.target.value }))}
                                                    className="min-h-[100px]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 justify-end pt-2 border-t">
                                        <Button type="button" variant="outline" onClick={resetForm}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={loading}>
                                            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                            {editingId ? 'Update Product' : 'Add Product'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {/* Search */}
                            <div className="flex gap-4 items-center">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search products..."
                                        className="pl-9"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="text-sm text-gray-500">
                                    {products.length} products
                                </div>
                            </div>

                            {/* Product List */}
                            <Card>
                                <CardContent className="p-0">
                                    {fetching ? (
                                        <div className="p-12 flex flex-col items-center justify-center gap-4">
                                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                            <p className="text-sm text-gray-500">Loading products...</p>
                                        </div>
                                    ) : products.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">No products found</h3>
                                            <p className="text-sm text-gray-500">Try adjusting your search or add a new product.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y">
                                            {products.map(product => (
                                                <div key={product.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                                                    <div className="h-16 w-16 rounded-lg overflow-hidden border bg-gray-100 flex-shrink-0">
                                                        {product.image_base64 ? (
                                                            <img src={product.image_base64} className="w-full h-full object-cover" alt={product.name} />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <ImagePlus className="h-6 w-6 text-gray-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-semibold truncate">{product.name}</h4>
                                                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                                {product.category}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 truncate">
                                                            {product.description || 'No description'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right hidden sm:block">
                                                            <p className="text-xs text-gray-500">Price</p>
                                                            <p className="font-semibold">{product.price.toLocaleString()} ETB</p>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id!)}>
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}