import { useState, useEffect } from 'react';
import { api, Product, ProductInput, ProductStats } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Loader2,
    ImagePlus,
    Pencil,
    Trash2,
    Plus,
    Package,
    Leaf,
    DollarSign,
    Layers,
    FileText,
    Search,
    CheckCircle2,
    AlertCircle,
    Sprout
} from 'lucide-react';

export function AdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [preview, setPreview] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [stats, setStats] = useState<ProductStats>({
        total: 0,
        lowStock: 0,
        outOfStock: 0,
        totalValue: 0
    });

    const [formData, setFormData] = useState<ProductInput>({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
        image_base64: ''
    });

    useEffect(() => {
        fetchProducts();
        fetchStats();
    }, []);

    // Debounce search
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

    const fetchStats = async () => {
        try {
            const response = await api.getProductStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    }

    const fetchProducts = async () => {
        setFetching(true);
        try {
            const params: any = { limit: 100 }; // Ensure we get a good list
            if (searchQuery) params.search = searchQuery;

            const response = await api.getAllProducts(params);
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
            setNotification({ type: 'error', message: 'Failed to fetch products' });
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
            description: '',
            description_am: '',
            description_om: '',
            price: 0,
            stock: 0,
            category: '',
            image_base64: ''
        });
        setPreview(null);
        setEditingId(null);
    };

    const handleEdit = (product: Product) => {
        setEditingId(product.id!);
        setFormData({
            name: product.name,
            description: product.description || '',
            description_am: product.description_am || '',
            description_om: product.description_om || '',
            price: product.price,
            stock: product.stock,
            category: product.category || '',
            image_base64: product.image_base64 || ''
        });
        setPreview(product.image_base64 || null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await api.deleteProduct(id);
            await fetchProducts();
            await fetchStats(); // Refresh stats
            setNotification({ type: 'success', message: 'Product deleted successfully!' });
        } catch (error) {
            console.error('Failed to delete product', error);
            setNotification({ type: 'error', message: 'Failed to delete product' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock)
            };

            if (editingId) {
                await api.updateProduct(editingId, payload);
                setNotification({ type: 'success', message: 'Product updated successfully!' });
            } else {
                await api.createProduct(payload);
                setNotification({ type: 'success', message: 'Product added successfully!' });
            }

            await fetchProducts();
            await fetchStats(); // Refresh stats
            resetForm();
        } catch (error) {
            console.error('Failed to save product', error);
            setNotification({ type: 'error', message: 'Failed to save product' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-8">
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-24 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 animate-in slide-in-from-right ${notification.type === 'success'
                    ? 'bg-[#2d5a27] text-white'
                    : 'bg-red-600 text-white'
                    }`}>
                    {notification.type === 'success' ? (
                        <CheckCircle2 className="h-5 w-5" />
                    ) : (
                        <AlertCircle className="h-5 w-5" />
                    )}
                    <span className="font-medium">{notification.message}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2d5a27]/20 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#1a3c18] flex items-center gap-3">
                        <Sprout className="h-8 w-8 text-[#2d5a27]" />
                        Farm Administration
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage your farm inventory, track stock, and organize produce.</p>
                </div>
            </div>

            {/* Stats Cards - Farm Themed */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-[#2d5a27] bg-[#fdfefc] hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Produce</p>
                                <p className="text-2xl font-bold text-[#1a3c18]">{stats.total}</p>
                            </div>
                            <Package className="h-8 w-8 text-[#2d5a27] opacity-80" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-yellow-500 bg-[#fdfefc] hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Farm Value</p>
                                <p className="text-2xl font-bold text-[#1a3c18]">${stats.totalValue.toFixed(2)}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-yellow-600 opacity-80" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500 bg-[#fdfefc] hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Low Stock</p>
                                <p className="text-2xl font-bold text-[#1a3c18]">{stats.lowStock}</p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-orange-500 opacity-80" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500 bg-[#fdfefc] hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Out of Stock</p>
                                <p className="text-2xl font-bold text-[#1a3c18]">{stats.outOfStock}</p>
                            </div>
                            <Layers className="h-8 w-8 text-red-500 opacity-80" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24 shadow-lg border-t-4 border-t-[#2d5a27]">
                        <CardHeader className="border-b bg-muted/20">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${editingId ? 'bg-orange-100 text-orange-600' : 'bg-[#eec90d]/20 text-[#2d5a27]'}`}>
                                    {editingId ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                </div>
                                <div>
                                    <CardTitle className="text-[#1a3c18]">{editingId ? 'Edit Produce' : 'Add New Produce'}</CardTitle>
                                    <CardDescription>
                                        {editingId ? 'Update details' : 'Add fresh harvest to inventory'}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-[#1a3c18] font-medium">
                                        <ImagePlus className="h-4 w-4" />
                                        Produce Image
                                    </Label>
                                    <div className="flex items-center justify-center w-full">
                                        <label
                                            htmlFor="image-upload"
                                            className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 overflow-hidden relative ${preview
                                                ? 'border-[#2d5a27]'
                                                : 'border-muted-foreground/30 hover:border-[#2d5a27]/50 hover:bg-[#2d5a27]/5'
                                                }`}
                                        >
                                            {preview ? (
                                                <>
                                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white text-sm font-medium">Click to change</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                                                    <div className="p-3 rounded-full bg-muted mb-3 group-hover:scale-110 transition-transform">
                                                        <ImagePlus className="w-6 h-6" />
                                                    </div>
                                                    <p className="text-sm font-medium">Click to upload</p>
                                                    <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                                                </div>
                                            )}
                                            <input
                                                id="image-upload"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                required={!preview}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Name Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2 text-[#1a3c18] font-medium">
                                        <Leaf className="h-4 w-4" />
                                        Produce Name
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Organic Tomatoes"
                                        value={formData.name}
                                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                        className="h-11 border-input focus-visible:ring-[#2d5a27]"
                                    />
                                </div>

                                {/* Category Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="flex items-center gap-2 text-[#1a3c18] font-medium">
                                        <Layers className="h-4 w-4" />
                                        Category
                                    </Label>
                                    <Input
                                        id="category"
                                        placeholder="e.g. Vegetables"
                                        value={formData.category}
                                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        required
                                        className="h-11 border-input focus-visible:ring-[#2d5a27]"
                                    />
                                </div>

                                {/* Price & Stock */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price" className="flex items-center gap-2 text-[#1a3c18] font-medium">
                                            <DollarSign className="h-4 w-4" />
                                            Price
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                            <Input
                                                id="price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={e => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                                                required
                                                className="h-11 pl-7 border-input focus-visible:ring-[#2d5a27]"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stock" className="flex items-center gap-2 text-[#1a3c18] font-medium">
                                            <Package className="h-4 w-4" />
                                            Stock
                                        </Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={formData.stock}
                                            onChange={e => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                                            required
                                            className="h-11 border-input focus-visible:ring-[#2d5a27]"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-4 pt-2 border-t">
                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="flex items-center gap-2 text-[#1a3c18] font-medium">
                                            <FileText className="h-4 w-4" />
                                            Description (English)
                                            <span className="text-muted-foreground text-xs">(Optional)</span>
                                        </Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Describe your produce..."
                                            className="min-h-[80px] resize-none border-input focus-visible:ring-[#2d5a27]"
                                            value={formData.description}
                                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description_am" className="flex items-center gap-2 text-[#1a3c18] font-medium">
                                            <FileText className="h-4 w-4" />
                                            Description (Amharic)
                                            <span className="text-muted-foreground text-xs">(Optional)</span>
                                        </Label>
                                        <Textarea
                                            id="description_am"
                                            placeholder="መግለጫ በአማርኛ..."
                                            className="min-h-[80px] resize-none border-input focus-visible:ring-[#2d5a27]"
                                            value={formData.description_am || ''}
                                            onChange={e => setFormData(prev => ({ ...prev, description_am: e.target.value }))}
                                            dir="auto"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description_om" className="flex items-center gap-2 text-[#1a3c18] font-medium">
                                            <FileText className="h-4 w-4" />
                                            Description (Afan Oromo)
                                            <span className="text-muted-foreground text-xs">(Optional)</span>
                                        </Label>
                                        <Textarea
                                            id="description_om"
                                            placeholder="Ibsa Afaan Oromootiin..."
                                            className="min-h-[80px] resize-none border-input focus-visible:ring-[#2d5a27]"
                                            value={formData.description_om || ''}
                                            onChange={e => setFormData(prev => ({ ...prev, description_om: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    {editingId && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1 h-11 border-[#2d5a27] text-[#2d5a27] hover:bg-[#2d5a27]/10"
                                            onClick={resetForm}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                    <Button
                                        type="submit"
                                        className="flex-1 h-11 gap-2 bg-[#2d5a27] hover:bg-[#1a3c18] text-white"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : editingId ? (
                                            <CheckCircle2 className="h-4 w-4" />
                                        ) : (
                                            <Plus className="h-4 w-4" />
                                        )}
                                        {editingId ? 'Update Produce' : 'Add Produce'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>



                {/* List Section */}
                <div className="lg:col-span-2">
                    <Card className="shadow-lg border-t-4 border-t-[#2d5a27]">
                        <CardHeader className="border-b bg-muted/20">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-[#1a3c18]">
                                        <Package className="h-5 w-5" />
                                        Farm Inventory
                                    </CardTitle>
                                    <CardDescription>{stats.total} items in stock</CardDescription>
                                </div>
                                {/* Search */}
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search inventory..."
                                        className="pl-9 h-10 border-input focus-visible:ring-[#2d5a27]"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {fetching ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <Loader2 className="h-10 w-10 animate-spin text-[#2d5a27] mb-4" />
                                    <p className="text-muted-foreground">Loading farm records...</p>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="p-4 rounded-full bg-muted mb-4">
                                        <Sprout className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-semibold text-lg text-[#1a3c18]">No produce found</h3>
                                    <p className="text-muted-foreground mt-1">
                                        {searchQuery ? 'Try a different search term' : 'Start adding fresh produce to your farm'}
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {products.map((product) => {
                                        const isLowStock = product.stock <= 5 && product.stock > 0;
                                        const isOutOfStock = product.stock === 0;

                                        return (
                                            <div
                                                key={product.id}
                                                className={`flex flex-col sm:flex-row gap-4 p-4 hover:bg-[#2d5a27]/5 transition-colors ${editingId === product.id ? 'bg-[#2d5a27]/10 border-l-4 border-l-[#2d5a27]' : ''
                                                    }`}
                                            >
                                                {/* Image & Info Group */}
                                                <div className="flex items-start gap-4 flex-1">
                                                    {/* Image */}
                                                    <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 border-2 border-muted">
                                                        {product.image_base64 ? (
                                                            <img
                                                                src={product.image_base64}
                                                                alt={product.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center bg-muted">
                                                                <ImagePlus className="h-6 w-6 text-muted-foreground/50" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h4 className="font-semibold truncate text-[#1a3c18] mr-auto">{product.name}</h4>
                                                            {isOutOfStock && (
                                                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700 whitespace-nowrap">
                                                                    Out of Stock
                                                                </span>
                                                            )}
                                                            {isLowStock && (
                                                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700 whitespace-nowrap">
                                                                    Low Stock
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                                                            <span className="inline-flex items-center gap-1">
                                                                <Layers className="h-3 w-3" />
                                                                {product.category || 'Uncategorized'}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1">
                                                                <Package className="h-3 w-3" />
                                                                {product.stock} units
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Price & Actions Group */}
                                                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pl-[5rem] sm:pl-0">
                                                    {/* Price */}
                                                    <div className="text-left sm:text-right">
                                                        <span className="text-lg font-bold text-[#1a3c18]">
                                                            ${product.price.toFixed(2)}
                                                        </span>
                                                        <p className="text-xs text-muted-foreground">per unit</p>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-9 w-9 hover:bg-[#2d5a27]/10 hover:text-[#2d5a27]"
                                                            onClick={() => handleEdit(product)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-9 w-9 hover:bg-destructive/10 text-destructive"
                                                            onClick={() => handleDelete(product.id!)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}