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
                        <Package className="h-12 w-12 opacity-30" />
                        <span className="text-sm">No Image</span>
                    </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full h-10 w-10 hover:scale-110 transition-transform"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full h-10 w-10 hover:scale-110 transition-transform"
                        onClick={() => setIsWishlisted(!isWishlisted)}
                    >
                        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
                        <Leaf className="h-3 w-3" />
                        {product.category || 'Organic'}
                    </span>
                </div>

                {/* Stock Badge */}
                {isLowStock && !isOutOfStock && (
                    <div className="absolute top-3 right-3">
                        <span className="bg-orange-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg animate-pulse">
                            Only {product.stock} left!
                        </span>
                    </div>
                )}

                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg">
                            Out of Stock
                        </span>
                    </div>
                )}
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

            {/* Price & Stock */}
            <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-green-600">
                            ${product.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground">per unit</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                        <div className={`h-2 w-2 rounded-full ${isOutOfStock ? 'bg-red-500' :
                            isLowStock ? 'bg-orange-500' :
                                'bg-green-500'
                            }`} />
                        <span className="text-muted-foreground">
                            {product.stock} in stock
                        </span>
                    </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                    className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-300 hover:gap-4"
                    disabled={isOutOfStock}
                >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}