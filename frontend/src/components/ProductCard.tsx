import { Product } from "@/services/api";
import { ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
    product: Product;
    language?: 'en' | 'am' | 'om';
}

export function ProductCard({ product, language = 'en' }: ProductCardProps) {
    const { addToCart, clearCart } = useCart();
    const navigate = useNavigate();

    const getDescription = () => {
        if (language === 'am') return product.description_am || product.description;
        if (language === 'om') return product.description_om || product.description;
        return product.description;
    };

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
                whileHover={{
                    y: -8,
                    transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                    }
                }}
                whileTap={{
                    scale: 0.98,
                    y: 0
                }}
                className="h-full bg-white rounded-xl border border-stone-200/60 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#2E7D32]/20 transition-all duration-500 flex flex-col group touch-manipulation"
            >
                {/* Image Section */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-50">
                    <motion.img
                        src={product.image_base64}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />

                    {/* Organic Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="absolute top-3 left-3"
                    >
                        <div className="px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-[8px] font-bold uppercase tracking-wider text-[#2E7D32] shadow-md flex items-center gap-1">
                            <span className="h-1 w-1 bg-[#2E7D32] rounded-full" />
                            Organic
                        </div>
                    </motion.div>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col p-4 space-y-3">
                    <div className="space-y-1.5">
                        <p className="text-[8px] font-bold text-[#2E7D32] uppercase tracking-widest">
                            {product.category || "Fresh Harvest"}
                        </p>
                        <h3 className="font-serif text-lg sm:text-xl text-[#0F2E1C] leading-tight group-hover:text-[#2E7D32] transition-colors duration-300">
                            {product.name}
                        </h3>
                    </div>

                    {/* Description */}
                    {getDescription() && (
                        <p className="text-[11px] text-[#6D4C41] leading-relaxed opacity-60 line-clamp-2">
                            {getDescription()}
                        </p>
                    )}

                    {/* Price & Button */}
                    <div className="mt-auto pt-3 space-y-3 border-t border-stone-100">
                        <div className="flex items-baseline justify-between">
                            <div className="flex items-baseline gap-1">
                                <span className="font-serif text-2xl font-bold text-[#0F2E1C]">
                                    {product.price.toFixed(0)}
                                </span>
                                <span className="text-[9px] font-bold text-[#6D4C41] uppercase">
                                    ETB
                                </span>
                            </div>
                        </div>

                        {/* Buy Now Button */}
                        <motion.button
                            onClick={handleBuyNow}
                            whileTap={{ scale: 0.97 }}
                            className="w-full h-10 rounded-lg font-bold uppercase tracking-wider text-[9px] transition-all duration-400 flex items-center justify-center gap-2 bg-[#0F2E1C] text-white hover:bg-[#2E7D32] shadow-md hover:shadow-lg"
                        >
                            <div className="flex items-center gap-2">
                                <span>Order Now</span>
                                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                            </div>
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
