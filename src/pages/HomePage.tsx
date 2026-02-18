
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Leaf, ShieldCheck, Zap, Globe, Heart, ArrowRight, ArrowUp, Play, Settings, Activity, Fingerprint, X, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { api, Product } from '@/services/api';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import { ProductCard } from '@/components/ProductCard';

export function HomePage() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();
    const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const barOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

    const heroY = useTransform(scrollYProgress, [0, 0.4], [0, 120]);
    const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.15]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.getAllProducts({ limit: 100 }), // Increased limit for better search coverage
                    api.getCategories()
                ]);

                if (productsRes.success) {
                    setAllProducts(productsRes.data);
                    setFilteredProducts(productsRes.data);
                }
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

    useEffect(() => {
        // Fast client-side filtering including localized fields
        const filtered = allProducts.filter(product => {
            const searchLower = searchQuery.toLowerCase();
            return !searchQuery ||
                product.name.toLowerCase().includes(searchLower) ||
                product.category?.toLowerCase().includes(searchLower) ||
                product.description?.toLowerCase().includes(searchLower) ||
                product.description_am?.toLowerCase().includes(searchLower) ||
                product.description_om?.toLowerCase().includes(searchLower);
        });
        setFilteredProducts(filtered);
    }, [searchQuery, allProducts]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
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
            <section className="w-full py-12 md:py-24 bg-white overflow-hidden" >
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

            {/* Journey Video Section - New */}
            <section className="relative w-full h-screen flex items-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=2000"
                        alt="Farmer Field"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10 py-20">
                    <div className="max-w-4xl space-y-8">
                        {/* Label Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4D03F] text-black text-[10px] md:text-xs font-black uppercase tracking-widest rounded-full"
                        >
                            <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                            Watch Our Video
                        </motion.div>

                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl md:text-7xl font-sans font-bold text-white leading-[1.1] tracking-tight"
                        >
                            Follow the journey of pure farming where nature, technique & passion come together
                        </motion.h2>

                        {/* Play Button & Extra Info - Now on Left */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pt-4">
                            <motion.button
                                onClick={() => setIsVideoModalOpen(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative w-20 h-20 md:w-24 md:h-24 bg-[#F4D03F] rounded-full flex items-center justify-center shadow-2xl group shrink-0"
                            >
                                <Play className="w-6 h-6 md:w-8 md:h-8 text-black fill-black" />

                                {/* Rotating Text Wrapper */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-60 transition-opacity scale-110"
                                >
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <path id="circlePathSmall" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                                        <text className="text-[10px] uppercase font-black tracking-[0.2em] fill-black">
                                            <textPath xlinkHref="#circlePathSmall">
                                                Watch Journey • Watch Journey •
                                            </textPath>
                                        </text>
                                    </svg>
                                </motion.div>
                            </motion.button>

                            <div className="space-y-1">
                                <p className="text-[#F4D03F] font-serif italic text-lg md:text-xl">The Farm Documentary</p>
                                <p className="text-white/60 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">6:45 Minutes • Cinematic Experience</p>
                                <p className="text-white/40 text-[9px] md:text-[10px] max-w-xs leading-relaxed">Discover how we cultivate life in the Ethiopian highlands through traditional wisdom and sustainable techniques.</p>
                            </div>
                        </div>

                        {/* USPs - Now internal and strictly on the left */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pt-12 md:pt-16">
                            {[
                                {
                                    icon: Settings,
                                    title: "Sustainable Farming",
                                    desc: "From planting to harvesting, explore the processes that ensure pure food."
                                },
                                {
                                    icon: Activity,
                                    title: "Experience Passion",
                                    desc: "Watch the dedication and effort that goes into every step."
                                },
                                {
                                    icon: Fingerprint,
                                    title: "Truly Pure Produce",
                                    desc: "Traditional wisdom meets modern sustainable practices."
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    className="flex flex-col items-start gap-4"
                                >
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#F4D03F] flex items-center justify-center shrink-0 shadow-lg">
                                        <item.icon className="w-5 h-5 md:w-6 md:h-6 text-black" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-white font-bold text-base md:text-lg leading-tight">{item.title}</h4>
                                        <p className="text-white/50 text-[10px] md:text-xs leading-relaxed max-w-[200px]">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Shop by Category Section */}
            <section className="w-full py-12 md:py-20 bg-white">
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
            <section className="w-full py-12 md:py-24 bg-[#E8F0E6]/40 text-center">
                <div className="container mx-auto px-2 md:px-6 max-w-[1440px]">
                    <div className="space-y-12 md:space-y-16">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true, amount: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col items-center gap-4 relative">
                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    whileInView={{ width: 80, opacity: 1 }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className="h-1 bg-[#2E7D32] rounded-full"
                                />
                                <div className="overflow-hidden py-2">
                                    <motion.h2
                                        initial={{ y: "100%" }}
                                        whileInView={{ y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                        className="font-serif text-4xl md:text-6xl lg:text-7xl text-[#0F2E1C] tracking-tight"
                                    >
                                        Our Product
                                    </motion.h2>
                                </div>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                    className="font-sans text-sm md:text-lg text-[#6D4C41] font-medium max-w-2xl mx-auto italic px-4 leading-relaxed"
                                >
                                    "Nature's finest seasonal produce, grown with respect for the land and delivered fresh to your table."
                                </motion.p>

                                {/* Search Bar for Fast Filtering */}
                                <div className="w-full max-w-md mt-6 relative group">
                                    <div className="absolute inset-0 bg-[#2E7D32]/5 rounded-2xl blur-xl group-hover:bg-[#2E7D32]/10 transition-all" />
                                    <div className="relative flex items-center bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#2E7D32]/30 transition-all">
                                        <div className="pl-4 text-stone-400">
                                            <Search className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Fast search product..."
                                            className="flex-1 h-12 bg-transparent border-none focus:ring-0 text-stone-800 placeholder:text-stone-400 font-medium pl-3 text-sm"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="p-2 mr-2 text-stone-400 hover:text-stone-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Scroll Controls (Desktop) */}
                                <div className="hidden md:flex absolute right-0 bottom-0 gap-2">
                                    <button
                                        onClick={() => scroll('left')}
                                        className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center hover:bg-[#0F2E1C] hover:text-white transition-all shadow-sm"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => scroll('right')}
                                        className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center hover:bg-[#0F2E1C] hover:text-white transition-all shadow-sm"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {filteredProducts.length === 0 ? (
                            <div className="py-20 text-stone-400 font-bold font-serif italic text-xl">
                                {searchQuery ? "No matching product found." : "The fields are resting. Check back soon for the next product."}
                            </div>
                        ) : (
                            <div
                                ref={scrollRef}
                                className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-12 no-scrollbar scroll-smooth px-4 -mx-4 group"
                            >
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="min-w-[280px] sm:min-w-[340px] flex-shrink-0 snap-start">
                                        <ProductCard product={product} />
                                    </div>
                                ))}

                                {/* View More Card at the end of scroll */}
                                <motion.div
                                    className="min-w-[200px] flex-shrink-0 snap-start flex items-center justify-center h-full"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                >
                                    <Link
                                        to="/products"
                                        className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-[#2E7D32] hover:text-white transition-all group/btn"
                                    >
                                        <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </motion.div>
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
            </section>

            {/* Why Choose Us Section - Warm Beige */}
            <section className="w-full py-16 md:py-24 bg-[#F5F1E8]">
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

            {/* Trusted By Section - Infinite Loop */}
            <section className="w-full py-20 md:py-32 bg-[#FCFAFA] overflow-hidden relative">
                {/* Vibrant Africa-Inspired Accent Circles */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#2E7D32]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 -left-32 w-80 h-80 bg-[#C62828]/5 rounded-full blur-3xl pointer-events-none" />

                {/* Ethiopian Messai Decorative Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.01] pointer-events-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L100 50 L50 100 L0 50 Z' fill='%236D4C41'/%3E%3C/svg%3E")`, backgroundSize: '40px' }} />
                <div className="container mx-auto px-4 md:px-6 max-w-7xl mb-12 text-center relative">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#F4D03F] text-[10px] md:text-xs font-black uppercase tracking-[0.5em] mb-4 inline-block"
                    >
                        ● Trusted By
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-serif text-4xl md:text-6xl text-[#0F2E1C] leading-tight"
                    >
                        Loved by <span className="italic text-[#2E7D32]">families</span>, trusted by <span className="italic text-[#6D4C41]">chefs</span>
                    </motion.h2>
                </div>

                {/* Primary Testimonial Scroll */}
                <div className="relative flex overflow-hidden">
                    <div className="flex animate-scroll whitespace-nowrap gap-6 py-4">
                        {[
                            {
                                name: "Abel Tekle",
                                role: "Executive Chef, Addis",
                                text: "The deep connection to the land is evident in every vegetable. Green Africa Farm isn't just a supplier; they are guardians of flavor and health.",
                                img: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&q=80&w=400"
                            },
                            {
                                name: "Hiwot Solomon",
                                role: "Mother & Nutritionist",
                                text: "Feeding my children produce that is truly organic and local is my priority. The vibrancy of their harvest is something you have to experience.",
                                img: "data:image/jpeg;base64,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"
                            },
                            {
                                name: "Bruke Bekele",
                                role: "Professional Chef",
                                text: "As a chef, I value the nutrient density of soil-grown produce. This farm consistently delivers excellence to our community kitchen.",
                                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
                            },
                            {
                                name: "Selamawit T.",
                                role: "Wellness Advocate",
                                text: "The integrity of their farming practices is what sets them apart. Clean, honest food delivered right to our doorstep in Addis.",
                                img: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=400"
                            },
                            {
                                name: "Dawit Yohannes",
                                role: "Restaurant Owner",
                                text: "Supporting local farmers while getting world-class organic produce. It's a win-win for everyone involved in the cycle.",
                                img: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400"
                            }
                        ].map((t, i) => (
                            <div key={i} className="flex-shrink-0 w-[300px] md:w-[400px] bg-white p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative">
                                <div className="space-y-6">
                                    {/* Star Rating */}
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(s => <span key={s} className="text-[#F4D03F] text-xs">★</span>)}
                                    </div>

                                    {/* Testimonial Text */}
                                    <p className="text-[#6D4C41] italic leading-relaxed text-sm md:text-base whitespace-normal font-medium">
                                        "{t.text}"
                                    </p>

                                    {/* Divider */}
                                    <div className="w-full h-px bg-stone-100" />

                                    {/* Profile */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-stone-100">
                                            <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0F2E1C] text-sm md:text-base">{t.name}</h4>
                                            <p className="text-[10px] md:text-xs text-[#2E7D32] font-semibold">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Loop Duplicate */}
                        {[
                            {
                                name: "Abel Tekle",
                                role: "Executive Chef, Addis",
                                text: "The deep connection to the land is evident in every vegetable. Green Africa Farm isn't just a supplier; they are guardians of flavor and health.",
                                img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400"
                            },
                            {
                                name: "Hiwot Solomon",
                                role: "Mother & Nutritionist",
                                text: "Feeding my children produce that is truly organic and local is my priority. The vibrancy of their harvest is something you have to experience.",
                                img: "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?auto=format&fit=crop&q=80&w=400"
                            },
                            {
                                name: "Bruke Bekele",
                                role: "Professional Chef",
                                text: "As a chef, I value the nutrient density of soil-grown produce. This farm consistently delivers excellence to our community kitchen.",
                                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
                            },
                            {
                                name: "Selamawit T.",
                                role: "Wellness Advocate",
                                text: "The integrity of their farming practices is what sets them apart. Clean, honest food delivered right to our doorstep in Addis.",
                                img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400"
                            },
                            {
                                name: "Dawit Yohannes",
                                role: "Restaurant Owner",
                                text: "Supporting local farmers while getting world-class organic produce. It's a win-win for everyone involved in the cycle.",
                                img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"
                            }
                        ].map((t, i) => (
                            <div key={`dup-${i}`} className="flex-shrink-0 w-[300px] md:w-[400px] bg-white p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative">
                                <div className="space-y-6">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(s => <span key={s} className="text-[#F4D03F] text-xs">★</span>)}
                                    </div>

                                    <p className="text-[#6D4C41] italic leading-relaxed text-sm md:text-base whitespace-normal font-medium">
                                        "{t.text}"
                                    </p>

                                    <div className="w-full h-px bg-stone-100" />

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-stone-100">
                                            <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0F2E1C] text-sm md:text-base">{t.name}</h4>
                                            <p className="text-[10px] md:text-xs text-[#2E7D32] font-semibold">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
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
                            className="fixed bottom-8 left-8 z-50 p-4 bg-[#0F2E1C] text-white rounded-full shadow-2xl border border-white/20 group hover:bg-[#2E7D32] transition-colors"
                            aria-label="Back to Top"
                        >
                            <ArrowUp className="h-6 w-6 group-hover:animate-bounce" />
                        </motion.button>
                    )
                }
            </AnimatePresence >

            {/* Video Modal */}
            <AnimatePresence>
                {
                    isVideoModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-100 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
                        >
                            <motion.button
                                onClick={() => setIsVideoModalOpen(false)}
                                className="absolute top-6 right-6 p-4 text-white hover:text-[#F4D03F] transition-colors z-110"
                            >
                                <X className="w-8 h-8 md:w-10 md:h-10" />
                            </motion.button>

                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src="https://www.youtube.com/embed/TCk6LeLZF0M?autoplay=1"
                                    title="Farm Journey"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </motion.div>
                        </motion.div>
                    )
                }
            </AnimatePresence >
        </div >

    );
}


