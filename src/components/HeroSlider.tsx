import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Product } from '@/services/api';
import { cn } from '@/lib/utils';
import { ArrowRight } from "lucide-react";

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
        <section className={cn("relative h-[70vh] w-full overflow-hidden rounded-[2rem] group mb-16 shadow-2xl", className)}>
            <AnimatePresence initial={false}>
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className="absolute inset-0"
                >
                    {/* Organic Animated Image */}
                    <motion.div
                        initial={{ scale: 1.15 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 15, ease: "easeOut" }}
                        className="h-full w-full"
                    >
                        <img
                            src={products[current].image_base64 || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000"}
                            alt={products[current].name}
                            className="h-full w-full object-cover brightness-[0.9]"
                        />
                    </motion.div>

                    {/* Natural Cinematic Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F2E1C]/90 via-[#0F2E1C]/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2E1C]/40 via-transparent to-transparent" />

                    {/* Content Section with Premium Typography */}
                    <div className="absolute inset-0 flex items-end pb-24 md:pb-32">
                        <div className="container mx-auto px-8 md:px-20">
                            <div className="max-w-3xl space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="h-px w-8 bg-[#2E7D32]" />
                                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-[0.3em] backdrop-blur-sm">
                                        FRESH FROM THE FIELD
                                    </span>
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 1 }}
                                    className="font-serif text-6xl md:text-8xl text-white leading-[0.9] tracking-tight"
                                >
                                    {products[current].name}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 1 }}
                                    className="text-lg md:text-xl text-stone-200 font-medium max-w-xl line-clamp-2 italic opacity-90"
                                >
                                    {products[current].description || "Experience the pure essence of Ethiopian nature, delivered from our fields to your table."}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1, duration: 1 }}
                                    className="pt-4"
                                >
                                    <Link to="/products" className="inline-flex items-center gap-4 px-8 py-4 bg-[#2E7D32] text-white font-bold rounded-full hover:bg-[#0F2E1C] transition-all shadow-xl hover:shadow-[#0F2E1C]/20 text-sm uppercase tracking-widest">
                                        Shop This Harvest
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Natural Navigation Indicators */}
            <div className="absolute bottom-10 right-10 flex items-center gap-6 z-30">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                    {String(current + 1).padStart(2, '0')} <span className="mx-2">/</span> {String(products.length).padStart(2, '0')}
                </p>
                <div className="flex gap-2.5">
                    {products.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className="group py-4"
                        >
                            <div className={`h-[3px] transition-all duration-700 rounded-full shadow-sm ${i === current ? 'w-12 bg-white' : 'w-4 bg-white/30 group-hover:bg-white/50'
                                }`} />
                        </button>
                    ))}
                </div>
            </div>
        </section>

    );
}
