
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Leaf, ShieldCheck, Zap, Globe, Heart, ArrowRight, ArrowUp } from 'lucide-react';
import { api, Product } from '@/services/api';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import { ProductCard } from '@/components/ProductCard';

export function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const { scrollYProgress } = useScroll();
    const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const barOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

    const heroY = useTransform(scrollYProgress, [0, 0.4], [0, 120]);
    const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.15]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.getAllProducts({ limit: 4 }),
                    api.getCategories()
                ]);

                if (productsRes.success) setProducts(productsRes.data);
                if (categoriesRes.success) setCategories(categoriesRes.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();

        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="flex flex-col bg-[#FAF8F3] overflow-x-hidden">
            <AnimatePresence>
                {loading && <FullScreenLoader key="loader" />}
            </AnimatePresence>
            {/* Scroll Progress Bar (Premium Mobile Detail) */}
            <motion.div
                style={{ width: progressWidth, opacity: barOpacity }}
                className="fixed top-0 left-0 h-1 bg-[#2E7D32] z-[100] origin-left"
            />

            {/* Hero Section - Static with Overlay */}
            <section className="relative w-full h-[calc(100vh-90px)] overflow-hidden">
                {/* Background Image with Parallax */}
                <motion.div
                    style={{ y: heroY, scale: heroScale }}
                    className="absolute inset-0 will-change-transform"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: loading ? 0 : 1 }}
                    transition={{ duration: 1 }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000"
                        alt="Organic Farm"
                        className="w-full h-full object-cover shadow-inner"
                    />
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                </motion.div>

                {/* Content Container */}
                <div className="relative h-full container mx-auto px-4 md:px-6 max-w-7xl">
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            animate={!loading ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-6 md:space-y-8 text-white z-10"
                        >
                            {/* Label */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={!loading ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mt-4 md:mt-8"
                            >
                                <Leaf className="h-4 w-4 text-[#F4D03F]" />
                                <span className="text-xs font-bold uppercase tracking-widest">100% Organic & Natural</span>
                            </motion.div>

                            {/* Main Heading with Word Animation */}
                            <div className="space-y-3 md:space-y-4">
                                <motion.h1 className="font-serif text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[45px] leading-[1.1] drop-shadow-md">
                                    <div className="flex flex-wrap">
                                        {["Premium", "Organic", "Produce"].map((word, i) => (
                                            <div key={i} className="overflow-hidden mr-3 pb-1">
                                                <motion.span
                                                    initial={{ y: "150%" }}
                                                    animate={!loading ? { y: 0 } : {}}
                                                    transition={{
                                                        delay: 0.5 + i * 0.1,
                                                        duration: 0.8,
                                                        ease: [0.33, 1, 0.68, 1]
                                                    }}
                                                    className="inline-block will-change-transform translate-z-0"
                                                >
                                                    {word}
                                                </motion.span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="overflow-hidden">
                                        <motion.span
                                            initial={{ y: "150%" }}
                                            animate={!loading ? { y: 0 } : {}}
                                            transition={{
                                                delay: 0.9,
                                                duration: 1,
                                                ease: [0.33, 1, 0.68, 1]
                                            }}
                                            className="text-[#F4D03F] inline-block will-change-transform translate-z-0"
                                        >
                                            From Ethiopian Highlands
                                        </motion.span>
                                    </div>
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={!loading ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
                                    className="text-sm md:text-base lg:text-sm text-white/90 leading-relaxed max-w-xl"
                                >
                                    Fresh, chemical-free bounty grown in the fertile volcanic soils of Ethiopia. Directly from our local farms to your kitchen.
                                </motion.p>
                            </div>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={!loading ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 1.3, duration: 0.6 }}
                                className="flex flex-wrap gap-3 md:gap-4"
                            >
                                <Link
                                    to="/products"
                                    className="group px-6 md:px-8 py-3 md:py-4 bg-[#F4D03F] text-[#0F2E1C] font-bold rounded-lg hover:bg-[#f4d03f]/90 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 text-sm md:text-base"
                                >
                                    <span>Shop Now</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/about"
                                    className="px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-lg hover:bg-white/20 transition-all border border-white/30 flex items-center gap-2 text-sm md:text-base"
                                >
                                    <span>Our Story</span>
                                </Link>
                            </motion.div>

                            {/* Trust Badges */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={!loading ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 1.5, duration: 0.6 }}
                                className="flex flex-wrap gap-4 md:gap-6 pt-2 md:pt-4"
                            >
                                {[
                                    { icon: ShieldCheck, text: "Certified" },
                                    { icon: Zap, text: "24h Delivery" },
                                    { icon: Globe, text: "Eco-Friendly" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-1.5 md:gap-2 text-white/80">
                                        <item.icon className="h-4 w-4 md:h-5 md:w-5 text-[#F4D03F]" />
                                        <span className="text-[10px] md:text-sm font-medium">{item.text}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>


                        {/* Right - Floating Farmer Image (Desktop Only) */}
                        <motion.div
                            initial={{ opacity: 0, x: 60, scale: 0.9 }}
                            animate={!loading ? { opacity: 1, x: 0, scale: 1 } : {}}
                            transition={{ duration: 1, delay: 0.6, type: "spring" }}
                            className="hidden lg:flex justify-center items-center relative"
                        >
                            <div className="relative">
                                {/* Decorative Circle */}
                                <motion.div
                                    animate={!loading ? { rotate: 360 } : {}}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 -z-10"
                                >
                                    <div className="w-full h-full rounded-full border-2 border-dashed border-[#F4D03F]/30" />
                                </motion.div>

                                {/* Farmer Image */}
                                <motion.div
                                    animate={!loading ? { y: [0, -20, 0] } : {}}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative w-72 h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-8 border-white/20 shadow-2xl"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=800"
                                        alt="Happy Farmer"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>

                                {/* Badge */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={!loading ? { scale: 1 } : {}}
                                    transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                                    className="absolute bottom-0 -right-2 lg:-bottom-4 lg:-right-4 bg-[#F4D03F] rounded-full p-4 lg:p-6 shadow-2xl"
                                >
                                    <div className="text-center">
                                        <div className="text-2xl lg:text-3xl font-black text-[#0F2E1C]">10+</div>
                                        <div className="text-[8px] lg:text-[9px] font-bold uppercase tracking-wider text-[#0F2E1C]/70">Years</div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.8 }}
                    className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-white/60"
                >
                    <span className="text-[10px] uppercase tracking-widest font-bold">Explore</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5"
                    >
                        <motion.div className="w-1 h-1.5 bg-white/60 rounded-full" />
                    </motion.div>
                </motion.div>
            </section >

            {/* Features/USP Bar - Warm Beige */}
            <section className="relative w-full py-10 md:py-16 bg-[#F5F1E8] z-20">
                <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: ShieldCheck, title: "100% Organic", desc: "Ethiopian Highland Certified" },
                            { icon: Zap, title: "Farm to Table", desc: "Local harvest delivered fast" },
                            { icon: Globe, title: "Eco-Friendly", desc: "Protecting our rich biodiversity" },
                            { icon: Heart, title: "Local Impact", desc: "Supporting our farming communities" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, amount: 0.05 }}
                                transition={{
                                    delay: i * 0.1,
                                    duration: 0.8,
                                    ease: [0.33, 1, 0.68, 1]
                                }}
                                whileHover={{
                                    y: -8,
                                    transition: { duration: 0.3 }
                                }}
                                className="flex items-center gap-4 p-6 md:p-8 rounded-3xl bg-white border border-stone-200/50 hover:shadow-2xl hover:shadow-[#0F2E1C]/10 transition-shadow duration-300 group will-change-transform translate-z-0"
                            >
                                <div className="p-3 md:p-4 rounded-2xl bg-[#E8F0E6] text-[#2E7D32] shadow-sm group-hover:bg-[#2E7D32] group-hover:text-white transition-colors duration-500 shrink-0">
                                    <item.icon className="h-5 w-5 md:h-6 md:w-6" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-sm md:text-base text-[#0F2E1C] tracking-tight truncate">
                                        {item.title}
                                    </h3>
                                    <p className="text-[10px] md:text-xs text-[#6D4C41] font-medium uppercase tracking-wider mt-0.5 line-clamp-1 opacity-70">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* About Our Farm Section - White */}
            < section className="w-full py-12 md:py-24 bg-white overflow-hidden" >
                <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
                        {/* Images */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="relative order-1 lg:order-1"
                        >
                            <div className="grid grid-cols-2 gap-4 md:gap-6">
                                <motion.div
                                    initial={{ clipPath: "inset(0 100% 0 0)" }}
                                    whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
                                    className="rounded-4xl md:rounded-[3rem] overflow-hidden shadow-xl h-64 md:h-80"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800"
                                        alt="Farm field"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                                <motion.div
                                    initial={{ clipPath: "inset(100% 0 0 0)" }}
                                    whileInView={{ clipPath: "inset(0% 0 0 0)" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.2, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
                                    className="rounded-4xl md:rounded-[3rem] overflow-hidden shadow-xl h-64 md:h-80 mt-8 md:mt-12"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800"
                                        alt="Farmer working"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                className="absolute -bottom-6 -right-6 bg-[#F4D03F] rounded-full p-6 md:p-8 shadow-2xl"
                            >
                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-black text-[#0F2E1C]">10+</div>
                                    <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-[#0F2E1C]/70">Years</div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="space-y-6 md:space-y-8 order-2 lg:order-2"
                        >
                            <div className="space-y-4">
                                <motion.span
                                    initial={{ opacity: 0, letterSpacing: "0.5em" }}
                                    whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
                                    transition={{ duration: 0.8 }}
                                    className="text-[#F4D03F] text-[10px] font-black uppercase tracking-[0.3em]"
                                >
                                    ● About Our Farm
                                </motion.span>
                                <motion.h2 className="font-serif text-2xl md:text-4xl lg:text-5xl text-[#0F2E1C] leading-tight">
                                    <div className="flex flex-wrap">
                                        {["From", "the", "cradle", "of", "humanity,", "we", "bring", "the", "purest", "harvest"].map((word, i) => (
                                            <div key={i} className="overflow-hidden mr-2 pb-1">
                                                <motion.span
                                                    initial={{ y: "120%" }}
                                                    whileInView={{ y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        delay: 0.05 * i,
                                                        duration: 0.6,
                                                        ease: [0.33, 1, 0.68, 1]
                                                    }}
                                                    className="inline-block"
                                                >
                                                    {word}
                                                </motion.span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 0.9, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                    className="text-sm md:text-base text-[#6D4C41] leading-relaxed"
                                >
                                    Ethiopia has a rich tradition of organic farming that spans centuries. We combine this ancestral wisdom with modern sustainable practices to protect our soil and biodiversity.
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 0.9, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="text-sm md:text-base text-[#6D4C41] leading-relaxed"
                                >
                                    Our commitment is to restore the land while providing the most nutrient-dense produce to our local communities.
                                </motion.p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {[
                                    { icon: "💎", title: "Sustainable Farming", desc: "Practices" },
                                    { icon: "🍃", title: "Pure, Chemical Free", desc: "Produce" },
                                    { icon: "🎯", title: "Passion for Honest", desc: "Agriculture" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                                        className="p-6 rounded-2xl bg-[#F5F1E8] text-center space-y-2"
                                    >
                                        <div className="text-3xl">{item.icon}</div>
                                        <h4 className="font-bold text-sm text-[#0F2E1C]">{item.title}</h4>
                                        <p className="text-xs text-[#6D4C41] opacity-70">{item.desc}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="pt-2 md:pt-4">
                                <Link
                                    to="/about"
                                    className="inline-flex items-center gap-2 px-8 py-3 md:py-4 bg-[#F4D03F] text-[#0F2E1C] font-bold rounded-full hover:bg-[#f4d03f]/90 transition-all shadow-lg text-sm md:text-base"
                                >
                                    More About Us
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* Shop by Category Section */}
            < section className="w-full py-12 md:py-20 bg-white" >
                <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="space-y-4">
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="text-[#2E7D32] text-[10px] font-black uppercase tracking-[0.4em]"
                            >
                                ● Shop by Category
                            </motion.span>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="font-serif text-3xl md:text-5xl text-[#0F2E1C]"
                            >
                                What are you <span className="italic text-[#2E7D32]">looking for?</span>
                            </motion.h2>
                        </div>
                        <Link
                            to="/products"
                            className="text-sm font-bold text-[#0F2E1C] hover:text-[#2E7D32] transition-colors flex items-center gap-2 group"
                        >
                            View All Harvest
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={cat}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Link
                                    to={`/products?category=${cat}`}
                                    className="group relative h-40 md:h-56 rounded-3xl overflow-hidden bg-[#F5F1E8] flex flex-col items-center justify-center gap-4 transition-all hover:bg-[#E8F0E6] border border-stone-100/50 hover:border-[#2E7D32]/20 shadow-sm hover:shadow-xl"
                                >
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center text-3xl md:text-4xl shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                        {cat === "Vegetables" ? "🥬" : cat === "Fruits" ? "🍎" : cat === "Grains" ? "🌾" : cat === "Livestock" ? "🐄" : "🌿"}
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-bold text-base md:text-xl text-[#0F2E1C]">{cat}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#6D4C41]/60 mt-1">Explore</p>
                                    </div>

                                    {/* Decorative background element */}
                                    <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                        <Leaf className="w-24 h-24 md:w-32 md:h-32 text-[#0F2E1C]" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Our Products Section - Soft Green */}
            < section className="w-full py-12 md:py-24 bg-[#E8F0E6]/40 text-center" >
                <div className="container mx-auto px-2 md:px-6 max-w-[1440px]">
                    <div className="space-y-12 md:space-y-16">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.8,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                            viewport={{ once: true, amount: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col items-center gap-4">
                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    whileInView={{ width: 80, opacity: 1 }}
                                    transition={{ duration: 1, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
                                    viewport={{ once: true }}
                                    className="h-1 bg-[#2E7D32] rounded-full"
                                />
                                <div className="overflow-hidden py-2">
                                    <motion.h2
                                        initial={{ y: "100%" }}
                                        whileInView={{ y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
                                        viewport={{ once: true }}
                                        className="font-serif text-4xl md:text-6xl lg:text-7xl text-[#0F2E1C] tracking-tight"
                                    >
                                        Our Harvest
                                    </motion.h2>
                                </div>
                                <motion.p
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                    viewport={{ once: true }}
                                    className="font-sans text-sm md:text-lg text-[#6D4C41] font-medium max-w-2xl mx-auto italic px-4 leading-relaxed"
                                >
                                    "Nature's finest seasonal produce, grown with respect for the land and delivered fresh to your table."
                                </motion.p>
                            </div>
                        </motion.div>

                        {products.length === 0 ? (
                            <div className="py-20 text-stone-400 font-bold font-serif italic text-xl">
                                The fields are resting. Check back soon for the next harvest.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] md:gap-4">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="pt-8"
                        >
                            <Link
                                to="/products"
                                className="group inline-flex items-center gap-3 px-10 md:px-12 py-4 md:py-5 bg-[#0F2E1C] text-white font-bold rounded-full hover:bg-[#2E7D32] transition-all shadow-2xl hover:shadow-[#0F2E1C]/20 uppercase tracking-widest text-xs"
                            >
                                Explore Full Catalog
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* Why Choose Us Section - Warm Beige */}
            < section className="w-full py-16 md:py-24 bg-[#F5F1E8]" >
                <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="space-y-6 md:space-y-8"
                        >
                            <div className="space-y-4">
                                <motion.span
                                    initial={{ opacity: 0, letterSpacing: "0.5em" }}
                                    whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
                                    transition={{ duration: 0.8 }}
                                    className="text-[#F4D03F] text-[10px] font-black uppercase tracking-[0.3em]"
                                >
                                    ● Why Choose Us
                                </motion.span>
                                <motion.h2 className="font-serif text-2xl md:text-4xl lg:text-5xl text-[#0F2E1C] leading-tight">
                                    <div className="flex flex-wrap">
                                        {["Nourishing", "Ethiopia", "through", "honest", "and", "clean", "conscious", "farming"].map((word, i) => (
                                            <div key={i} className="overflow-hidden mr-2">
                                                <motion.span
                                                    initial={{ y: "150%" }}
                                                    whileInView={{ y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        delay: 0.04 * i,
                                                        duration: 0.8,
                                                        ease: [0.33, 1, 0.68, 1]
                                                    }}
                                                    className="inline-block"
                                                >
                                                    {word}
                                                </motion.span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 0.8 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-sm md:text-base text-[#6D4C41] leading-relaxed opacity-80"
                                >
                                    We believe in delivering food that's grown with integrity, respecting the unique agricultural heritage of our Ethiopian highlands. Every harvest is a testament to our land.
                                </motion.p>
                            </div>

                            {/* Tabs */}
                            <div className="space-y-6">
                                {[
                                    {
                                        title: "Organic Farming",
                                        subtitle: "Natural Soil Enrichment",
                                        desc: "Organic farming enhances soil health using compost, crop rotation, and biological nutrients, ensuring long-term fertility without synthetic chemicals.",
                                        icon: "🌾"
                                    },
                                    {
                                        title: "Fresh Produce",
                                        subtitle: "Harvested Daily",
                                        desc: "We harvest our crops at peak freshness every morning, ensuring maximum nutrition and flavor in every bite.",
                                        icon: "🥬"
                                    },
                                    {
                                        title: "Delivery & Supply",
                                        subtitle: "Farm to Table in 24h",
                                        desc: "Our efficient supply chain ensures your produce arrives within 24 hours of harvest, maintaining optimal freshness.",
                                        icon: "🚚"
                                    }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: i * 0.1,
                                            duration: 0.8,
                                            ease: [0.33, 1, 0.68, 1]
                                        }}
                                        className="p-6 rounded-2xl bg-white border border-stone-200/50 hover:shadow-xl transition-all duration-300 group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <motion.div
                                                whileHover={{ rotate: 15 }}
                                                className="text-3xl shrink-0"
                                            >
                                                {item.icon}
                                            </motion.div>
                                            <div className="space-y-2">
                                                <h4 className="font-bold text-base md:text-lg text-[#0F2E1C] group-hover:text-[#2E7D32] transition-colors">{item.title}</h4>
                                                <p className="text-xs font-bold text-[#F4D03F] uppercase tracking-wider">{item.subtitle}</p>
                                                <p className="text-sm text-[#6D4C41] leading-relaxed opacity-80">{item.desc}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Images */}
                        <motion.div
                            initial={{ opacity: 0, x: 40, scale: 0.9 }}
                            whileInView={{ opacity: 1, x: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
                            className="relative lg:sticky lg:top-32"
                        >
                            <div className="space-y-6">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="rounded-4xl md:rounded-[3rem] overflow-hidden shadow-2xl"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=1000"
                                        alt="Farmer with produce"
                                        className="w-full h-96 md:h-[500px] object-cover"
                                    />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-center gap-4 p-6 rounded-2xl bg-[#F4D03F] shadow-xl"
                                >
                                    <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                                        <ShieldCheck className="h-8 w-8 text-[#0F2E1C]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-[#0F2E1C]">Transparent & Traceable Produce</h4>
                                        <p className="text-sm text-[#0F2E1C]/70">Know exactly where your food comes from</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* Seed to Soul Section - White */}
            < section className="w-full py-16 md:py-24 bg-white" >
                <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                    <div className="bg-white/60 backdrop-blur-sm rounded-[3rem] md:rounded-[4rem] border border-stone-200/40 p-8 md:p-16 lg:p-20">
                        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
                            <div className="text-center space-y-4">
                                <span className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.4em]">OUR ETHIOPIAN PHILOSOPHY</span>
                                <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#0F2E1C]">
                                    Seed to <span className="italic">Soul</span>
                                </h2>
                                <p className="text-sm md:text-base text-[#6D4C41] font-medium max-w-lg mx-auto italic opacity-70">
                                    A slow, organic journey from the rich volcanic soil of Ethiopia to your heart and home.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                {[
                                    {
                                        step: "01",
                                        icon: "🌱",
                                        title: "Mindful Sowing",
                                        desc: "Selecting heritage seeds that honor the local ecosystem."
                                    },
                                    {
                                        step: "02",
                                        icon: "☀️",
                                        title: "Natural Growth",
                                        desc: "Nurtured by volcanic soil, pure rain, and African sun."
                                    },
                                    {
                                        step: "03",
                                        icon: "🧤",
                                        title: "Gentle Harvest",
                                        desc: "Hand-picked at peak ripeness to ensure maximum vitality."
                                    },
                                    {
                                        step: "04",
                                        icon: "🧺",
                                        title: "Direct Delivery",
                                        desc: "From farm to table in 24 hours, preserving the harvest soul."
                                    }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        whileHover={{
                                            y: -8,
                                            transition: { type: "spring", stiffness: 300, damping: 20 }
                                        }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{
                                            delay: i * 0.12,
                                            duration: 0.7,
                                            ease: [0.25, 0.46, 0.45, 0.94]
                                        }}
                                        className="p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-white border border-stone-100 shadow-lg hover:shadow-2xl hover:shadow-[#0F2E1C]/5 transition-all duration-500 text-center space-y-5 md:space-y-6"
                                    >
                                        <div className="relative inline-block">
                                            <div className="text-4xl md:text-5xl mb-2">{item.icon}</div>
                                            <span className="absolute -top-2 -right-6 text-[10px] font-black text-[#6D4C41]/20 font-sans tracking-widest">{item.step}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-serif text-lg md:text-xl font-bold text-[#0F2E1C] group-hover:text-[#2E7D32] transition-colors">{item.title}</h3>
                                            <p className="font-sans text-xs text-[#6D4C41] leading-relaxed opacity-70">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Testimonials Section - Clean & Premium */}
            < section className="w-full py-20 md:py-28 bg-gradient-to-br from-[#F5F1E8] via-white to-[#E8F0E6]/30 relative overflow-hidden" >
                {/* Decorative Elements */}
                < div className="absolute top-0 left-0 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2E7D32]/5 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
                    <div className="max-w-6xl mx-auto space-y-16">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center space-y-4"
                        >
                            <motion.span
                                initial={{ opacity: 0, letterSpacing: "0.5em" }}
                                whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
                                transition={{ duration: 0.8 }}
                                className="text-[#F4D03F] text-[10px] font-black uppercase tracking-[0.3em]"
                            >
                                ● Customer Stories
                            </motion.span>
                            <motion.h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#0F2E1C] leading-tight">
                                {["What", "our", "customers", "are", "saying"].map((word, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 * i, duration: 0.4 }}
                                        className="inline-block mr-2"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </motion.h2>
                        </motion.div>

                        {/* Testimonials Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    name: "Abel Tekle",
                                    role: "Professional Chef",
                                    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
                                    text: "The deep connection to the land is evident in every vegetable. Green Africa Farm isn't just a supplier; they are guardians of flavor and health.",
                                    rating: 5
                                },
                                {
                                    name: "Marta Solomon",
                                    role: "Mother of Three",
                                    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
                                    text: "Feeding my children produce that is truly organic and local is my priority. The vibrancy of their harvest is something you have to experience.",
                                    rating: 5
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 * i, duration: 0.7 }}
                                    whileHover={{ y: -8 }}
                                    className="p-8 md:p-10 rounded-2xl bg-white border border-stone-200/50 shadow-lg hover:shadow-2xl transition-all duration-500"
                                >
                                    {/* Quote Icon */}
                                    <div className="mb-6">
                                        <svg className="w-12 h-12 text-[#F4D03F]/30" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                        </svg>
                                    </div>

                                    {/* Stars */}
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(item.rating)].map((_, j) => (
                                            <motion.span
                                                key={j}
                                                initial={{ opacity: 0, scale: 0 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.3 + i * 0.1 + j * 0.05 }}
                                                className="text-[#F4D03F] text-xl"
                                            >
                                                ★
                                            </motion.span>
                                        ))}
                                    </div>

                                    {/* Quote Text */}
                                    <p className="font-serif text-lg md:text-xl text-[#0F2E1C] leading-relaxed mb-8 italic">
                                        "{item.text}"
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center gap-4 pt-6 border-t border-stone-200/50">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-[#F4D03F]/30 shadow-md"
                                        />
                                        <div>
                                            <div className="font-bold text-base text-[#0F2E1C]">{item.name}</div>
                                            <div className="text-sm text-[#2E7D32] font-medium">{item.role}</div>
                                        </div>
                                        <Leaf className="ml-auto h-8 w-8 text-[#2E7D32]/20" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Stats Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="grid grid-cols-3 gap-4 md:gap-8 pt-8 md:pt-12 border-t border-stone-200/50"
                        >
                            {[
                                { label: "Happy Customers", value: "2,400+" },
                                { label: "Organic Certified", value: "100%" },
                                { label: "Partner Farms", value: "45+" }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
                                    className="text-center"
                                >
                                    <div className="font-serif text-xl md:text-4xl font-black text-[#0F2E1C] mb-1 md:mb-2">{stat.value}</div>
                                    <div className="text-[10px] md:text-sm text-[#6D4C41] uppercase tracking-wider font-bold leading-tight">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* How It Works Section - Modern Timeline */}
            < section className="w-full py-16 md:py-28 bg-gradient-to-br from-[#E8F0E6]/30 via-white to-[#F5F1E8]/40 relative overflow-hidden" >
                {/* Decorative Elements */}
                < div className="absolute top-0 right-0 w-96 h-96 bg-[#2E7D32]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8 }}
                        className="text-center space-y-4 mb-12 md:mb-20"
                    >
                        <motion.span
                            initial={{ opacity: 0, letterSpacing: "0.5em" }}
                            whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
                            transition={{ duration: 0.8 }}
                            className="text-[#F4D03F] text-[10px] font-black uppercase tracking-[0.3em]"
                        >
                            ● How It Works
                        </motion.span>
                        <motion.h2 className="font-serif text-2xl md:text-4xl lg:text-5xl text-[#0F2E1C] leading-tight max-w-3xl mx-auto">
                            {["From", "seed", "to", "your", "table,", "our", "journey"].map((word, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * i, duration: 0.4 }}
                                    className="inline-block mr-1 md:mr-2"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </motion.h2>
                    </motion.div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#2E7D32]/20 via-[#F4D03F]/40 to-[#2E7D32]/20" />

                        <div className="space-y-16 md:space-y-24">
                            {[
                                {
                                    step: "01",
                                    title: "Soil Assessment & Planning",
                                    desc: "We analyze soil health, test nutrient levels, and plan strategic crop rotation to ensure optimal growing conditions for each season.",
                                    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=800",
                                    icon: "🌱"
                                },
                                {
                                    step: "02",
                                    title: "Seed Selection & Planting",
                                    desc: "Heritage and organic seeds are carefully selected and planted using sustainable methods that respect natural growing cycles.",
                                    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800",
                                    icon: "🌾"
                                },
                                {
                                    step: "03",
                                    title: "Natural Growth & Care",
                                    desc: "Crops are nurtured with organic compost, natural pest control, and careful monitoring—completely free from harmful chemicals.",
                                    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=800",
                                    icon: "🌿"
                                },
                                {
                                    step: "04",
                                    title: "Harvest & Delivery",
                                    desc: "Fresh produce is harvested at peak ripeness and delivered to your door within 24 hours, preserving maximum nutrition and flavor.",
                                    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800",
                                    icon: "📦"
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 60 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ delay: i * 0.1, duration: 0.8 }}
                                    className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                                >
                                    {/* Content Side */}
                                    <div className={`space-y-6 ${i % 2 === 1 ? 'md:order-2 md:text-right md:items-end' : 'md:order-1'} flex flex-col`}>
                                        <div className={`flex items-center gap-3 md:gap-4 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                whileInView={{ scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200 }}
                                                className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#F4D03F] to-[#f4d03f]/80 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shrink-0"
                                            >
                                                <span className="text-2xl md:text-3xl">{item.icon}</span>
                                            </motion.div>
                                            <div className="flex-1">
                                                <div className="text-[#2E7D32] text-[10px] md:text-sm font-black uppercase tracking-widest mb-0.5 md:mb-1">Step {item.step}</div>
                                                <h3 className="font-serif text-xl md:text-3xl font-bold text-[#0F2E1C]">{item.title}</h3>
                                            </div>
                                        </div>
                                        <p className="text-sm md:text-base text-[#6D4C41] leading-relaxed opacity-80 max-w-md">
                                            {item.desc}
                                        </p>
                                    </div>

                                    {/* Image Side */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className={`relative ${i % 2 === 1 ? 'md:order-1' : 'md:order-2'}`}
                                    >
                                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200/50">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-64 md:h-80 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        </div>
                                        {/* Step Number Badge */}
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            whileInView={{ scale: 1, rotate: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 150 }}
                                            className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-14 h-14 md:w-20 md:h-20 bg-[#0F2E1C] rounded-full flex items-center justify-center shadow-2xl border-2 md:border-4 border-white"
                                        >
                                            <span className="text-2xl md:text-3xl font-black text-[#F4D03F]">{item.step}</span>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section >

            {/* Trusted By / Clients Section */}
            < section className="w-full py-20 md:py-28 bg-white relative overflow-hidden" >
                {/* Decorative Background */}
                < div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(46,125,50,0.03),transparent_50%)]" />

                <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center space-y-4 mb-16"
                    >
                        <motion.span
                            initial={{ opacity: 0, letterSpacing: "0.5em" }}
                            whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
                            transition={{ duration: 0.8 }}
                            className="text-[#F4D03F] text-[10px] font-black uppercase tracking-[0.3em]"
                        >
                            ● Trusted By
                        </motion.span>
                        <motion.h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#0F2E1C] leading-tight">
                            {["Loved", "by", "families,", "trusted", "by", "chefs"].map((word, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * i, duration: 0.4 }}
                                    className="inline-block mr-2"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </motion.h2>
                    </motion.div>

                    {/* Client Testimonials Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {[
                            {
                                name: "Sarah Johnson",
                                role: "Home Chef & Mother",
                                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
                                rating: 5,
                                text: "The quality is unmatched! My family can taste the difference in every meal."
                            },
                            {
                                name: "Chef Marcus Lee",
                                role: "Restaurant Owner",
                                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
                                rating: 5,
                                text: "Green Africa Farm supplies our restaurant with the freshest organic produce. Our customers love it!"
                            },
                            {
                                name: "Emily Rodriguez",
                                role: "Wellness Coach",
                                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
                                rating: 5,
                                text: "Finally, a farm that truly understands organic. I recommend them to all my clients."
                            }
                        ].map((client, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                whileHover={{ y: -8 }}
                                className="p-6 rounded-xl bg-gradient-to-br from-[#F5F1E8] to-white border border-stone-200/50 shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(client.rating)].map((_, j) => (
                                        <motion.span
                                            key={j}
                                            initial={{ opacity: 0, scale: 0 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 + i * 0.1 + j * 0.05 }}
                                            className="text-[#F4D03F] text-lg"
                                        >
                                            ★
                                        </motion.span>
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-sm text-[#6D4C41] leading-relaxed mb-6 italic">
                                    "{client.text}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3 pt-4 border-t border-stone-200/50">
                                    <img
                                        src={client.image}
                                        alt={client.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                                    />
                                    <div>
                                        <div className="font-bold text-sm text-[#0F2E1C]">{client.name}</div>
                                        <div className="text-xs text-[#2E7D32] font-medium">{client.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Trust Metrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-2xl bg-gradient-to-r from-[#0F2E1C] to-[#1a3d28] text-white"
                    >
                        {[
                            { value: "2,400+", label: "Happy Customers" },
                            { value: "100%", label: "Organic Certified" },
                            { value: "45+", label: "Partner Farms" },
                            { value: "10+", label: "Years Experience" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
                                className="text-center"
                            >
                                <div className="font-serif text-3xl md:text-4xl font-black text-[#F4D03F] mb-2">{stat.value}</div>
                                <div className="text-xs md:text-sm text-white/70 uppercase tracking-wider font-bold">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Partner Logos */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="mt-16 text-center"
                    >
                        <p className="text-xs uppercase tracking-widest font-bold text-[#6D4C41]/50 mb-8">Partnered With Leading Organizations</p>
                        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                            {["🌾 Organic Alliance", "🍃 Green Earth", "🌱 Farm Fresh Co", "💚 Eco Partners"].map((partner, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.7 + i * 0.1 }}
                                    className="text-lg font-bold text-[#0F2E1C]"
                                >
                                    {partner}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section >

            {/* FAQ Section */}
            < section className="w-full py-16 md:py-24 bg-white" >
                <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <span className="text-[#F4D03F] text-[10px] font-black uppercase tracking-[0.3em]">● Frequently Asked Questions</span>
                                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#0F2E1C] leading-tight">
                                    Simple, clear answers to help you understand our work better
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {[
                                    {
                                        q: "What makes your farm products organic?",
                                        a: "We follow natural farming methods, avoid all chemical fertilizers and pesticides, and focus on soil health to ensure every product is clean and truly organic."
                                    },
                                    {
                                        q: "Do you use any chemical additives in your produce?",
                                        a: "Absolutely not. We are committed to 100% chemical-free farming. Our crops are grown using only organic compost, natural pest control, and sustainable practices."
                                    },
                                    {
                                        q: "How do you maintain freshness during delivery?",
                                        a: "We harvest in the early morning and deliver within 24 hours using temperature-controlled transport to preserve maximum freshness and nutrition."
                                    },
                                    {
                                        q: "Can I visit your farm?",
                                        a: "Yes! We welcome farm visits. Contact us to schedule a tour and see our sustainable farming practices firsthand."
                                    }
                                ].map((item, i) => (
                                    <motion.details
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1, duration: 0.5 }}
                                        className="group p-6 rounded-2xl bg-[#F5F1E8] border border-stone-200/50 hover:shadow-lg transition-all duration-300"
                                    >
                                        <summary className="flex items-center justify-between cursor-pointer list-none">
                                            <span className="font-bold text-sm md:text-base text-[#0F2E1C] pr-4">{i + 1}. {item.q}</span>
                                            <span className="text-2xl text-[#F4D03F] group-open:rotate-45 transition-transform duration-300">+</span>
                                        </summary>
                                        <p className="mt-4 text-sm text-[#6D4C41] leading-relaxed opacity-80 pl-6 border-l-2 border-[#F4D03F]">
                                            {item.a}
                                        </p>
                                    </motion.details>
                                ))}
                            </div>
                        </motion.div>

                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                            className="relative lg:sticky lg:top-32"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000"
                                    alt="Farmer in field"
                                    className="w-full h-96 md:h-[600px] object-cover"
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-12 h-12 rounded-full bg-[#F4D03F] border-2 border-white flex items-center justify-center">
                                                <span className="text-lg">👤</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <div className="font-bold text-2xl text-[#0F2E1C]">4K+</div>
                                        <div className="text-xs text-[#6D4C41] font-medium">Happy Customers</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* Back to Top Button */}
            <AnimatePresence>
                {
                    showBackToTop && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: 20 }}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={scrollToTop}
                            className="fixed bottom-8 right-8 z-50 p-4 bg-[#0F2E1C] text-white rounded-full shadow-2xl border border-white/20 group hover:bg-[#2E7D32] transition-colors"
                            aria-label="Back to Top"
                        >
                            <ArrowUp className="h-6 w-6 group-hover:animate-bounce" />
                        </motion.button>
                    )
                }
            </AnimatePresence >
        </div >

    );
}


