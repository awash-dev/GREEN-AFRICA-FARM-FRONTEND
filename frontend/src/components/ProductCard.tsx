import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/services/api";
import { Leaf } from "lucide-react";

interface ProductCardProps {
    product: Product;
    language?: 'en' | 'am' | 'om';
}

export function ProductCard({ product, language = 'en' }: ProductCardProps) {
    const getDescription = () => {
        if (language === 'am') return product.description_am || product.description;
        if (language === 'om') return product.description_om || product.description;
        return product.description;
    };

    const description = getDescription();

    return (
        <Card className="group relative h-full flex flex-col overflow-hidden border-[#2d5a27]/10 bg-white/40 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(26,60,24,0.08)]">
            {/* Image Section */}
            <div className="relative aspect-[16/11] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent z-10" />

                {product.image_base64 ? (
                    <img
                        src={product.image_base64}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#f8faf8] to-[#f0f4f0] space-y-3">
                        <div className="p-4 rounded-full bg-emerald-50 text-emerald-600/30">
                            <Leaf className="h-12 w-12" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a3c18]/30">Fresh Harvest</span>
                    </div>
                )}

                {/* Glassmorphism Badge */}
                {product.category && (
                    <div className="absolute left-3 top-3 z-20">
                        <Badge className="border-white/20 bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1a3c18] backdrop-blur-md shadow-sm">
                            {product.category}
                        </Badge>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col p-5">
                <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                        <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-[#1a3c18] transition-colors group-hover:text-emerald-700">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600">
                            <Leaf className="h-3 w-3" />
                            <span>Locally Sourced</span>
                        </div>
                    </div>

                    <p className="line-clamp-2 text-xs leading-relaxed text-[#1a3c18]/60 font-medium">
                        {description || 'Premium farm-fresh harvest, directly from our grounds to your home with care and quality.'}
                    </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#2d5a27]/5">
                    <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a3c18]/30">Market Price</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-[#1a3c18]">{product.price.toFixed(2)}</span>
                            <span className="text-xs font-bold text-emerald-600">ETB</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative organic background element */}
            <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-emerald-500/5 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Card>
    );
}
