import { useState, useEffect } from 'react';
import { api, Product, ProductInput, TeamMember } from '@/services/api';
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
    ArrowLeft,
    Users,
    ShoppingBag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FullScreenLoader } from '@/components/FullScreenLoader';

type AdminView = 'inventory' | 'manage' | 'team' | 'orders';

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    _id: string;
    orderId: string;
    customer: {
        fullName: string;
        phone: string;
        address: string;
        region: string;
        notes?: string;
    };
    items: OrderItem[];
    total: number;
    status: 'pending' | 'processing' | 'delivered' | 'cancelled';
    createdAt: string;
}

export function AdminPage() {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState<AdminView>('inventory');

    const [products, setProducts] = useState<Product[]>([]);
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
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

    const [memberData, setMemberData] = useState<Partial<TeamMember>>({
        name: '',
        role: '',
        bio: '',
        image_base64: '',
    });

    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchTeam();
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.getAllOrders();
            if (response.success) {
                setOrders(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        }
    };

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

    const fetchTeam = async () => {
        try {
            const response = await api.getTeamMembers();
            if (response.success) {
                setTeam(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch team members', error);
        }
    };

    useEffect(() => {
        if (activeView === 'inventory') {
            const timer = setTimeout(() => {
                fetchProducts();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchQuery, activeView]);

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isTeam: boolean = false) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setPreview(base64);
                if (isTeam) {
                    setMemberData(prev => ({ ...prev, image_base64: base64 }));
                } else {
                    setFormData((prev: any) => ({ ...prev, image_base64: base64 }));
                }
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
        setMemberData({
            name: '',
            role: '',
            bio: '',
            image_base64: '',
        });
        setPreview(null);
        setEditingId(null);
        setActiveView('inventory');
    };

    const handleEditMember = (member: TeamMember) => {
        setEditingId(member.id!);
        setMemberData({
            name: member.name,
            role: member.role,
            bio: member.bio,
            image_base64: member.image_base64,
        });
        setPreview(member.image_base64 || null);
        setActiveView('team');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteMember = async (id: string) => {
        if (!confirm('Are you sure you want to delete this team member?')) return;
        try {
            await api.deleteTeamMember(id);
            await fetchTeam();
            setNotification({ type: 'success', message: 'Member deleted successfully!' });
        } catch (error: any) {
            setNotification({ type: 'error', message: 'Failed to delete member' });
        }
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

    const handleMemberSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await api.updateTeamMember(editingId.toString(), memberData);
                setNotification({ type: 'success', message: 'Member updated successfully!' });
            } else {
                await api.createTeamMember(memberData);
                setNotification({ type: 'success', message: 'Member added successfully!' });
            }
            await fetchTeam();
            resetForm();
        } catch (error) {
            setNotification({ type: 'error', message: 'Failed to save member' });
        } finally {
            setLoading(false);
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

    const handleUpdateOrderStatus = async (id: string, status: string) => {
        try {
            const response = await api.updateOrderStatus(id, status);
            if (response.success) {
                setNotification({ type: 'success', message: 'Order status updated!' });
                fetchOrders();
            }
        } catch (error) {
            setNotification({ type: 'error', message: 'Failed to update order status' });
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Optimized for mobile view

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const paginatedProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            const listContainer = document.getElementById('inventory-list');
            if (listContainer) listContainer.scrollTop = 0;
        }
    };

    return (
        <div className="h-screen bg-stone-50/50 flex flex-col font-sans overflow-hidden">
            {loading && <FullScreenLoader />}
            {/* Header - Compact & Responsive */}
            <div className="bg-white/90 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50 flex-shrink-0 shadow-sm/50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between py-2 md:h-16 gap-3">
                        <div className="flex items-center justify-between w-full md:w-auto">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate('/')}
                                    className="h-8 w-8 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-full"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>

                                <div className="h-6 w-px bg-stone-200 hidden sm:block" />

                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                                        <Package className="h-4 w-4 text-emerald-700" />
                                    </div>
                                    <div className="leading-none">
                                        <h1 className="font-bold text-stone-900 text-sm md:text-base tracking-tight">Farm Manager</h1>
                                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Green Africa Core</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* View Switcher - Scrollable on mobile */}
                        <div className="w-full md:w-auto overflow-x-auto no-scrollbar">
                            <div className="flex gap-1 p-1 bg-stone-100/80 rounded-lg min-w-max mx-auto md:mx-0">
                                <Button
                                    variant={activeView === 'inventory' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => { setActiveView('inventory'); setEditingId(null); }}
                                    className={`rounded-md text-xs font-bold transition-all h-8 px-3 ${activeView === 'inventory' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 hover:bg-emerald-700' : 'text-stone-600 hover:bg-white hover:text-emerald-700'}`}
                                >
                                    <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
                                    Inventory
                                </Button>
                                <Button
                                    variant={activeView === 'manage' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setActiveView('manage')}
                                    className={`rounded-md text-xs font-bold transition-all h-8 px-3 ${activeView === 'manage' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 hover:bg-emerald-700' : 'text-stone-600 hover:bg-white hover:text-emerald-700'}`}
                                >
                                    {editingId && activeView === 'manage' ? <Pencil className="h-3.5 w-3.5 mr-1.5" /> : <PlusCircle className="h-3.5 w-3.5 mr-1.5" />}
                                    {editingId && activeView === 'manage' ? 'Edit' : 'Add Product'}
                                </Button>
                                <Button
                                    variant={activeView === 'team' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setActiveView('team')}
                                    className={`rounded-md text-xs font-bold transition-all h-8 px-3 ${activeView === 'team' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 hover:bg-emerald-700' : 'text-stone-600 hover:bg-white hover:text-emerald-700'}`}
                                >
                                    <Users className="h-3.5 w-3.5 mr-1.5" />
                                    About Team
                                </Button>
                                <Button
                                    variant={activeView === 'orders' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setActiveView('orders')}
                                    className={`rounded-md text-xs font-bold transition-all h-8 px-3 ${activeView === 'orders' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 hover:bg-emerald-700' : 'text-stone-600 hover:bg-white hover:text-emerald-700'}`}
                                >
                                    <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                                    Orders
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-stone-50">
                <div id="inventory-list" className="container mx-auto px-4 py-4 max-w-5xl h-full flex flex-col overflow-y-auto pb-20 scroll-smooth">
                    {notification && (
                        <div className={`mb-4 p-3 rounded-lg border flex items-center gap-3 flex-shrink-0 animate-in fade-in slide-in-from-top-2 duration-300 ${notification.type === 'success'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                            }`}>
                            {notification.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            <p className="text-xs font-medium">{notification.message}</p>
                        </div>
                    )}

                    {activeView === 'team' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
                            {/* Member Form */}
                            <Card className="lg:col-span-1 h-fit shadow-sm border-stone-200">
                                <CardHeader className="pb-3 border-b border-stone-100">
                                    <CardTitle className="text-lg font-bold text-stone-800">{editingId ? 'Edit Leader' : 'Add New Leader'}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    {!editingId && team.length >= 1 ? (
                                        <div className="text-center py-6 space-y-3">
                                            <div className="p-4 bg-orange-50 text-orange-700 rounded-xl text-xs border border-orange-100">
                                                <AlertCircle className="h-6 w-6 mx-auto mb-2 opacity-60" />
                                                <p className="font-bold">Leader Profile Exists</p>
                                                <p className="mt-1 opacity-80">Only one leader profile allowed. Please edit the existing profile.</p>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="mt-3 w-full bg-white border border-orange-200 hover:bg-orange-100 text-orange-800"
                                                    onClick={() => handleEditMember(team[0])}
                                                >
                                                    Edit Existing Profile
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleMemberSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-stone-500 uppercase">Photo</Label>
                                                <div className="border-2 border-dashed border-stone-200 rounded-xl p-2 min-h-[140px] flex items-center justify-center relative bg-stone-50/50 hover:bg-stone-50 transition-colors group">
                                                    {preview ? (
                                                        <div className="relative w-full h-full flex justify-center">
                                                            <img src={preview} alt="Preview" className="max-h-[130px] rounded-lg object-contain shadow-sm" />
                                                            <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">Change Photo</div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center text-stone-400">
                                                            <ImagePlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                            <p className="text-[10px] font-medium">Click to upload photo</p>
                                                        </div>
                                                    )}
                                                    <label className="absolute inset-0 cursor-pointer">
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, true)} />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <Label htmlFor="memberName" className="text-xs font-bold text-stone-500 uppercase">Name</Label>
                                                    <Input id="memberName" value={memberData.name} onChange={e => setMemberData(prev => ({ ...prev, name: e.target.value }))} required className="h-9 bg-stone-50" />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor="memberRole" className="text-xs font-bold text-stone-500 uppercase">Role</Label>
                                                    <Input id="memberRole" value={memberData.role} onChange={e => setMemberData(prev => ({ ...prev, role: e.target.value }))} placeholder="CEO / Founder" required className="h-9 bg-stone-50" />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor="memberBio" className="text-xs font-bold text-stone-500 uppercase">Short Bio</Label>
                                                    <Textarea id="memberBio" value={memberData.bio} onChange={e => setMemberData(prev => ({ ...prev, bio: e.target.value }))} className="h-20 bg-stone-50 resize-none text-sm" />
                                                </div>
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                {editingId && (
                                                    <Button type="button" variant="ghost" className="flex-1 h-9" onClick={resetForm}>Cancel</Button>
                                                )}
                                                <Button type="submit" className="flex-1 bg-emerald-700 text-white hover:bg-emerald-800 h-9 font-bold text-xs uppercase tracking-wide" disabled={loading}>
                                                    {loading && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                                                    {editingId ? 'Update' : 'Add Leader'}
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Member List */}
                            <Card className="lg:col-span-2 shadow-sm border-stone-200 h-fit">
                                <CardHeader className="pb-3 border-b border-stone-100 flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg font-bold text-stone-800">Current Leadership</CardTitle>
                                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{team.length} Member</span>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-stone-100">
                                        {team.length === 0 ? (
                                            <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                                                <div className="h-16 w-16 bg-stone-100 rounded-full flex items-center justify-center mb-3">
                                                    <Users className="h-8 w-8 text-stone-300" />
                                                </div>
                                                <p className="text-stone-500 font-medium">No leadership data available.</p>
                                                <p className="text-xs text-stone-400 mt-1">Add a leader to showcase the team.</p>
                                            </div>
                                        ) : (
                                            team.map(member => (
                                                <div key={member.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-stone-50/80 transition-colors group">
                                                    <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-stone-100 flex-shrink-0">
                                                        {member.image_base64 ? (
                                                            <img src={member.image_base64} className="w-full h-full object-cover" alt={member.name} />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-stone-200">
                                                                <Users className="h-6 w-6 text-stone-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-stone-900 text-base">{member.name}</h4>
                                                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">{member.role}</p>
                                                        {member.bio && <p className="text-xs text-stone-500 mt-1 line-clamp-2">{member.bio}</p>}
                                                    </div>
                                                    <div className="flex gap-1 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 mt-3 sm:mt-0 border-stone-100">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg" onClick={() => handleEditMember(member)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg" onClick={() => handleDeleteMember(member.id!)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : activeView === 'manage' ? (
                        <Card className="flex-1 flex flex-col overflow-hidden max-h-full border-stone-200 shadow-sm">
                            <CardHeader className="flex-shrink-0 border-b border-stone-100 py-3">
                                <CardTitle className="text-lg font-bold text-stone-800">{editingId ? 'Edit Product' : 'Add New Product'}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-4 md:p-6 bg-white/50">
                                <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-8">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                        {/* Image Upload Column - Full width on mobile, 4 cols on desktop */}
                                        <div className="md:col-span-4 space-y-2">
                                            <Label className="text-xs font-bold text-stone-500 uppercase">Product Image</Label>
                                            <div className="border-2 border-dashed border-stone-200 rounded-xl p-4 aspect-square flex items-center justify-center relative bg-stone-50 hover:bg-emerald-50/30 hover:border-emerald-200 transition-colors group cursor-pointer">
                                                {preview ? (
                                                    <div className="relative w-full h-full flex items-center justify-center">
                                                        <img src={preview} alt="Preview" className="max-h-full max-w-full rounded-lg object-contain shadow-sm" />
                                                        <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-wide">Change Image</div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-stone-400">
                                                        <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                            <ImagePlus className="h-6 w-6 text-stone-300 group-hover:text-emerald-500" />
                                                        </div>
                                                        <p className="text-xs font-medium text-stone-500">Click to upload</p>
                                                        <p className="text-[10px] text-stone-400 mt-1">SVG, PNG, JPG</p>
                                                    </div>
                                                )}
                                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleImageChange(e)} required={!preview} />
                                            </div>
                                        </div>

                                        {/* Basic Info Column - 8 cols on desktop */}
                                        <div className="md:col-span-8 space-y-4">
                                            <div className="space-y-1">
                                                <Label htmlFor="name" className="text-xs font-bold text-stone-500 uppercase">Product Name</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={e => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                                                    placeholder="e.g. Organic Red Onions"
                                                    required
                                                    className="h-10 bg-white shadow-sm/50 border-stone-200 focus:border-emerald-500"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <Label htmlFor="category" className="text-xs font-bold text-stone-500 uppercase">Category</Label>
                                                    <div className="relative">
                                                        <Input
                                                            id="category"
                                                            list="categories"
                                                            value={formData.category}
                                                            onChange={e => setFormData((prev: any) => ({ ...prev, category: e.target.value }))}
                                                            placeholder="Select..."
                                                            required
                                                            className="h-10 bg-white shadow-sm/50 border-stone-200 focus:border-emerald-500"
                                                        />
                                                        <datalist id="categories">
                                                            {categories.map(c => <option key={c} value={c} />)}
                                                        </datalist>
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <Label htmlFor="price" className="text-xs font-bold text-stone-500 uppercase">Price (ETB)</Label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">ETB</span>
                                                        <Input
                                                            id="price"
                                                            type="number"
                                                            value={formData.price}
                                                            onChange={e => setFormData((prev: any) => ({ ...prev, price: parseFloat(e.target.value) }))}
                                                            placeholder="0.00"
                                                            required
                                                            className="h-10 pl-10 bg-white shadow-sm/50 border-stone-200 focus:border-emerald-500 font-mono"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1 pt-2">
                                                <Label className="text-xs font-bold text-stone-500 uppercase">Descriptions</Label>
                                                <div className="grid grid-cols-1 gap-3">
                                                    <Textarea
                                                        placeholder="English Description..."
                                                        value={formData.description}
                                                        onChange={e => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                                                        className="min-h-[80px] text-sm bg-white shadow-sm/50 border-stone-200 focus:border-emerald-500 resize-y"
                                                        required
                                                    />
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Textarea
                                                            placeholder="Amharic (Optional)..."
                                                            value={formData.description_am}
                                                            onChange={e => setFormData((prev: any) => ({ ...prev, description_am: e.target.value }))}
                                                            className="min-h-[60px] text-sm bg-white shadow-sm/50 border-stone-200"
                                                        />
                                                        <Textarea
                                                            placeholder="Oromo (Optional)..."
                                                            value={formData.description_om}
                                                            onChange={e => setFormData((prev: any) => ({ ...prev, description_om: e.target.value }))}
                                                            className="min-h-[60px] text-sm bg-white shadow-sm/50 border-stone-200"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 justify-end pt-6 border-t border-stone-100">
                                        <Button type="button" variant="outline" onClick={resetForm} className="h-10 px-6 border-stone-200 hover:bg-stone-50">
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={loading} className="h-10 px-8 bg-emerald-700 hover:bg-emerald-800 text-white font-bold tracking-wide shadow-md shadow-emerald-200">
                                            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                            {editingId ? 'Save Changes' : 'Create Product'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    ) : activeView === 'orders' ? (
                        <div className="space-y-6 pb-20">
                            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                                <h3 className="font-bold text-stone-800">Customer Orders</h3>
                                <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                    {orders.length} TOTAL ORDERS
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {orders.length === 0 ? (
                                    <div className="py-20 text-center bg-white rounded-2xl border border-stone-100 italic text-stone-400">
                                        No orders placed yet.
                                    </div>
                                ) : (
                                    orders.map(order => (
                                        <Card key={order._id} className="overflow-hidden border-stone-200 hover:border-emerald-200 transition-colors shadow-sm">
                                            <div className="bg-stone-50/50 p-4 border-b border-stone-100 flex flex-wrap justify-between items-center gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-emerald-600 text-white px-3 py-1 rounded-lg font-mono text-sm font-bold">
                                                        {order.orderId}
                                                    </div>
                                                    <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all cursor-pointer outline-none ${order.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                                            order.status === 'processing' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                                order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                                    'bg-stone-100 text-stone-500 border-stone-200'
                                                            }`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <CardContent className="p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                    <div className="space-y-4">
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Customer</p>
                                                            <p className="font-bold text-stone-900">{order.customer.fullName}</p>
                                                            <p className="text-sm text-stone-600">{order.customer.phone}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Delivery Address</p>
                                                            <p className="text-sm text-stone-800">{order.customer.address}, {order.customer.region}</p>
                                                        </div>
                                                        {order.customer.notes && (
                                                            <div className="space-y-1">
                                                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Notes</p>
                                                                <p className="text-xs text-stone-500 italic bg-stone-50 p-3 rounded-xl border border-stone-100">{order.customer.notes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-4">
                                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Items</p>
                                                        <div className="space-y-2 border-t border-stone-100 pt-4">
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="bg-stone-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-stone-500">{item.quantity}x</span>
                                                                        <span className="font-medium text-stone-700">{item.name}</span>
                                                                    </div>
                                                                    <span className="font-mono text-stone-400">{(item.price * item.quantity).toLocaleString()}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                                                            <span className="font-bold text-stone-900 uppercase tracking-widest text-xs">Total</span>
                                                            <span className="font-black text-emerald-700 text-lg">{order.total.toLocaleString()} ETB</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 flex flex-col h-full overflow-hidden">
                            {/* Search & Stats */}
                            <div className="flex flex-col sm:flex-row gap-3 items-center flex-shrink-0 bg-white p-3 rounded-xl border border-stone-200 shadow-sm">
                                <div className="relative flex-1 w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                    <Input
                                        placeholder="Search by name, category..."
                                        className="pl-9 h-10 bg-stone-50 border-transparent focus:bg-white focus:border-emerald-500 transition-all font-medium text-sm"
                                        value={searchQuery}
                                        onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    />
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                                    <div className="px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center gap-2 whitespace-nowrap">
                                        <Package className="h-4 w-4 text-emerald-600" />
                                        <span className="text-xs font-bold text-emerald-800">{products.length} Items</span>
                                    </div>
                                    <div className="px-3 py-2 bg-stone-50 rounded-lg border border-stone-100 flex items-center gap-2 whitespace-nowrap">
                                        <LayoutGrid className="h-4 w-4 text-stone-500" />
                                        <span className="text-xs font-bold text-stone-600">{totalPages} Pages</span>
                                    </div>
                                </div>
                            </div>

                            {/* Product List */}
                            <Card className="flex-1 overflow-hidden flex flex-col border-stone-200 shadow-sm bg-white/50 backdrop-blur-sm">
                                <CardContent className="p-0 flex-1 overflow-y-auto">
                                    {fetching ? (
                                        <div className="h-full flex flex-col items-center justify-center gap-4">
                                            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                                            <p className="text-sm font-medium text-stone-500">Loading inventory...</p>
                                        </div>
                                    ) : products.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                                            <div className="p-4 bg-stone-100 rounded-full mb-4">
                                                <Package className="h-10 w-10 text-stone-300" />
                                            </div>
                                            <h3 className="text-lg font-bold text-stone-800 mb-1">No products found</h3>
                                            <p className="text-sm text-stone-500 max-w-xs mx-auto mb-6">
                                                Try adjusting your search criteria or add new items to your inventory.
                                            </p>
                                            <Button onClick={() => setActiveView('manage')} variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                                <PlusCircle className="h-4 w-4 mr-2" />
                                                Add First Product
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-100">
                                            {paginatedProducts.map(product => (
                                                <div key={product.id} className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 hover:bg-white hover:shadow-md transition-all duration-200 group border-l-4 border-transparent hover:border-emerald-500">
                                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                                        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg overflow-hidden border border-stone-200 bg-white flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                                            {product.image_base64 ? (
                                                                <img src={product.image_base64} className="w-full h-full object-cover" alt={product.name} />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-stone-50">
                                                                    <ImagePlus className="h-6 w-6 text-stone-300" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0 sm:hidden">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="font-bold text-stone-800 truncate text-base">{product.name}</h4>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-500 border border-stone-200">
                                                                    {product.category}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 min-w-0 w-full pl-0 sm:pl-2">
                                                        <div className="hidden sm:block">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-bold text-stone-800 truncate text-base group-hover:text-emerald-800 transition-colors">{product.name}</h4>
                                                                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-500 border border-stone-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                                                                    {product.category}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-stone-500 truncate mt-0.5 pr-4">
                                                                {product.description || <span className="text-stone-300 italic">No description provided</span>}
                                                            </p>
                                                        </div>

                                                        <div className="sm:hidden mt-2 pt-2 border-t border-dashed border-stone-100 flex items-center justify-between w-full">
                                                            <p className="font-black text-stone-900 text-base">{product.price.toLocaleString()} <span className="text-[10px] font-bold text-stone-400">ETB</span></p>
                                                            <div className="flex gap-1">
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-emerald-50 hover:text-emerald-600" onClick={() => handleEdit(product)}>
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(product.id!)}>
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="hidden sm:flex items-center gap-6 pl-4 border-l border-stone-100 h-10">
                                                        <div className="text-right min-w-[80px]">
                                                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Price</p>
                                                            <p className="font-black text-stone-900 text-base">{product.price.toLocaleString()} <span className="text-[10px] text-stone-400">ETB</span></p>
                                                        </div>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 hover:scale-105 transition-all" onClick={() => handleEdit(product)}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-red-50 hover:text-red-600 hover:scale-105 transition-all" onClick={() => handleDelete(product.id!)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                                {/* Pagination Controls */}
                                <div className="p-3 bg-white border-t border-stone-200 flex items-center justify-between rounded-b-xl">
                                    <p className="text-xs font-medium text-stone-500">
                                        Page <span className="text-stone-900 font-bold">{currentPage}</span> of <span className="text-stone-900 font-bold">{Math.max(1, totalPages)}</span>
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="h-8 text-xs font-bold"
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages || totalPages === 0}
                                            className="h-8 text-xs font-bold"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}