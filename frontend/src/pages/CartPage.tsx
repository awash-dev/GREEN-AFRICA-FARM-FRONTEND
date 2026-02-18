import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { CheckoutPage } from "./CheckoutPage";

export function CartPage() {
    const { cart } = useCart();

    if (cart.length > 0) {
        return <CheckoutPage />;
    }

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
