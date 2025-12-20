import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Product } from "@/services/api";
import { Leaf, Sprout } from "lucide-react";

interface ProductCardProps {
    product: Product;
    language: 'en' | 'am' | 'om';
}

export function ProductCard({ product, language }: ProductCardProps) {
    const description =
        language === 'am' ? (product.description_am || product.description) :
            language === 'om' ? (product.description_om || product.description) :
                product.description;

    return (
        <Card className="flex flex-col h-full overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            {/* Image Container */}
            <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50/50">
                {product.image_base64 ? (
                    <img
                        src={product.image_base64}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-green-800/20 gap-3">
                        <Leaf className="h-16 w-16 opacity-20" />
                        <span className="text-xs font-bold tracking-widest uppercase opacity-40">Fresh Produce</span>
                    </div>
                )}

                {/* Category Badge - Glassmorphism */}
                <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-[#1a3c18] text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full shadow-xl border border-white/50">
                        <Leaf className="h-3 w-3 text-green-600" />
                        {product.category || 'Farm Fresh'}
                    </span>
                </div>

                {/* Price Label - Glassmorphism Overlay */}
                <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-[#1a3c18]/90 backdrop-blur-md text-white px-4 py-2 rounded-xl shadow-2xl border border-white/10">
                        <span className="text-lg font-black">{product.price.toFixed(2)}</span>
                        <span className="text-[10px] ml-1 font-bold opacity-70">ETB</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col p-6 space-y-3">
                <div>
                    <CardTitle className="text-xl font-black text-[#1a3c18] line-clamp-1 group-hover:text-green-700 transition-colors leading-tight" title={product.name}>
                        {product.name}
                    </CardTitle>
                    <div className="h-1 w-8 bg-[#eec90d] mt-2 rounded-full group-hover:w-16 transition-all duration-500" />
                </div>

                <CardDescription className="line-clamp-2 text-sm text-slate-600/90 font-medium leading-relaxed italic">
                    {description}
                </CardDescription>

                <div className="pt-4 mt-auto flex items-end justify-between border-t border-[#2d5a27]/10">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#2d5a27] uppercase tracking-widest opacity-60">Price per {product.unit || 'unit'}</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-[#1a3c18]">{product.price.toFixed(2)}</span>
                            <span className="text-xs font-black text-[#2d5a27]">ETB</span>
                        </div>
                    </div>
                    {product.origin && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1a3c18]/50 uppercase tracking-tighter">
                            <Sprout className="h-3 w-3" />
                            {product.origin}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
