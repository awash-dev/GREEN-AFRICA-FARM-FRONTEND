import { useState, useEffect } from 'react';
import { api, Product, ProductInput, TeamMember } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Activity,
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
    ShoppingBag,
    ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [langTab, setLangTab] = useState<'en' | 'am' | 'om'>('en');
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-screen bg-[#FAF8F3] flex flex-col font-sans overflow-hidden"
        >
            {loading && <FullScreenLoader />}
            {/* Simple Clean Header */}
            <header className="bg-white border-b border-stone-200 sticky top-0 z-50 flex-shrink-0">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between py-2 md:h-16 gap-3">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate('/')}
                                className="h-9 w-9 text-stone-400 hover:text-emerald-600 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                                    <Package className="h-5 w-5 text-white" />
                                </div>
                                <h1 className="font-bold text-stone-800 text-base tracking-tight">Farm Admin</h1>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    fetchProducts();
                                    fetchTeam();
                                    fetchOrders();
                                    fetchCategories();
                                }}
                                className="h-8 w-8 text-stone-400 hover:text-emerald-600 mr-2"
                            >
                                <Activity className="h-4 w-4" />
                            </Button>
                            {[
                                { id: 'inventory', label: 'Inventory', icon: LayoutGrid },
                                { id: 'manage', label: editingId ? 'Edit' : 'Add', icon: PlusCircle },
                                { id: 'team', label: 'Team', icon: Users },
                                { id: 'orders', label: 'Orders', icon: ShoppingBag }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveView(tab.id as AdminView); if (tab.id !== 'manage') setEditingId(null); }}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                        activeView === tab.id
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                            : "text-stone-500 hover:text-emerald-600 hover:bg-stone-50"
                                    )}
                                >
                                    <tab.icon className="h-3.5 w-3.5" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#FAF8F3]">
                <div id="main-content-wrapper" className="container mx-auto px-4 py-4 md:py-8 max-w-5xl h-full flex flex-col overflow-hidden">
                    <AnimatePresence mode="wait">
                        {notification && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`mb-6 p-4 rounded-2xl border-2 flex items-center gap-4 flex-shrink-0 shadow-xl backdrop-blur-md ${notification.type === 'success'
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800'
                                    : 'bg-red-500/10 border-red-500/20 text-red-800'
                                    }`}
                            >
                                <div className={cn("p-2 rounded-full", notification.type === 'success' ? "bg-emerald-500 text-white" : "bg-red-500 text-white")}>
                                    {notification.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                </div>
                                <p className="text-sm font-bold tracking-tight">{notification.message}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

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
                                                <div key={member.id} className="p-5 flex flex-col sm:flex-row items-center gap-5 hover:bg-emerald-500/5 transition-all duration-300 group relative overflow-hidden">
                                                    <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>

                                                    <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-white shadow-xl shadow-stone-200/50 bg-stone-100 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                        {member.image_base64 ? (
                                                            <img src={member.image_base64} className="w-full h-full object-cover" alt={member.name} />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-stone-200">
                                                                <Users className="h-8 w-8 text-stone-400" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 text-center sm:text-left min-w-0">
                                                        <div className="flex flex-col gap-1">
                                                            <h4 className="font-black text-stone-900 text-lg leading-tight uppercase tracking-tight">{member.name}</h4>
                                                            <span className="inline-flex w-fit mx-auto sm:mx-0 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-widest leading-none">
                                                                {member.role}
                                                            </span>
                                                        </div>
                                                        {member.bio && (
                                                            <p className="text-xs font-medium text-stone-500 mt-2.5 line-clamp-2 italic leading-relaxed">
                                                                "{member.bio}"
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-10 w-10 bg-white text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl shadow-sm border border-stone-100 active:scale-95 transition-all"
                                                            onClick={() => handleEditMember(member)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-10 w-10 bg-white text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl shadow-sm border border-stone-100 active:scale-95 transition-all"
                                                            onClick={() => handleDeleteMember(member.id!)}
                                                        >
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

                                        {/* Basic Info Column - Refined for Premium Feel */}
                                        <div className="md:col-span-8 space-y-5">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="name" className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Product Name</Label>
                                                <div className="relative group">
                                                    <Input
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={e => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                                                        placeholder="e.g. Organic Red Onions"
                                                        required
                                                        className="h-12 bg-white/70 border-stone-200/60 focus:bg-white focus:border-emerald-500 rounded-xl shadow-sm group-hover:border-emerald-200 transition-all font-bold px-4 placeholder:text-stone-300 placeholder:font-medium"
                                                    />
                                                </div>
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

                                            <div className="space-y-4 pt-2">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-xs font-bold text-stone-500 uppercase">Product Descriptions</Label>
                                                    <div className="flex gap-1 p-1 bg-stone-100 rounded-lg">
                                                        {(['en', 'am', 'om'] as const).map((lang) => (
                                                            <button
                                                                key={lang}
                                                                type="button"
                                                                onClick={() => setLangTab(lang)}
                                                                className={cn(
                                                                    "px-3 py-1 rounded-md text-[10px] font-bold transition-all uppercase",
                                                                    langTab === lang
                                                                        ? "bg-white text-emerald-700 shadow-sm"
                                                                        : "text-stone-400 hover:text-stone-600"
                                                                )}
                                                            >
                                                                {lang}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="relative">
                                                    <AnimatePresence mode="wait">
                                                        <motion.div
                                                            key={langTab}
                                                            initial={{ opacity: 0, x: 10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -10 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            {langTab === 'en' && (
                                                                <Textarea
                                                                    placeholder="Describe your organic harvest in English..."
                                                                    value={formData.description}
                                                                    onChange={e => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                                                                    className="min-h-[120px] text-sm bg-white border-stone-200 focus:border-emerald-500 resize-none rounded-xl"
                                                                    required
                                                                />
                                                            )}
                                                            {langTab === 'am' && (
                                                                <Textarea
                                                                    placeholder="የምርት መግለጫ በአማርኛ (አማራጭ)..."
                                                                    value={formData.description_am}
                                                                    onChange={e => setFormData((prev: any) => ({ ...prev, description_am: e.target.value }))}
                                                                    className="min-h-[120px] text-sm bg-white border-stone-200 focus:border-emerald-500 resize-none rounded-xl"
                                                                />
                                                            )}
                                                            {langTab === 'om' && (
                                                                <Textarea
                                                                    placeholder="Ibsa oomishaa Afaan Oromootiin (Filannoo)..."
                                                                    value={formData.description_om}
                                                                    onChange={e => setFormData((prev: any) => ({ ...prev, description_om: e.target.value }))}
                                                                    className="min-h-[120px] text-sm bg-white border-stone-200 focus:border-emerald-500 resize-none rounded-xl"
                                                                />
                                                            )}
                                                        </motion.div>
                                                    </AnimatePresence>
                                                    {/* Indicator for existing translations */}
                                                    <div className="flex gap-2 mt-2">
                                                        {formData.description && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="English added" />}
                                                        {formData.description_am && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Amharic added" />}
                                                        {formData.description_om && <span className="w-1.5 h-1.5 rounded-full bg-purple-500" title="Oromo added" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Premium Action Bar */}
                                    <div className="flex flex-col sm:flex-row gap-4 justify-end pt-8 border-t border-stone-100">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={resetForm}
                                            className="h-12 px-8 text-stone-500 font-bold hover:bg-stone-100 rounded-xl transition-all"
                                        >
                                            Discard Changes
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="h-12 px-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-xs shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_25px_-5px_rgba(16,185,129,0.4)] transition-all rounded-xl active:scale-[0.98]"
                                        >
                                            {loading && <Loader2 className="h-4 w-4 mr-3 animate-spin" />}
                                            {editingId ? 'Update Premium Item' : 'Publish to Store'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    ) : activeView === 'orders' ? (
                        <div className="flex-1 overflow-y-auto space-y-6 pb-20 no-scrollbar">
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
                                        <Card key={order._id} className="overflow-hidden border-stone-200/60 hover:border-emerald-500/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 group">
                                            {/* Order Header - Premium Toolbar */}
                                            <div className="bg-white p-4 border-b border-stone-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="absolute -inset-1 bg-emerald-500 rounded-lg blur opacity-20"></div>
                                                        <div className="relative bg-stone-900 text-white px-3 py-1.5 rounded-lg font-mono text-xs font-black tracking-tighter">
                                                            #{order.orderId.toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Ordered On</span>
                                                        <div className="text-xs font-bold text-stone-700">
                                                            {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                                    <div className="flex-1 sm:flex-initial relative">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                                            className={cn(
                                                                "w-full sm:w-auto text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border transition-all cursor-pointer outline-none appearance-none pr-8 shadow-sm",
                                                                order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                                    order.status === 'processing' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                                        order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                                            'bg-stone-50 text-stone-400 border-stone-200'
                                                            )}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 opacity-40 pointer-events-none" />
                                                    </div>
                                                </div>
                                            </div>

                                            <CardContent className="p-5 sm:p-6 bg-white/50 backdrop-blur-sm">
                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                                    {/* Customer & Shipping - 5 cols */}
                                                    <div className="lg:col-span-5 space-y-6">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <div className="w-1 h-3 bg-emerald-500 rounded-full"></div>
                                                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Customer Information</p>
                                                                </div>
                                                                <p className="font-black text-stone-900 text-lg leading-tight">{order.customer.fullName}</p>
                                                                <div className="flex items-center gap-2 text-stone-500">
                                                                    <div className="p-1 bg-stone-100 rounded">
                                                                        <Activity className="h-3 w-3" />
                                                                    </div>
                                                                    <p className="text-xs font-bold">{order.customer.phone}</p>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <div className="w-1 h-3 bg-stone-300 rounded-full"></div>
                                                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Delivery Point</p>
                                                                </div>
                                                                <p className="text-xs font-bold text-stone-800 leading-relaxed bg-stone-100/50 p-2.5 rounded-lg border border-stone-200/50">
                                                                    {order.customer.address}, {order.customer.region}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {order.customer.notes && (
                                                            <div className="space-y-2">
                                                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Special Requests</p>
                                                                <p className="text-xs text-stone-500 italic bg-amber-50/50 p-3 rounded-xl border border-amber-100 font-medium">
                                                                    "{order.customer.notes}"
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Order Items - 7 cols */}
                                                    <div className="lg:col-span-7 space-y-4">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className="w-1 h-3 bg-emerald-500 rounded-full"></div>
                                                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Cart Summary</p>
                                                        </div>

                                                        <div className="space-y-2 bg-white rounded-2xl border border-stone-100 p-2 shadow-sm">
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} className="flex justify-between items-center p-3 rounded-xl hover:bg-stone-50 transition-colors">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 font-black text-xs border border-emerald-100">
                                                                            {item.quantity}x
                                                                        </div>
                                                                        <span className="font-bold text-stone-800 text-sm">{item.name}</span>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <span className="font-black text-stone-900 text-sm">{(item.price * item.quantity).toLocaleString()}</span>
                                                                        <span className="text-[9px] font-bold text-stone-400 ml-1">ETB</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="flex justify-between items-center p-4 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200">
                                                            <span className="font-black text-white/70 uppercase tracking-widest text-xs">Final Amount</span>
                                                            <div className="text-right">
                                                                <span className="font-black text-white text-xl md:text-2xl">{order.total.toLocaleString()}</span>
                                                                <span className="text-xs font-bold text-white/70 ml-1">ETB</span>
                                                            </div>
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
                            {/* Simple Search */}
                            <div className="bg-white p-3 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center gap-3">
                                <div className="relative flex-1 w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                    <Input
                                        placeholder="Search products..."
                                        className="pl-9 h-10 border-stone-200 bg-stone-50 focus:bg-white transition-all rounded-lg"
                                        value={searchQuery}
                                        onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 text-xs font-bold whitespace-nowrap">
                                        {products.length} Products
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
                                                <div key={product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 hover:bg-white/80 transition-all duration-300 group border-b border-stone-100/60 last:border-0 relative">
                                                    <div className="flex items-center gap-4 w-full">
                                                        {/* Product Image */}
                                                        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden border-2 border-stone-100 bg-white flex-shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:shadow-emerald-100 group-hover:border-emerald-100 transition-all duration-300">
                                                            {product.image_base64 ? (
                                                                <img src={product.image_base64} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-stone-50">
                                                                    <Package className="h-8 w-8 text-stone-200" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                                                                <h4 className="font-black text-stone-800 text-lg md:text-xl truncate group-hover:text-emerald-700 transition-colors leading-tight">
                                                                    {product.name}
                                                                </h4>
                                                                <span className="inline-flex w-fit text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                                                                    {product.category}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs font-bold text-stone-400 mt-1.5 line-clamp-1 md:line-clamp-2 md:pr-10 leading-relaxed">
                                                                {product.description || <span className="italic opacity-50 font-normal">No description provided</span>}
                                                            </p>

                                                            <div className="flex items-center justify-between mt-3 sm:mt-4">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Premium Price</span>
                                                                    <p className="font-black text-stone-900 text-xl md:text-2xl mt-0.5">
                                                                        {product.price.toLocaleString()}
                                                                        <span className="text-xs font-bold text-emerald-600 ml-1">ETB</span>
                                                                    </p>
                                                                </div>

                                                                {/* Desktop Actions */}
                                                                <div className="hidden sm:flex items-center gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-10 w-10 rounded-xl bg-stone-50 text-stone-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                                        onClick={() => handleEdit(product)}
                                                                    >
                                                                        <Pencil className="h-4.5 w-4.5" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-10 w-10 rounded-xl bg-stone-50 text-stone-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                                        onClick={() => handleDelete(product.id!)}
                                                                    >
                                                                        <Trash2 className="h-4.5 w-4.5" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Mobile Only Floating Actions */}
                                                    <div className="sm:hidden absolute top-4 right-4 flex gap-1.5">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-stone-100 text-emerald-600 active:scale-95"
                                                            onClick={() => handleEdit(product)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-stone-100 text-red-600 active:scale-95"
                                                            onClick={() => handleDelete(product.id!)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}                                        </div>
                                    )}
                                </CardContent>
                                {/* Pagination Controls */}
                                <div className="p-4 bg-stone-50/50 border-t border-stone-200 flex items-center justify-between rounded-b-2xl">
                                    <p className="text-xs font-black text-stone-400 uppercase tracking-widest">
                                        Page <span className="text-stone-900">{currentPage}</span> / <span className="text-stone-900">{Math.max(1, totalPages)}</span>
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="h-9 px-4 rounded-xl border-stone-200 text-xs font-bold hover:bg-white hover:text-emerald-700 transition-all"
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages || totalPages === 0}
                                            className="h-9 px-4 rounded-xl border-stone-200 text-xs font-bold hover:bg-white hover:text-emerald-700 transition-all"
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
        </motion.div>
    );
}
