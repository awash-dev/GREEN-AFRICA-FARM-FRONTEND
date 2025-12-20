import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/services/api";
import { Leaf } from "lucide-react";

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
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 shadow-md">
            {/* Image Container */}
            <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                {product.image_base64 ? (
                    <img
                        src={product.image_base64}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground gap-2">
                        <Leaf className="h-12 w-12 opacity-30 text-green-600" />
                        <span className="text-sm">No Image</span>
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
                        <Leaf className="h-3 w-3" />
                        {product.category || 'Organic'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-base font-semibold line-clamp-1 group-hover:text-green-600 transition-colors" title={product.name}>
                        {product.name}
                    </CardTitle>
                </div>
                <CardDescription className="line-clamp-2 text-sm mt-1 text-muted-foreground/80 font-normal">
                    {description}
                </CardDescription>
            </CardHeader>

            {/* Price */}
            <CardFooter className="p-4 pt-0">
                <div className="flex flex-col">
                    <span className="text-2xl font-bold text-green-600">
                        {product.price.toFixed(2)} ETB
                    </span>
                    <span className="text-xs text-muted-foreground">per unit</span>
                </div>
            </CardFooter>
        </Card>
    );
}
