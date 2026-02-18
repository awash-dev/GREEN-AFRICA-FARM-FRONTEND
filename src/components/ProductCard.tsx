import { Product } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart, clearCart } = useCart();
    const navigate = useNavigate();



    const handleBuyNow = () => {
        clearCart();
        addToCart(product);
        navigate('/checkout');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{
                opacity: 1,
                scale: 1,
                y: 0
            }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
                duration: 0.7,
                ease: [0.33, 1, 0.68, 1]
            }}
            className="h-full"
        >
            <motion.div
                onClick={handleBuyNow}
                whileHover={{
                    y: -4,
                    transition: { duration: 0.3 }
                }}
                className="h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer"
            >
                {/* Image Section */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-100">
                    <motion.img
                        src={product.image_base64 || "/photo_9_2026-02-18_22-40-51.jpg"}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* NEW Badge */}
                    <div className="absolute top-3 left-3">
                        <div className="px-2 py-0.5 bg-[#2ecc71] text-white text-[10px] font-bold uppercase tracking-tight rounded-sm">
                            NEW
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col p-3 space-y-2">
                    <div className="space-y-0.5">
                        <h3 className="text-[13px] font-bold text-stone-900 line-clamp-1 uppercase tracking-tight">
                            {product.name}
                        </h3>
                        <p className="text-[10px] text-stone-500 font-medium lowercase first-letter:uppercase">
                            {product.category || "General"}
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="text-[14px] font-bold text-[#e74c3c]">
                            ETB {product.price.toFixed(2)}
                        </span>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleBuyNow();
                            }}
                            className="bg-black text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#2E7D32] transition-colors shadow-sm flex items-center gap-1.5 active:scale-95"
                        >
                            <ShoppingCart className="h-3 w-3" />
                            BUY
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
