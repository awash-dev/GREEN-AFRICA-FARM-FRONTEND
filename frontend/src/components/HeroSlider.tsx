import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/services/api';
import { cn } from '@/lib/utils';

interface HeroSliderProps {
    products: Product[];
    loading?: boolean;
    className?: string;
}

export function HeroSlider({ products, loading, className }: HeroSliderProps) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (products.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % products.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [products.length]);

    if (loading || products.length === 0) {
        return (
            <div className={cn("relative h-[60vh] w-full overflow-hidden rounded-3xl bg-stone-100 flex items-center justify-center", className)}>
                <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    className="text-stone-400 font-bold uppercase tracking-widest text-sm"
                >
                    Preparing Your Farm Experience...
                </motion.div>
            </div>
        );
    }

    return (
        <section className={cn("relative h-[60vh] w-full overflow-hidden rounded-lg group mb-12 shadow-2xl", className)}>
            <AnimatePresence initial={false}>
                <motion.div
                    key={current}
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    {/* High-Resolution Animated Image Wrapper */}
                    <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.1 }}
                        transition={{ duration: 10, ease: "linear" }}
                        className="h-full w-full"
                    >
                        <img
                            src={products[current].image_base64 || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000"}
                            alt={products[current].name}
                            className="h-full w-full object-cover brightness-[0.85] contrast-[1.1]"
                            style={{ imageRendering: 'high-quality' as any }}
                        />
                    </motion.div>

                    {/* Multi-layered Cinematic Overlays */}
                    <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/70" />
                    <div className="absolute inset-0 bg-linear-to-r from-black/70 via-transparent to-transparent" />

                    {/* Film Grain Quality Mask */}
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3")` }}
                    />

                    {/* Content Section with Motion Typography */}
                    <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto px-8 md:px-16">
                            <div className="max-w-2xl space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md"
                                >
                                    Farm-Fresh Category
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                    className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight"
                                >
                                    {products[current].name}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.8 }}
                                    className="text-xl md:text-2xl text-stone-200 font-medium max-w-lg line-clamp-2 drop-shadow-md"
                                >
                                    {products[current].description}
                                </motion.p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Premium Navigation Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-30">
                {products.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className="relative group p-2"
                    >
                        <div className={`h-1.5 transition-all duration-500 rounded-full bg-white/30 group-hover:bg-white/50 ${i === current ? 'w-10 bg-emerald-400' : 'w-4'
                            }`} />
                    </button>
                ))}
            </div>
        </section>
    );
}
