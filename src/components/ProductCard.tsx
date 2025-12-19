import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/services/api";
import { ShoppingCart, Heart, Eye, Package, Leaf } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
    product: Product;
    language: 'en' | 'am' | 'om';
}

export function ProductCard({ product, language }: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const isLowStock = product.stock <= 5;
    const isOutOfStock = product.stock === 0;

    const description =
        language === 'am' ? (product.description_am || product.description) :
            language === 'om' ? (product.description_om || product.description) :
                product.description;

    return (
        <Card className="overflow-hidden glass hover:shadow-2xl transition-all duration-500 group border-0 shadow-lg relative rounded-2xl">
            {/* Image Container */}
            <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-[#2d5a27]/10 to-[#eec90d]/5">
                {product.image_base64 ? (
                    <img
                        src={product.image_base64}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-[#2d5a27]/40 gap-3">
                        <Package className="h-16 w-16 stroke-[1.5px]" />
                        <span className="text-xs font-semibold tracking-wider uppercase">Fresh Harvest</span>
                    </div>
                )}

                {/* Overlay Actions - Premium Glass Look */}
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full h-12 w-12 bg-white/90 hover:bg-white text-[#2d5a27] shadow-xl hover:scale-110 transition-transform duration-300"
                    >
                        <Eye className="h-5 w-5" />
                    </Button>
                    <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full h-12 w-12 bg-white/90 hover:bg-white text-[#2d5a27] shadow-xl hover:scale-110 transition-transform duration-300"
                        onClick={() => setIsWishlisted(!isWishlisted)}
                    >
                        <Heart className={`h-5 w-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                </div>

                {/* Category Badge - Glass Style */}
                <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-md text-[#2d5a27] text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider border border-white/20">
                        <Leaf className="h-3 w-3" />
                        {product.category || 'Organic'}
                    </span>
                </div>

                {/* Stock Badge */}
                {isLowStock && !isOutOfStock && (
                    <div className="absolute top-4 right-4">
                        <span className="bg-[#eec90d] text-[#1a3c18] text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20 uppercase tracking-wider animate-pulse">
                            Only {product.stock} left
                        </span>
                    </div>
                )}

                {isOutOfStock && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[4px] flex items-center justify-center">
                        <span className="bg-red-600/90 text-white text-sm font-black px-6 py-2.5 rounded-full shadow-2xl tracking-widest uppercase border-2 border-white/30 rotate-[-12deg]">
                            Sold Out
                        </span>
                    </div>
                )}
            </div>

            {/* Content Header */}
            <CardHeader className="p-5 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg font-bold text-[#1a3c18] line-clamp-1 group-hover:text-[#2d5a27] transition-colors duration-300" title={product.name}>
                        {product.name}
                    </CardTitle>
                </div>
                <CardDescription className="line-clamp-2 text-sm mt-1.5 leading-relaxed text-muted-foreground/90 font-medium">
                    {description}
                </CardDescription>
            </CardHeader>

            {/* Price & Actions */}
            <CardFooter className="p-5 pt-2 flex flex-col gap-4">
                <div className="flex justify-between items-end w-full">
                    <div className="flex flex-col">
                        <span className="text-3xl font-black text-[#2d5a27] tracking-tight">
                            ${product.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest">Pricing per unit</span>
                    </div>

                    <div className="flex items-center gap-2 bg-[#2d5a27]/5 px-3 py-1.5 rounded-full border border-[#2d5a27]/10">
                        <div className={`h-2 w-2 rounded-full shadow-sm ${isOutOfStock ? 'bg-red-500' :
                            isLowStock ? 'bg-orange-500' :
                                'bg-[#2d5a27]'
                            }`} />
                        <span className="text-[10px] font-bold text-[#1a3c18] uppercase tracking-wider">
                            {product.stock} units
                        </span>
                    </div>
                </div>

                {/* Add to Cart Button - Premium Interaction */}
                <Button
                    className="w-full h-12 gap-3 bg-[#2d5a27] hover:bg-[#1a3c18] text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-[#2d5a27]/20 relative overflow-hidden group/btn"
                    disabled={isOutOfStock}
                >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    <ShoppingCart className="h-5 w-5 transition-transform group-hover/btn:scale-110" />
                    <span className="relative z-10 uppercase tracking-widest text-xs">Reserve Fresh</span>
                </Button>
            </CardFooter>
        </Card>
    );

}