import { Product } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
                        src={product.image_base64}
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
                <div className="flex flex-col p-3 space-y-0.5">
                    <h3 className="text-sm font-bold text-stone-900 line-clamp-1 uppercase tracking-tight">
                        {product.name}
                    </h3>
                    <p className="text-[11px] text-stone-500 font-medium lowercase first-letter:uppercase">
                        {product.category || "General"}
                    </p>
                    <div className="pt-1">
                        <span className="text-sm font-bold text-[#e74c3c]">
                            ETB {product.price.toFixed(2)}
                        </span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
