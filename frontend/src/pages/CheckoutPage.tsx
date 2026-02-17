import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, CheckCircle2, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

const ETHIOPIAN_REGIONS = [
    "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Dire Dawa",
    "Gambela", "Harari", "Oromia", "Sidama", "Somali", "South Ethiopia",
    "South West Ethiopia", "Tigray"
];

export function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        region: "",
        notes: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                customer: formData,
                items: cart.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                total: totalPrice,
                status: 'pending'
            };

            const response = await api.createOrder(orderData);
            if (response.success) {
                clearCart();
                navigate('/order-success', { state: { orderId: response.data.orderId } });
            }
        } catch (error) {
            console.error("Failed to place order", error);
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen bg-[#FAF8F3] py-20 px-4 md:px-8">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Form Section */}
                    <div className="lg:col-span-12 w-full lg:w-[60%] space-y-10">
                        <button
                            onClick={() => navigate('/cart')}
                            className="flex items-center gap-2 text-[#6D4C41] hover:text-[#2E7D32] font-bold text-xs uppercase tracking-widest transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Basket
                        </button>

                        <div className="space-y-2">
                            <h1 className="font-serif text-3xl md:text-5xl text-[#0F2E1C]">Harvest Delivery</h1>
                            <p className="text-[#6D4C41] font-medium italic opacity-70">Where should we bring your fresh bounty?</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8 bg-[#F5F1E8] p-10 rounded-[2.5rem] border border-stone-200/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0F2E1C]/60 ml-1">Full Name</label>
                                    <input
                                        required
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Abebe Kebede"
                                        className="w-full bg-white border-stone-200 rounded-2xl h-14 px-6 text-[#0F2E1C] placeholder:text-stone-300 focus:ring-2 focus:ring-[#2E7D32] transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0F2E1C]/60 ml-1">Phone Number</label>
                                    <input
                                        required
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="0911..."
                                        className="w-full bg-white border-stone-200 rounded-2xl h-14 px-6 text-[#0F2E1C] placeholder:text-stone-300 focus:ring-2 focus:ring-[#2E7D32] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0F2E1C]/60 ml-1">Street Address</label>
                                <input
                                    required
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Woreda, House No..."
                                    className="w-full bg-white border-stone-200 rounded-2xl h-14 px-6 text-[#0F2E1C] placeholder:text-stone-300 focus:ring-2 focus:ring-[#2E7D32] transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0F2E1C]/60 ml-1">Region in Ethiopia</label>
                                <select
                                    required
                                    name="region"
                                    value={formData.region}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border-stone-200 rounded-2xl h-14 px-6 text-[#0F2E1C] focus:ring-2 focus:ring-[#2E7D32] transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Select your region</option>
                                    {ETHIOPIAN_REGIONS.map(region => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0F2E1C]/60 ml-1">Special Harvest Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Any specific delivery instructions?"
                                    className="w-full bg-white border-stone-200 rounded-3xl p-6 text-[#0F2E1C] placeholder:text-stone-300 focus:ring-2 focus:ring-[#2E7D32] transition-all h-32 resize-none"
                                />
                            </div>

                            <div className="pt-6 border-t border-stone-200/50 space-y-4">
                                <div className="flex items-center gap-3 text-[#2E7D32]">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <span className="font-bold text-sm">Payment Method: Cash on Delivery</span>
                                </div>
                                <p className="text-xs text-[#6D4C41] opacity-70 italic font-medium">
                                    To ensure the freshest experience, we currently only accept cash payments upon arrival of your harvest.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-8 bg-[#0F2E1C] text-white font-bold rounded-full hover:bg-[#2E7D32] transition-all shadow-2xl shadow-[#0F2E1C]/10 h-auto uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3"
                            >
                                {loading ? "Placing your order..." : "Place Harvest Order"}
                                {!loading && <ChevronRight className="h-4 w-4" />}
                            </Button>
                        </form>
                    </div>

                    {/* Simple summary on side for desktop */}
                    <div className="hidden lg:block w-[40%] sticky top-32">
                        <div className="bg-[#0F2E1C] rounded-[3rem] p-10 text-white space-y-10 shadow-2xl">
                            <div className="flex items-center gap-3 text-emerald-400">
                                <Lock className="h-5 w-5" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Checkout</span>
                            </div>

                            <h2 className="font-serif text-3xl">Your Basket</h2>

                            <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="h-16 w-16 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                                            <img src={item.image_base64} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-sm tracking-tight line-clamp-1">{item.name}</div>
                                            <div className="text-[10px] text-white/60 font-medium">Qty: {item.quantity}</div>
                                        </div>
                                        <div className="font-serif text-lg font-bold">
                                            {(item.price * item.quantity).toFixed(0)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-white/10 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Total to Pay</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="font-serif text-4xl font-bold italic">{totalPrice.toFixed(0)}</span>
                                        <span className="text-xs font-bold text-emerald-400">ETB</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
