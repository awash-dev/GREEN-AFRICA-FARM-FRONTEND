import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-8 bg-[#FAF8F3]">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        y: [0, -15, 0]
                    }}
                    transition={{
                        scale: { duration: 0.5 },
                        opacity: { duration: 0.5 },
                        y: {
                            repeat: Infinity,
                            duration: 4,
                            ease: "easeInOut"
                        }
                    }}
                    className="p-12 rounded-full bg-[#F5F1E8] text-[#0F2E1C]/20"
                >
                    <ShoppingBag className="h-24 w-24" />
                </motion.div>
                <div className="text-center space-y-4">
                    <h2 className="font-serif text-3xl md:text-4xl text-[#0F2E1C]">Your cart is empty</h2>
                    <p className="text-[#6D4C41] max-w-xs mx-auto italic font-medium px-4">It seems our fields haven't reached your basket yet.</p>
                </div>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-3 px-10 py-4 bg-[#0F2E1C] text-white font-bold rounded-full hover:bg-[#2E7D32] transition-all shadow-xl hover:shadow-[#0F2E1C]/20 uppercase tracking-widest text-xs"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Browse Harvest
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF8F3] py-20 px-4 md:px-8">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 space-y-2"
                >
                    <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#0F2E1C]">Your Selection</h1>
                    <p className="text-[#6D4C41] font-medium italic opacity-70">Review your farm-fresh picks before harvest.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{
                                        opacity: 0,
                                        x: 100,
                                        scale: 0.9,
                                        transition: { duration: 0.3, ease: "easeIn" }
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                        ease: [0.25, 0.46, 0.45, 0.94]
                                    }}
                                    whileHover={{
                                        y: -4,
                                        transition: { type: "spring", stiffness: 300, damping: 20 }
                                    }}
                                    className="p-5 sm:p-6 md:p-8 rounded-4xl sm:rounded-[2.5rem] bg-[#F5F1E8] border border-stone-200/50 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center group hover:bg-white hover:shadow-xl transition-all duration-500"
                                >
                                    <motion.div
                                        className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-sm border border-stone-100 shrink-0"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img
                                            src={item.image_base64}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </motion.div>
                                    ....

                                    <div className="flex-1 space-y-2 text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <h3 className="font-serif text-2xl font-bold text-[#0F2E1C]">{item.name}</h3>
                                            <div className="font-serif text-2xl font-bold text-[#2E7D32]">
                                                {(item.price * item.quantity).toFixed(0)} <span className="text-[10px] font-sans font-bold text-[#6D4C41] uppercase align-middle ml-1">ETB</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[#6D4C41] font-medium opacity-60 line-clamp-1 italic">
                                            {item.category || "Premium Organic Harvest"}
                                        </p>

                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4">
                                            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full border border-stone-200/60 shadow-sm">
                                                <button
                                                    onClick={() => updateQuantity(item.id!.toString(), Math.max(1, item.quantity - 1))}
                                                    className="h-8 w-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 hover:border-emerald-200 text-stone-500 transition-colors"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-8 text-center font-bold text-stone-800">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id!.toString(), item.quantity + 1)}
                                                    className="h-8 w-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 hover:border-emerald-200 text-stone-500 transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id!.toString())}
                                                className="p-2 text-stone-300 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4 sticky top-32">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-10 rounded-[3rem] bg-[#0F2E1C] text-white shadow-2xl space-y-8"
                        >
                            <h2 className="font-serif text-3xl">Harvest Summary</h2>

                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-white/60">Total Items</span>
                                    <span>{totalItems}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-white/60">Delivery Fee</span>
                                    <span className="italic">Calculated at checkout</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                    <div className="flex flex-col">
                                        <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Total Value</span>
                                        <span className="font-serif text-4xl font-bold">{totalPrice.toFixed(0)}</span>
                                    </div>
                                    <span className="text-xl font-bold text-emerald-400">ETB</span>
                                </div>
                            </div>

                            <Button
                                onClick={() => navigate('/checkout')}
                                className="w-full py-8 bg-[#2E7D32] text-white font-bold rounded-full hover:bg-emerald-500 hover:scale-[1.02] transition-all shadow-xl uppercase tracking-[0.2em] text-xs h-auto"
                            >
                                Proceed to Checkout
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>

                            <p className="text-[10px] text-center text-white/40 font-bold uppercase tracking-widest">
                                Safe & Secure Checkout
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
